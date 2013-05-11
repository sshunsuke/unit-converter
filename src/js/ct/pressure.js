/**
 * Conversion Table of Pressure.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "pressure",
    
    // Meta Data (reserved)
    {},
    
    // difinition of unit.
    [
        {unit: 'Pa', ratio: 1, label: 'Pa (N/m2)'},
        {unit: "kPa", ratio: 0.001},
        {unit: "MPa", ratio: 0.000001},
        {unit: "bar", ratio: 0.00001},
    ]
)

