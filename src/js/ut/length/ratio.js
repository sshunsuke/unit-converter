/**
 * Conversion Table of Length.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "length_ratio",
    
    // Meta Data (reserved)
    { type: "ratio" },
    
    // difinition of unit.
    [
        {unit: "m",
         ratio: { km: 0.001, cm: 100, mm: 1000,
                  inch: 39.3701, ft: 3.28084}
        },
        {unit: "km",
         ratio: { m: 1000, cm: 100000, mm: 1000000,
                  inch: 39370.1, ft: 3280.84}
        },
        {unit: "cm",
         ratio: { km: 0.0001, m: 0.01, mm: 10,
                  inch: 0.393701, ft: 0.0328084}
        },
        {unit: "mm",
         ratio: { km: 0.00001, m: 0.001, cm: 0.1,
                  inch: 0.0393701, ft: 0.00328084}
        },
        {unit: "inch",
         ratio: { km: 0.0000254, m: 0.0254, cm: 2.54, mm: 25.4,
                  ft: 0.0833333}
        },
        {unit: "ft",
         ratio: { km: 0.0003048, m: 0.3048, cm: 30.48, mm: 304.8,
                  inch: 12}
        },
    ]
)

