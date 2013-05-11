/**
 * Conversion Table of Weight.
 */
unitConverter.conversionTable(
	
    // Category Name (mandatory)
    "weight_func",

    // Header Data
    { type: "function",
      arg: "big.js",
      initialValue: { unit: "kg", value: 1 }
    },

    // Data for Unit Conversion.
    [
        {
            unit: "kg",
            converters: {
                g: function(kg) { return kg.times(1000) },
                mg: function(kg) { return kg.times(1000000) },
                ton: function(kg) { return kg.div(1000) },
                lb: function(kg) { return kg.div(0.45359237) }
            }
        },
        {
            unit: "g",
            converters: {
                kg: function(g) { return g.div(1000) },
                mg: function(g) { return g.times(1000) },
                ton: function(g) { return g.div(1000000) },
                lb: function(g) { return g.div(453.59237) }
            }
        },
        {
            unit: "mg",
            converters: {
                kg: function(mg) { return mg.div(1000000) },
                g: function(mg) { return mg.div(1000) },
                ton: function(mg) { return mg.div(1000000000) },
                lb: function(mg) { return mg.div(453592.37) }
            }
        },
        {
            unit: "ton",
            converters: {
                kg: function(ton) { return ton.times(1000) },
                g: function(ton) { return ton.times(1000000) },
                mg: function(ton) { return ton.times(1000000000) },
                lb: function(ton) { return ton.div(0.00045359237) }
            }
        },
        {
            unit: "lb",
            converters: {
                kg: function(lb) { return lb.times(0.45359237) },
                g: function(lb) { return lb.times(453.59237) },
                mg: function(lb) { return lb.times(453592.37) },
                ton: function(lb) { return lb.times(0.00045359237) }
            }
        }
    ]
)
