/**
 * Conversion Table
 * 
 * Conversion Table consists of only one function. 
 * This function to provide tiny DSL (Domain Specific Language) to define the
 * configuration of unit conversion. The configuration of unit conversion is
 * defined in each unit category.
 * 
 * unitConverter.conversionTable(category, header, conversionData)
 * 
 * @author  Shunsuke
 */

//'use strict';

unitConverter.conversionTable = (function(){

    var createConversionInfoSkeleton_ = function(type, category) {
        return {
            type: type,
            category: category,
            unitList: [],
            conversionTable: {}
        }
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
   
    /**
     * Base Class of ConversionInfoGenerator.
     */
    
    var protoConversionInfoGeneratorBase_ = function(){}
    
    protoConversionInfoGeneratorBase_.prototype.checkHeaderCommon = function(header) {
        //alert(header.type)
        //alert(this.type)
        
        if ((header.type == undefined) || (header.type == this.type)) {
            return true
        }
        return false
    }
    
    protoConversionInfoGeneratorBase_.prototype.checkConversionDataCommon = function(data) {
        // unit の重複
        return true
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    /**
     * Class of ConversionInfoGenerator to generate ConversionInfo from RatioLite.
     */
    
    var protoConversionInfoGeneratorRatioLite_ = function(category) {
        this.type = "ratioLite"
        this.category = category
        this.cache = {}
    }
    
    protoConversionInfoGeneratorRatioLite_.prototype = new protoConversionInfoGeneratorBase_()
    
    protoConversionInfoGeneratorRatioLite_.prototype.setHeader = function(header) {
        if (this.checkHeaderCommon(header) == false) {
            return false
        }
        
        // header check (linear)
        
        this.cache.header = header
        
        return true
    }
    
    protoConversionInfoGeneratorRatioLite_.prototype.setConversionData = function(data) {
        if (this.checkConversionDataCommon(data) == false) {
            return false
        }
        
        // check data.
        
        this.cache.data = data
        
        return true
    }
    
    protoConversionInfoGeneratorRatioLite_.prototype.create = function() {
        var unit
        var data = this.cache.data
        var ci = createConversionInfoSkeleton_(this.type, this.category)
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ci.unitList.push(unit)
            ci.conversionTable[unit] = {
                ratio: data[i].ratio,
                label: data[i].label || data[i].unit
            }
        }
        
        return ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    var protoConversionInfoGeneratorRatio_ = function(category) {
        this.type = "ratio"
        this.category = category
        this.cache = {}
    }
    
    protoConversionInfoGeneratorRatio_.prototype = new protoConversionInfoGeneratorBase_()
    
    protoConversionInfoGeneratorRatio_.prototype.setHeader = function(header) {
        if (this.checkHeaderCommon(header) == false) {
            return false
        }
        
        // header check (linear)
        
        this.cache.header = header
        
        return true
    }
    
    protoConversionInfoGeneratorRatio_.prototype.setConversionData = function(data) {
        if (this.checkConversionDataCommon(data) == false) {
            return false
        }
        
        // check data.
        
        this.cache.data = data
        
        return true
    }
    
    protoConversionInfoGeneratorRatio_.prototype.create = function() {
        var fromUnit, toUnit, fromLabel, converter
        var data = this.cache.data
        var ci = createConversionInfoSkeleton_("function", this.category)
        var ct = ci.conversionTable
        
        var newTable = function(t, k) {
        	if ( !t[k] ) {
        		t[k] = { converters: {} }
        	}
	    }
	    
	    var generateConverterFunction = function(value, div) {
	    	if (div) {
	    		return function(bigDecimal) { return bigDecimal.div(value) }
	    	}
	    	return function(bigDecimal) { return bigDecimal.times(value) }
	    }
        
        for (var i = 0; i < data.length; i++) {
        	ci.unitList.push(data[i].unit)
        	
        	fromUnit = data[i].unit
        	fromLabel = data[i].label
        	
        	newTable(ct, fromUnit)
        	ct[fromUnit].label = fromLabel || fromUnit
        	
        	//alert(data[i].unit)
        	//alert(data[i].label)
        	
        	if ( !data[i].hasOwnProperty("converters") ) {
        		if (i != data.length - 1) { alert("error: table format") }
        		continue;
        	}
        	
        	for (toUnit in data[i].converters) {
        		if ( data[i].converters.hasOwnProperty(toUnit) ) {
        			//alert(toUnit)
        			converter = data[i].converters[toUnit]
        			newTable(ct, toUnit)
        			ct[fromUnit].converters[toUnit] = generateConverterFunction(converter.value, converter.div)
        			ct[toUnit].converters[fromUnit] = generateConverterFunction(converter.value, !(converter.div))
        		}
        	}
        }
        
        return ci
    }
    
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    /**
     * Class of ConversionInfoGenerator to generate ConversionInfo from linear.
     */
    
    var protoConversionInfoGeneratorLinear_ = function(category) {
        this.type = "linear"
        this.category = category
        this.cache = {}
    }
    
    protoConversionInfoGeneratorLinear_.prototype = new protoConversionInfoGeneratorBase_()
    
    protoConversionInfoGeneratorLinear_.prototype.setHeader = function(header) {
        if (this.checkHeaderCommon(header) == false) {
            return false
        }
        
        // header check (linear)
        
        this.cache.header = header
        
        return true
    }
    
    protoConversionInfoGeneratorLinear_.prototype.setConversionData = function(data) {
        if (this.checkConversionDataCommon(data) == false) {
            return false
        }
        
        // check data.
        
        this.cache.data = data
        
        return true
    }
    
    protoConversionInfoGeneratorLinear_.prototype.create = function() {
        var unit
        var data = this.cache.data
        var ci = createConversionInfoSkeleton_(this.type, this.category)
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ci.unitList.push(unit)
            
            // check baseunit
            if (data[i].type == "baseunit") {
                ci.baseunit = unit
                ci.conversionTable[unit] = {
                    slope: 1,
                    y_intercept: 0,
                    label: data[i].label || unit
                }
            } else {
                ci.conversionTable[unit] = {
                    slope: data[i].slope,
                    y_intercept: data[i].y_intercept,
                    label: data[i].label || unit
                }
            }
        }
        
        return ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    var protoConversionInfoGeneratorFunction_ = function(category) {
        this.type = "function"
        this.category = category
        this.cache = {}
    }
    
    protoConversionInfoGeneratorFunction_.prototype = new protoConversionInfoGeneratorBase_()
    
    protoConversionInfoGeneratorFunction_.prototype.setHeader = function(header) {
        
        if (this.checkHeaderCommon(header) == false) {
            return false
        }
        
        // header check (linear)
        
        this.cache.header = header
        
        return true
    }
    
    protoConversionInfoGeneratorFunction_.prototype.setConversionData = function(data) {
        if (this.checkConversionDataCommon(data) == false) {
            return false
        }
        
        // check data.
        
        this.cache.data = data
    }
    
    protoConversionInfoGeneratorFunction_.prototype.create = function() {
        var unit
        var header = this.cache.header
        var data = this.cache.data
        var ci = createConversionInfoSkeleton_(this.type, this.category)
        
        ci.arg = header.arg || "big.js"
        ci.initialValue = header.initialValue
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ci.unitList.push(unit)
            ci.conversionTable[unit] = {
                converters: data[i].converters,
                label: data[i].label || data[i].unit
            }
        }
        
        return ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    /**
     * Factory Method of ConversionInfoGenerator.
     */
    var createConversionInfoGenerator = function(category, header) {
        if ((header.type == null) || (header.type == "RatioLite")) {
            return new protoConversionInfoGeneratorRatioLite_(category)
        } else if (header.type == "ratio") {
            return new protoConversionInfoGeneratorRatio_(category)
        } else if (header.type == "linear") {
            return new protoConversionInfoGeneratorLinear_(category)
        } else if (header.type == "function") {
            return new protoConversionInfoGeneratorFunction_(category)
        }
        return null
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    return function(category, header, conversionData) {
        var cig = createConversionInfoGenerator(category, header)
        
        cig.setHeader(header)
        cig.setConversionData(conversionData)
        
        unitConverter.core.registerConversionInfo(category, cig.create())
    }
    
})()

