import axios from "axios";

const MFAPI_URL = "https://api.mfapi.in/mf";

interface MFAPIResult {
  schemeCode: string;
  schemeName: string;
}

export const enrichWithLiveData = async (holdings: any[]) => {
  console.log("📡 Fetching Real-Time Market Data...");
  
  // We map over holdings and try to find their live NAV
  const enrichedHoldings = await Promise.all(holdings.map(async (h) => {
    try {
      // 1. Search for the Scheme Code (Fuzzy Search)
      const searchUrl = `${MFAPI_URL}/search?q=${encodeURIComponent(h.schemeName.split(" -")[0])}`; // Search by base name
      const { data: searchResults } = await axios.get<MFAPIResult[]>(searchUrl);

      if (!searchResults || searchResults.length === 0) {
        return { ...h, liveNav: null, pnl: 0 };
      }

      // Best match is usually the first one, but in prod we use better logic
      const bestMatch = searchResults[0];

      // 2. Get Live NAV Details
      const navUrl = `${MFAPI_URL}/${bestMatch.schemeCode}`;
      const { data: navData } = await axios.get(navUrl);

      if (navData && navData.data && navData.data.length > 0) {
        const latestNav = parseFloat(navData.data[0].nav);
        const date = navData.data[0].date;
        
        // Calculate Real-Time Value
        // Note: PDF gives us 'currentValue', but we don't strictly know 'units' * 'avgNav' accurately from just a statement summary sometimes.
        // Assuming 'units' extracted is correct:
        const realTimeValue = h.units * latestNav;
        const valueDifference = realTimeValue - h.currentValue; // Approx Day Change/Gap
        
        return {
          ...h,
          liveNav: latestNav,
          lastUpdated: date,
          realTimeValue: parseFloat(realTimeValue.toFixed(2)),
          gain: parseFloat(valueDifference.toFixed(2))
        };
      }

      return { ...h, liveNav: null };

    } catch (err) {
      console.error(`Failed to fetch data for ${h.schemeName}`);
      return { ...h, liveNav: null };
    }
  }));

  return enrichedHoldings;
};
