/**
 * Conversion Table of Length.
 */
unitConverter.conversionTable(
	
    // Category Name (mandatory)
    "length_ratioLite",
    
    // Header Data (reserved)
    {},
    
    // Difinition of unit.
    //   1m = 0.001km = 100cm = 1000m = ...
    [
        {unit: "m", ratio: 1},
        {unit: "km", ratio: 0.001},
        {unit: "cm", ratio: 100},
        {unit: "mm", ratio: 1000},
        {unit: "micro-m", ratio: 1000000, label: "µm"},
        {unit: "inch", ratio: 39.3701},
        {unit: "ft", ratio: 3.28084},
        {unit: "yd", ratio: 1.0936133},
        {unit: "mile", ratio: 0.000621371192 }
    ]
)

