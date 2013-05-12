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
    			km: {value: 1000, div: true },      // 1m = 1/1000 km
    			mm: {value: 1000 },                 // 1m = 1000 mm
    			inch: {value: 0.0254, div: true },  // 1m = 1/0.0254 inch
    			ft: {value: 0.3048, div: true }     // 1m = 1/0.3048 ft
    		}
    	},
    	
    	{
    		unit: "km",
    		converters: {
    			mm: {value: 1000000 },                 // 1km = 1000000 mm
    			inch: {value: 0.0000254, div: true },  // 1km = 1/0.0000254 inch 
    			ft: {value: 0.0003048, div: true }     // 1km = 1/0.0003048 ft
    		}
    	},
    	
    	{
    		unit: "mm",
    		converters: {
    			inch: {value: 25.4, div: true },       // 1mm = 1/25.4 inch
    			ft: {value: 304.8, div: true }         // 1mm = 1/304.8 ft
    		}
    	},
    	
    	{
    		unit: "inch",
    		converters: {
    			ft: {value: 12, div: true }         // 1nch = 1/12 ft
    		}
    	},
    	
    	{
    		unit: "ft",
    		converters: {}
    	}
    ]
)
