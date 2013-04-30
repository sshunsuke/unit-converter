/**
 * Conversion Table of Temperature.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "temperature_linear",
    
    // Meta Data 
    { type: "linear"},
    
    // difinition of unit.
    [
        {unit: "K", type: "baseunit"},
        {unit: "C", slope: 1, y_intercept: -273.15},
        {unit: "F", slope: 1.8, y_intercept: -459.67}
    ]
)
