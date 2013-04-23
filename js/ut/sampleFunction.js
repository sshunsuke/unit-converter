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
        { unit: "x", 
          converter: {
              logx: function(n) { return Math.log(n) },
              log10x: function(n) {return Math.log(n) / Math.log(10)}
          }
        },
        
        { unit: "logx",
          converter: {
              x: function(n) { return exp(n) },
              log10x: function(n) { return Math.log(exp(u)) / Math.log(10) }
          }
        },
        
        { unit: "log10x",
          converter: {
              x: function(n) { return Math.pow(10, u) },
              logx: function(n) { return Math.log(Math.pow(10, u)) / Math.log(10) }
          }
        }
    ]
)
