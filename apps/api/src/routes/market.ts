import express from "express";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import axios from "axios";
import Redis from "ioredis";

const router = express.Router();

// 1. Initialize Redis with fallback to In-Memory for dev
let redis: Redis | null = null;
try {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    redis.on('error', (err) => {
        console.warn("⚠️ Redis Error:", err.message);
        redis = null; // Revert to in-memory if redis fails
    });
} catch (e: any) {
    console.warn("⚠️ No Redis connection available. Falling back to in-memory caching.");
}

const MEMORY_CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

async function getCached<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Try Redis
    if (redis) {
        try {
            const cached = await redis.get(key);
            if (cached) return JSON.parse(cached);
        } catch (err) {
            console.error("Redis Cache Read Error:", err);
        }
    } else {
        // Try Memory Cache
        const item = MEMORY_CACHE.get(key);
        if (item && Date.now() - item.timestamp < CACHE_TTL) {
            return item.data;
        }
    }

    // Fetch Fresh
    const freshData = await fetchFn();

    // Cache it
    if (redis) {
        try {
            await redis.set(key, JSON.stringify(freshData), "EX", 60);
        } catch (err) {
            console.error("Redis Cache Write Error:", err);
        }
    } else {
        MEMORY_CACHE.set(key, { data: freshData, timestamp: Date.now() });
    }

    return freshData;
}

// 2. Market Endpoints

const MOCK_INDICES = {
    data: [
        { index: "NIFTY 50", last: 22453.30, variation: 162.10, percentChange: 0.73 },
        { index: "NIFTY BANK", last: 47835.80, variation: 350.15, percentChange: 0.74 },
        { index: "SENSEX", last: 74014.55, variation: 535.15, percentChange: 0.73 },
        { index: "NIFTY IT", last: 35122.10, variation: -120.40, percentChange: -0.34 }
    ]
};

// GET /api/market/nifty -> Nifty 50 live price + change %
router.get("/nifty", async (req, res) => {
    try {
        const data = await getCached("market:nifty", async () => {
            try {
                const quote: any = await yahooFinance.quote('^NSEI');
                return {
                    symbol: quote.symbol,
                    name: "NIFTY 50",
                    price: quote.regularMarketPrice,
                    change: quote.regularMarketChange,
                    pChange: quote.regularMarketChangePercent,
                    timestamp: quote.regularMarketTime,
                    marketState: quote.marketState
                };
            } catch (yfError: any) {
                console.warn("⚠️ Yahoo Finance Fetch Failed for ^NSEI:", yfError.message);
                // Return static fallback instead of 500
                return { symbol: "^NSEI", name: "NIFTY 50", price: 22453.3, change: 162.1, pChange: 0.73, timestamp: Date.now(), marketState: "CLOSED" };
            }
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Nifty fetch failed", message: error.message });
    }
});

// GET /api/market/indices -> Multiple major indices
router.get("/indices", async (req, res) => {
    try {
        const data = await getCached("market:indices", async () => {
            try {
                const symbols = ['^NSEI', '^NSEBANK', '^BSESN', 'NIFTY_IT.NS'];
                const quotes: any[] = await yahooFinance.quote(symbols) as any[];
                return {
                    data: quotes.map((q: any) => ({
                        index: q.symbol === '^NSEI' ? 'NIFTY 50' : q.symbol === '^NSEBANK' ? 'NIFTY BANK' : q.symbol === '^BSESN' ? 'SENSEX' : q.symbol,
                        last: q.regularMarketPrice,
                        variation: q.regularMarketChange,
                        percentChange: q.regularMarketChangePercent
                    }))
                };
            } catch (yfError: any) {
                console.warn("⚠️ Indices Fetch Failed:", yfError.message);
                return MOCK_INDICES;
            }
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch indices" });
    }
});


// GET /api/market/mf/:code -> Mutual fund NAV via mfapi.in
router.get("/mf/:code", async (req, res) => {
    const { code } = req.params;
    try {
        const data = await getCached(`market:mf:${code}`, async () => {
            const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
            return {
                meta: response.data.meta,
                latestNav: response.data.data[0],
                history: response.data.data.slice(0, 30) // Last 30 days
            };
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Mutual Fund data pulse lost" });
    }
});

// GET /api/market/status -> Market Status (Simulated from Quote state)
router.get("/status", async (req, res) => {
    try {
        const quote: any = await yahooFinance.quote('^NSEI');
        res.json({
            marketState: [{
                market: "Capital Market",
                marketStatus: quote.marketState === "REGULAR" ? "Open" : "Closed",
                lastUpdateTime: quote.regularMarketTime,
                tradeDate: new Date(quote.regularMarketTime).toDateString()
            }]
        });
    } catch (error: any) {
        // Fallback for status
        res.json({
            marketState: [{
                market: "Capital Market",
                marketStatus: "Closed",
                lastUpdateTime: new Date().toISOString(),
                tradeDate: new Date().toDateString()
            }]
        });
    }
});

// GET /api/market/gainers-losers -> Mock or simplified for demo
router.get("/gainers-losers", async (req, res) => {
    try {
        const data = await getCached("market:trends", async () => {
            try {
                const symbols = [
                    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
                    'HINDUNILVR.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'KOTAKBANK.NS'
                ];
                const quotes: any = await yahooFinance.quote(symbols);
                
                // Sort by change percent
                const sorted = quotes.sort((a: any, b: any) => (b.regularMarketChangePercent || 0) - (a.regularMarketChangePercent || 0));
                
                const mapper = (q: any) => ({
                    symbol: q.symbol.split('.')[0],
                    series: "EQ",
                    lastPrice: q.regularMarketPrice,
                    pChange: q.regularMarketChangePercent
                });

                return {
                    gainers: sorted.slice(0, 5).map(mapper),
                    losers: [...sorted].reverse().slice(0, 5).map(mapper)
                };
            } catch (yfError: any) {
                console.warn("⚠️ Trend Fetch Failed:", yfError.message);
                return {
                    gainers: [
                        { symbol: "RELIANCE", series: "EQ", lastPrice: 2987.50, pChange: 1.25 },
                        { symbol: "TCS", series: "EQ", lastPrice: 4120.30, pChange: 0.85 }
                    ],
                    losers: [
                        { symbol: "INFY", series: "EQ", lastPrice: 1602.10, pChange: -1.45 },
                        { symbol: "ITC", series: "EQ", lastPrice: 425.00, pChange: -0.65 }
                    ]
                };
            }
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Trends fetch failed" });
    }
});

// GET /api/market/search?q={query}
router.get("/search", async (req, res) => {
    const query = (req.query.q as string || "").toUpperCase();
    
    const STATIC_STOCKS = [
        { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE" },
        { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE" },
        { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE" },
        { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE" },
        { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE" },
        { symbol: "SBIN", name: "State Bank of India", exchange: "NSE" },
        { symbol: "ITC", name: "ITC Ltd", exchange: "NSE" },
        { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", exchange: "NSE" },
        { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", exchange: "NSE" },
        { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", exchange: "NSE" },
        { symbol: "LT", name: "Larsen & Toubro Ltd", exchange: "NSE" },
        { symbol: "AXISBANK", name: "Axis Bank Ltd", exchange: "NSE" },
        { symbol: "ASIANPAINT", name: "Asian Paints Ltd", exchange: "NSE" },
        { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", exchange: "NSE" },
        { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd", exchange: "NSE" },
        { symbol: "TITAN", name: "Titan Company Ltd", exchange: "NSE" },
        { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd", exchange: "NSE" },
        { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", exchange: "NSE" },
        { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE" },
        { symbol: "NESTLEIND", name: "Nestle India Ltd", exchange: "NSE" }
    ];

    try {
        if (!query) return res.json(STATIC_STOCKS.slice(0, 10));

        // Filter static list first
        let results = STATIC_STOCKS.filter(s => 
            s.symbol.includes(query) || s.name.toUpperCase().includes(query)
        );

        // If not enough results, hit YF search
        if (results.length < 5) {
            try {
                const yfResults: any = await yahooFinance.search(query);
                const nseResults = yfResults.quotes
                    .filter((q: any) => q.exchange === 'NSI' || q.symbol.endsWith('.NS'))
                    .map((q: any) => ({
                        symbol: q.symbol.replace('.NS', ''),
                        name: q.shortname || q.longname || q.symbol,
                        exchange: "NSE",
                        type: q.quoteType
                    }));
                results = [...results, ...nseResults];
            } catch (err) {
                console.warn("YF Search Failed:", err);
            }
        }

        // Deduplicate
        const unique = Array.from(new Map(results.map(item => [item.symbol, item])).values());
        res.json(unique.slice(0, 10));
    } catch (error) {
        res.json(STATIC_STOCKS.slice(0, 5));
    }
});

// GET /api/market/stock/:symbol -> Full details
router.get("/stock/:symbol", async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const ticker = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`;

    try {
        const data = await getCached(`market:detail:${ticker}`, async () => {
            try {
                const info: any = await yahooFinance.quoteSummary(ticker, {
                    modules: ["price", "summaryDetail", "defaultKeyStatistics", "summaryProfile"]
                });

                const getRaw = (obj: any) => obj && typeof obj === 'object' && 'raw' in obj ? obj.raw : (typeof obj === 'number' ? obj : 0);

                return {
                    symbol: symbol,
                    name: info.price?.longName || info.price?.shortName || symbol,
                    exchange: info.price?.exchangeName || "NSE",
                    price: getRaw(info.price?.regularMarketPrice),
                    change: getRaw(info.price?.regularMarketChange),
                    change_percent: getRaw(info.price?.regularMarketChangePercent),
                    open: getRaw(info.price?.regularMarketOpen),
                    high: getRaw(info.price?.regularMarketDayHigh),
                    low: getRaw(info.price?.regularMarketDayLow),
                    prev_close: getRaw(info.price?.regularMarketPreviousClose),
                    volume: getRaw(info.summaryDetail?.regularMarketVolume),
                    avg_volume: getRaw(info.summaryDetail?.averageVolume),
                    market_cap: getRaw(info.summaryDetail?.marketCap),
                    pe_ratio: getRaw(info.summaryDetail?.forwardPE || info.summaryDetail?.trailingPE),
                    pb_ratio: getRaw(info.defaultKeyStatistics?.priceToBook),
                    eps: getRaw(info.defaultKeyStatistics?.trailingEps),
                    dividend_yield: getRaw(info.summaryDetail?.dividendYield),
                    beta: getRaw(info.summaryDetail?.beta),
                    week_52_high: getRaw(info.summaryDetail?.fiftyTwoWeekHigh),
                    week_52_low: getRaw(info.summaryDetail?.fiftyTwoWeekLow),
                    sector: info.summaryProfile?.sector,
                    industry: info.summaryProfile?.industry,
                    description: info.summaryProfile?.longBusinessSummary,
                    currency: info.price?.currency || "INR"
                };
            } catch (yfError: any) {
                console.warn(`YF Info Failed for ${ticker}:`, yfError.message);
                // Partial fallback from quote (cheaper call)
                const quote: any = await yahooFinance.quote(ticker);
                return {
                    symbol: symbol,
                    name: symbol,
                    exchange: "NSE",
                    price: quote.regularMarketPrice,
                    change: quote.regularMarketChange || 0,
                    change_percent: quote.regularMarketChangePercent || 0,
                    open: quote.regularMarketOpen,
                    high: quote.regularMarketDayHigh,
                    low: quote.regularMarketDayLow,
                    prev_close: quote.regularMarketPreviousClose,
                    volume: quote.regularMarketVolume,
                    avg_volume: 0,
                    market_cap: 0,
                    pe_ratio: 0,
                    pb_ratio: 0,
                    eps: 0,
                    dividend_yield: 0,
                    beta: 0,
                    week_52_high: 0,
                    week_52_low: 0,
                    sector: "N/A",
                    industry: "N/A",
                    description: "Details unavailable.",
                    currency: "INR"
                };
            }
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to load stock detail", message: error.message });
    }
});

// GET /api/market/stock/:symbol/history?period=1y
router.get("/stock/:symbol/history", async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const period = (req.query.period as string) || "1y";
    const ticker = symbol === '^NSEI' || symbol === '^BSESN' ? symbol : `${symbol}.NS`;

    try {
        const data = await getCached(`market:history:${ticker}:${period}`, async () => {
            const end = new Date();
            let start = new Date();
            
            switch(period) {
                case '1d': start.setHours(start.getHours() - 24); break;
                case '1w': start.setDate(start.getDate() - 7); break;
                case '1m': start.setMonth(start.getMonth() - 1); break;
                case '3m': start.setMonth(start.getMonth() - 3); break;
                case '6m': start.setMonth(start.getMonth() - 6); break;
                case '1y': start.setFullYear(start.getFullYear() - 1); break;
                case '5y': start.setFullYear(start.getFullYear() - 5); break;
                default: start.setFullYear(start.getFullYear() - 1);
            }

            const interval: any = period === '1d' ? '15m' : period === '1w' ? '1h' : '1d';
            
            const result: any = await yahooFinance.historical(ticker, {
                period1: start,
                period2: end,
                interval: interval
            });

            return result
                .filter((day: any) => day.close != null && !isNaN(Number(day.close)))
                .map((day: any) => ({
                    date: day.date.toISOString(),
                    open: Number(day.open) || 0,
                    high: Number(day.high) || 0,
                    low: Number(day.low) || 0,
                    close: Number(day.close) || 0,
                    volume: Number(day.volume) || 0
                }));
        });
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to load history", message: error.message });
    }
});

export default router;
