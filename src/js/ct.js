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
     * Class of ConversionInfoGenerator to generate ConversionInfo from ratio.
     */
    
    var protoConversionInfoGeneratorRatio_ = function(category) {
        // this.ut = createConversionInfoSkeleton_("ratio", category)
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
        var unit
        var data = this.cache.data
        var ut = createConversionInfoSkeleton_(this.type, this.category)
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ut.unitList.push(unit)
            ut.conversionTable[unit] = {
                ratio: data[i].ratio,
                label: data[i].label || data[i].unit
            }
        }
        
        return ut
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    /**
     * Class of ConversionInfoGenerator to generate ConversionInfo from linear.
     */
    
    var protoConversionInfoGeneratorLinear_ = function(category) {
        // this.ut = createConversionInfoSkeleton_("linear", category)
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
        var ut = createConversionInfoSkeleton_(this.type, this.category)
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ut.unitList.push(unit)
            
            // check baseunit
            if (data[i].type == "baseunit") {
                ut.baseunit = unit
                ut.conversionTable[unit] = {
                    slope: 1,
                    y_intercept: 0,
                    label: data[i].label || unit
                }
            } else {
                ut.conversionTable[unit] = {
                    slope: data[i].slope,
                    y_intercept: data[i].y_intercept,
                    label: data[i].label || unit
                }
            }
        }
        
        return ut
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    var protoConversionInfoGeneratorFunction_ = function(category) {
        // this.ut = createConversionInfoSkeleton_("function", category)
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
        var ut = createConversionInfoSkeleton_(this.type, this.category)
        
        ut.arg = header.arg || "bigDecimal"
        ut.initialValue = header.initialValue
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            ut.unitList.push(unit)
            ut.conversionTable[unit] = {
                converters: data[i].converters,
                label: data[i].label || data[i].unit
            }
        }
        
        return ut
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    /**
     * Factory Method of ConversionInfoGenerator.
     */
    var createConversionInfoGenerator = function(category, header) {
        if ((header.type == null) || (header.type == "ratio")) {
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
    
}())

