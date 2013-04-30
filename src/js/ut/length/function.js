/**
 * Conversion Table of Temperature.
 */
unitConverter.conversionTable(
    // Category Name (mandatory)
    "length_func",
    
    // Meta Data 
    { type: "function",
      arg: "bigDecimal",
      initialValue: { unit: "m", value: 1 }
    },
    
    // difinition of unit.
    [
        {unit: "m",
         converters: {
            // m / 1000
            km: function(m) { return m.div(1000) },
            // m * 1000
            mm: function(m) { return m.times(1000) },
            // m / 0.0254
            inch: function(m) { return m.div(0.0254) },
            // (m / 0.0254) / 12
            ft: function(m) { return m.div(0.0254).div(12) }
            }
        },
        {unit: "km",
         converters: {
            // km * 1000
            m: function(km) { return km.times(1000) },
            // km * 1000 * 1000
            mm: function(km) { return km.times(1000000) },
            // km / (0.0254 * 1000)
            inch: function(km) { return km.div(0.0000254) },
            // km / (0.0254 * 1000) / 12
            ft: function(km) { return km.div(0.0000254).div(12) }
            }
        },
        {unit: "mm",
         converters: {
            // km = mm * 1000000
            km: function(mm) { return mm.div(1000000) },
            // mm = mm * 1000
            m: function(mm) { return mm.div(1000) },
            // mm / 0.0254 * 1000
            inch: function(mm) { return mm.div(25.4) },
            // mm / (0.3048 * 1000)
            ft: function(mm) { return mm.div(304.8) }
            }
        },
        {unit: "inch",
         converters: {
            // km = inch * 1000000
            km: function(inch) { return inch.times(0.0000254) },
            // mm = m * 1000
            m: function(inch) { return inch.times(0.0254) },
            // inch = m / 0.0254
            mm: function(inch) { return inch.times(25.4) },
            ft: function(inch) { return inch.div(12) }
            }
        },
        {unit: "ft",
         converters: {
            // km = inch * 1000000
            km: function(ft) { return ft.times(0.0003048) },
            // mm = m * 1000
            m: function(ft) { return ft.times(0.3048) },
            // inch = m / 0.0254
            mm: function(ft) { return ft.times(304.8) },
            inch: function(ft) { return ft.times(12) }
            }
        },
    ]
)
