/**
 * Conversion Table.
 * 
 * @author  Shunsuke
 */


unitConverter.conversionTable = (function(){

	var createConversionInfoSkeleton_ = function(type, category) {
		return {
			type: type,
			category: category,
			unitList: [],
			conversionTable: {}
		}
	}
	
	var protoConversionInfoFactoryBase_ = function(){}
	
	protoConversionInfoFactoryBase_.prototype.checkHeaderCommon = function(header) {
	    //alert(header.type)
	    //alert(this.ut.type)
	    
	    if ((header.type == undefined) || (header.type == this.ut.type)) {
            return true
        }
        return false
	}
	
	protoConversionInfoFactoryBase_.prototype.checkConversionDataCommon = function(base) {
	    // unit の重複
        return true
	}
	
	/*
	var checkHeaderCommon_ = function(header, type) {
	    //alert("ch")
	    //alert(header.type)
	    //alert(type)
	    //alert("--")
	    
		if ((header.type == undefined) || (header.type == type)) {
			return true
		}
		return false
	}
	
	var checkConversionDataCommon_ = function(data) {
		// unit の重複
		
		return true
	}
	
	var createUnitList_ = Function(data) {
		var ul = []
		for(var i = 0; i < data.length; i++) {
            ul.push(data[i].unit)
        }
        return ul
	}
	*/
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// Prototype of 
	var protoConversionInfoFactoryRatio_ = function(category) {
		this.ut = createConversionInfoSkeleton_("ratio", category)
		this.cache = {}
	}
	
	protoConversionInfoFactoryRatio_.prototype = new protoConversionInfoFactoryBase_()
	
	protoConversionInfoFactoryRatio_.prototype.setHeader = function(header) {
	    if (this.checkHeaderCommon(header) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoConversionInfoFactoryRatio_.prototype.setConversionData = function(data) {
		if (this.checkConversionDataCommon(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
		
		return true
	}
	
	protoConversionInfoFactoryRatio_.prototype.create = function() {
		var unit
		var data = this.cache.data
		
		for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            this.ut.conversionTable[unit] = {
            	ratio: data[i].ratio,
            	label: data[i].label || data[i].unit
            }
        }
		
		return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */

	var protoConversionInfoFactoryLinear_ = function(category) {
		this.ut = createConversionInfoSkeleton_("linear", category)
		this.cache = {}
	}
	
	protoConversionInfoFactoryLinear_.prototype = new protoConversionInfoFactoryBase_()
	
	protoConversionInfoFactoryLinear_.prototype.setHeader = function(header) {
		if (this.checkHeaderCommon(header, this.ut.type) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoConversionInfoFactoryLinear_.prototype.setConversionData = function(data) {
		if (this.checkConversionDataCommon(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
		
		return true
	}
	
	protoConversionInfoFactoryLinear_.prototype.create = function() {
	    var unit
        var data = this.cache.data
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            
            // check baseunit
            if (data[i].type == "baseunit") {
                this.ut.baseunit = unit
                this.ut.conversionTable[unit] = {
                    slope: 1,
                    y_intercept: 0,
                    label: data[i].label || unit
                }
            } else {
                this.ut.conversionTable[unit] = {
                    slope: data[i].slope,
                    y_intercept: data[i].y_intercept,
                    label: data[i].label || unit
                }
            }
        }
        
        return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */

	var protoConversionInfoFactoryFunction_ = function(category) {
		this.ut = createConversionInfoSkeleton_("function", category)
		this.cache = {}
	}
	
	protoConversionInfoFactoryFunction_.prototype = new protoConversionInfoFactoryBase_()
	
	protoConversionInfoFactoryFunction_.prototype.setHeader = function(header) {
	    
		if (this.checkHeaderCommon(header, this.ut.type) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoConversionInfoFactoryFunction_.prototype.setConversionData = function(data) {
		if (this.checkConversionDataCommon(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
	}
	
	protoConversionInfoFactoryFunction_.prototype.create = function() {
		var unit
		var header = this.cache.header
        var data = this.cache.data
        
        this.ut.arg = header.arg || "bigDecimal"
        this.ut.initialValue = header.initialValue
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            this.ut.conversionTable[unit] = {
                converters: data[i].converters,
                label: data[i].label || data[i].unit
            }
        }
        
        return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	var createConversionInfoFactory = function(category, header) {
	    if ((header.type == null) || (header.type == "ratio")) {
	        return new protoConversionInfoFactoryRatio_(category)
	    } else if (header.type == "linear") {
            return new protoConversionInfoFactoryLinear_(category)
        } else if (header.type == "function") {
            return new protoConversionInfoFactoryFunction_(category)
        }
	    return null
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    return function(category, meta, conversionData) {
        var cif = createConversionInfoFactory(category, meta)
        
        cif.setHeader(meta)
        cif.setConversionData(conversionData)
        
        unitConverter.core.registerConversionInfo(category, cif.create())
    }
}())

