import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function testDetail() {
    const ticker = 'INFY.NS';
    try {
        console.log(`Fetching detail for ${ticker}...`);
        const info: any = await yahooFinance.quoteSummary(ticker, {
            modules: ["price", "summaryDetail", "defaultKeyStatistics", "summaryProfile"]
        });
        
        console.log("Modules found:", Object.keys(info));
        if (info.price) {
           console.log("Price Quote Info:", JSON.stringify(info.price, null, 2));
        }
        if (info.summaryDetail) {
           console.log("Summary Detail Info:", JSON.stringify(info.summaryDetail, null, 2));
        }
        
    } catch (err: any) {
        console.error("YF Detail Error:", err.message);
    }
}

testDetail();
