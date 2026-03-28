import * as XLSX from 'xlsx';

export interface SpreadsheetHolding {
    schemeName: string;
    folio: string;
    units: number;
    currentValue: number;
    category: string;
}

export const extractFromSpreadsheet = (filePath: string): SpreadsheetHolding[] => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const holdings: SpreadsheetHolding[] = [];
    
    // Find column indices
    let schemeIdx = -1;
    let folioIdx = -1;
    let unitsIdx = -1;
    let valueIdx = -1;
    let categoryIdx = -1;

    // Search top 25 rows for headers (some files have long headers)
    for (let i = 0; i < Math.min(data.length, 25); i++) {
        const row = data[i];
        if (!Array.isArray(row)) continue;
        
        row.forEach((cell, idx) => {
            if (!cell) return;
            const normalized = String(cell).toLowerCase().replace(/[^a-z]/g, '');
            console.log(`Checking header cell [${i},${idx}]: "${normalized}"`);

            if (normalized === 'scheme' || normalized === 'schemename' || normalized === 'schemedescription') schemeIdx = idx;
            if (normalized.includes('folio')) folioIdx = idx;
            if (normalized.includes('unit') || normalized === 'quantity' || normalized.includes('balance')) unitsIdx = idx;
            if (normalized.includes('value') || normalized.includes('marketval') || (normalized === 'amount' && !row.some(c => String(c).toLowerCase().includes('transaction')))) valueIdx = idx;
            if (normalized.includes('category') || normalized.includes('asset')) categoryIdx = idx;
        });
        
        // Break if we found at least Scheme and (Units or Value)
        if (schemeIdx !== -1 && (unitsIdx !== -1 || valueIdx !== -1)) {
            console.log(`✅ Header Map Found: Scheme=${schemeIdx}, Units=${unitsIdx}, Value=${valueIdx}, Folio=${folioIdx}`);
            break;
        }
    }

    // Process rows
    data.forEach((row, idx) => {
        if (!Array.isArray(row) || schemeIdx === -1) return;
        
        const scheme = row[schemeIdx];
        if (typeof scheme !== 'string' || scheme.trim().length < 4) return;

        // Skip obvious non-data rows
        const lowerScheme = scheme.toLowerCase();
        if (lowerScheme.includes('total') || lowerScheme.includes('summary') || 
            lowerScheme.includes('scheme') || lowerScheme.includes('subtotal') ||
            lowerScheme.includes('grand') || lowerScheme.includes('page')) return;

        let units = 0;
        if (unitsIdx !== -1) units = parseFloat(String(row[unitsIdx]).replace(/,/g, '')) || 0;
        
        let val = 0;
        if (valueIdx !== -1) val = parseFloat(String(row[valueIdx]).replace(/,/g, '')) || 0;
        
        // Relaxed criteria: either units or value must be valid
        if (units > 0 || val > 0) {
            holdings.push({
                schemeName: scheme.trim(),
                folio: String(row[folioIdx] || 'N/A').trim(),
                units: units,
                currentValue: val,
                category: categoryIdx !== -1 ? String(row[categoryIdx] || '').trim() : (lowerScheme.includes('debt') ? 'Debt' : 'Equity')
            });
        }
    });

    console.log(`📊 Extracted ${holdings.length} holdings from spreadsheet.`);
    return holdings;
};
