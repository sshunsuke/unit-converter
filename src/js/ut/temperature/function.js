/**
 * Conversion Table of Temperature.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "temperature",
    
    // Meta Data 
    { type: "function",
      arg: "bigDecimal",
      initialValue: { unit: "C", value: 0 }
    },
    
    // difinition of unit.
    [
        {unit: "K",
         converters: {
            // C = K - 273.15
            C: function(K) { return K.minus(273.15) },
            // F = (K * 1.8) - 459.67
            F: function(K) { return K.times(1.8).minus(459.67) }
            }
        },
        {unit: "C",
         converters: {
            // K = C + 273.15
            K: function(C) { return C.plus(273.15) },
            // F = (C * 1.8) + 32
            F: function(C) { return C.times(1.8).plus(32) }
            }
        },
        {unit: "F",
         converters: {
            // K = (F + 459.67) * 5 / 9
            K: function(F) { return F.plus(459.67).times(5).div(9).round(10) },
            // C = (F - 32) * 5 / 9
            C: function(F) { return F.minus(32).times(5).div(9).round(10) }
            }
        }
    ]
)
