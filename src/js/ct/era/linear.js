/**
 * Conversion Table of Era.
 * 和暦と西暦の変換
 */
unitConverter.conversionTable(
	
    // Category Name (mandatory)
    "Era",
    
    // Header Data 
    { type: "linear"},
    
    // difinition of unit.
    [
        {unit: "AD", type: "baseunit", label: "西暦"},
        {unit: "heisei", slope: 1, y_intercept: -1989, label: "平成"},
        {unit: "showa", slope: 1, y_intercept: -1926, label: "昭和"}
    ]
)


