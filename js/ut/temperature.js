/**
 * Conversion Table of Temperature.
 */
unitConverter.core.unittable(
    // Category Name (mandatory)
    "temperature",
    
    // Meta Data 
    { type: "linear", baseunit: "K"},
    
    // difinition of unit.
    [
        {unit: "K", slope: 1, y_intercept: 0},
        {unit: "C", slope: 1, y_intercept: -273.15},
        {unit: "F", slope: 1.8, y_intercept: -459.67}
    ]
)
