/**
 * Conversion Table of Length.
 */
unitConverter.conversionTable(
	
    // Category Name (mandatory)
    "Datasize",
    
    // Header Data 
    { type: "ratio",
      initialValue: { unit: "byte", value: 1 }
    },
    
    // Data for Unit Conversion.
    [
    	{
    		unit: "byte",
    		converters: {
    			KB: {value: 1024, div: true },              // 1byte = 1/1024 KB
    			MB: {value: 1048576, div: true },           // 1byte = 1/1024/1024 MB
    			GB: {value: 1073741824, div: true },        // 1byte = 1/1024/1024/1024 GB
    			TB: {value: "1099511627776", div: true },   // 1byte = 1/1024/1024/1024/1024 TB
    			bit: {value: 8 },                           // 1byte = 8bit
    		}
    	},
    	
    	{
    		unit: "KB",
    		label: "KB (1KB = 1024byte)",
    		converters: {
    			MB: {value: 1024, div: true },           // 1byte = 1/1024/1024 MB
    			GB: {value: 1048576, div: true },        // 1byte = 1/1024/1024/1024 GB
    			TB: {value: 1073741824, div: true },   // 1byte = 1/1024/1024/1024/1024 TB
    			bit: {value: 8192 },                           // 1byte = 8bit
    		}
    	},
    	
    	{
    		unit: "MB",
    		//label: "MB (1KB = 1024byte)",
    		converters: {
    			GB: {value: 1024, div: true },        // 1byte = 1/1024/1024/1024 GB
    			TB: {value: 1048576, div: true },   // 1byte = 1/1024/1024/1024/1024 TB
    			bit: {value: 8388608 },                           // 1byte = 8bit
    		}
    	},
    	
    	{
    		unit: "GB",
    		//label: "MB (1KB = 1024byte)",
    		converters: {
    			TB: {value: 1024, div: true },   // 1byte = 1/1024/1024/1024/1024 TB
    			bit: {value: "8589934592" },                           // 1byte = 8bit
    		}
    	},
    	
    	{
    		unit: "TB",
    		//label: "MB (1KB = 1024byte)",
    		converters: {
    			bit: {value: "8796093022208" },                           // 1byte = 8bit
    		}
    	},

    	{
    		unit: "bit",
    		label: "bit (8bits = 1byte)",
    		converters: {}
    	},
    ]
)


