/**
 * Conversion Table of Temperature.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "sample",
    
    // Meta Data 
    { type: "function" },
    
    // difinition of unit.
    [
        { unit: "x", type: "baseunit"},
        { unit: "log(x)",
          from: function(baseunit) { return Math.log(baseunit) },
          to: function(u) { return exp(u) }
        },
        { unit: "log10(x)",
          frombase: function(baseunit) {return Math.log(baseunit) / Math.log(10)},
          tobase: function(u) { return Math.pow(10, u) }
        }
    ]
)
