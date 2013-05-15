/**
 * Conversion Table of Length.
 */
unitConverter.conversionTable(
	
    // Category Name (mandatory)
    "Length",
    
    // Header Data 
    { type: "ratio",
      initialValue: { unit: "m", value: 1 }
    },
    
    // Data for Unit Conversion.
    [
    	{
    		unit: "m",
    		label: "m (SI)",
    		converters: {
    			km: {value: 1000, div: true },       // 1m = 1/1000 km
    			cm: {value: 100 },                   // 1m = 100 cm
    			mm: {value: 1000 },                  // 1m = 1000 mm
    			"micro-m": {value: 1000000 },        // 1m = 1000000 µm
    			inch: {value: 0.0254, div: true },   // 1m = 1/0.0254 inch
    			ft: {value: 0.3048, div: true },     // 1m = 1/0.3048 ft  (12 inch = 1ft)
    			yd: {value: 0.9144, div: true },     // 1m = 1/0.9144 yd  (3 ft = 1yd)
    			mile: {value: 1609.344, div: true }  // 1m = 1/1609.344 mile
    		}
    	},
    	
    	{
    		unit: "km",
    		converters: {
    			cm: {value: 100000 },                   // 1km = 100000 cm
    			mm: {value: 1000000 },                  // 1km = 1000000 mm
    			"micro-m": {value: 1000000000 },        // 1km = 1000000000 µm
    			inch: {value: 0.0000254, div: true },   // 1km = 1/0.0000254 inch 
    			ft: {value: 0.0003048, div: true },     // 1km = 1/0.0003048 ft
    			yd: {value: 0.0009144, div: true },     // 1km = 1/0.0009144 yd
    			mile: {value: 1.609344, div: true }     // 1km = 1/1.609344 mile
    		}
    	},
    	
    	{
    		unit: "cm",
    		converters: {
    			mm: {value: 10 },                    // 1cm = 10 mm
    			"micro-m": {value: 10000 },          // 1cm = 10000 µm
    			inch: {value: 2.54, div: true },     // 1cm = 1/2.54 inch 
    			ft: {value: 30.48, div: true },      // 1cm = 1/30.48 ft
    			yd: {value: 91.44, div: true },      // 1cm = 1/91.44 yd
    			mile: {value: 160934.4, div: true }  // 1km = 1/160934.4 mile
    		}
    	},
    	
    	{
    		unit: "mm",
    		converters: {
    			"micro-m": {value: 1000 },             // 1mm = 1000 µm
    			inch: {value: 25.4, div: true },       // 1mm = 1/25.4 inch
    			ft: {value: 304.8, div: true },        // 1mm = 1/304.8 ft
    			yd: {value: 914.4, div: true },        // 1mm = 1/914.4 yd
    			mile: {value: 1609344, div: true }     // 1mm = 1/1609344 mile
    		}
    	},
    	
    	{
    		unit: "micro-m",
    		label: "µm",
    		converters: {
    			inch: {value: 25400, div: true },       // 1µm = 1/25400 inch
    			ft: {value: 304800, div: true },        // 1µm = 1/304800 ft
    			yd: {value: 914400, div: true },        // 1µm = 1/914400 yd
    			mile: {value: 1609344000, div: true }   // 1µm = 1/1609344000 mile
    		}
    	},
    	
    	{
    		unit: "inch",
    		converters: {
    			ft: {value: 12, div: true },       // 1nch = 1/12 ft
    			yd: {value: 36, div: true },       // 1nch = 1/12/3 yd
    			mile: {value: 63360, div: true }   // 1nch = 1/12/3/1760 mile
    		}
    	},
    	
    	{
    		unit: "ft",
    		converters: {
    			yd: {value: 3, div: true },       // 1ft = 1/3 yd
    			mile: {value: 5280, div: true }   // 1ft = 1/3/1760 mile
    		}
    	},
    	
    	{
    		unit: "yd",
    		converters: {
    			mile: {value: 1760, div: true }   // 1yd = 1/1760 mile
    		}
    	},
    	
    	{
    		unit: "mile",
    		converters: {}
    	}
    	
    ]
)
