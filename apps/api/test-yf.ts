import yahooFinance from 'yahoo-finance2';

async function test() {
    try {
        console.log("Fetching NIFTY 50...");
        const quote = await yahooFinance.quote('^NSEI');
        console.log("Success:", quote.symbol, quote.regularMarketPrice);
        
        console.log("Fetching RELIANCE...");
        const stock = await yahooFinance.quote('RELIANCE.NS');
        console.log("Success:", stock.symbol, stock.regularMarketPrice);
    } catch (err: any) {
        console.error("YF Error:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
}

test();
