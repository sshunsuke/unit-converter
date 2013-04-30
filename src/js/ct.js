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
        //alert(this.ci.type)
        
        if ((header.type == undefined) || (header.type == this.ci.type)) {
            return true
        }
        return false
    }
    
    protoConversionInfoFactoryBase_.prototype.checkConversionDataCommon = function(base) {
        // unit の重複
        return true
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    // Prototype of 
    var protoConversionInfoFactoryRatioSimple_ = function(category) {
        this.ci = createConversionInfoSkeleton_("ratioSimple", category)
        this.cache = {}
    }
    
    protoConversionInfoFactoryRatioSimple_.prototype = new protoConversionInfoFactoryBase_()
    
    protoConversionInfoFactoryRatioSimple_.prototype.setHeader = function(header) {
        if (this.checkHeaderCommon(header) == false) {
            return false
        }
        
        // header check (linear)
        
        this.cache.header = header
        
        return true
    }
    
    protoConversionInfoFactoryRatioSimple_.prototype.setConversionData = function(data) {
        if (this.checkConversionDataCommon(data) == false) {
            return false
        }
        
        // check data.
        
        this.cache.data = data
        
        return true
    }
    
    protoConversionInfoFactoryRatioSimple_.prototype.create = function() {
        var unit
        var data = this.cache.data
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ci.unitList.push(unit)
            this.ci.conversionTable[unit] = {
                ratio: data[i].ratio,
                label: data[i].label || data[i].unit
            }
        }
        
        return this.ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    var protoConversionInfoFactoryRatio_ = function(category) {
        this.ci = createConversionInfoSkeleton_("ratio", category)
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
            this.ci.unitList.push(unit)
            this.ci.conversionTable[unit] = {
                ratio: data[i].ratio,
                label: data[i].label || data[i].unit
            }
        }
        
        return this.ci
    }
    
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    var protoConversionInfoFactoryLinear_ = function(category) {
        this.ci = createConversionInfoSkeleton_("linear", category)
        this.cache = {}
    }
    
    protoConversionInfoFactoryLinear_.prototype = new protoConversionInfoFactoryBase_()
    
    protoConversionInfoFactoryLinear_.prototype.setHeader = function(header) {
        if (this.checkHeaderCommon(header, this.ci.type) == false) {
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
            this.ci.unitList.push(unit)
            
            // check baseunit
            if (data[i].type == "baseunit") {
                this.ci.baseunit = unit
                this.ci.conversionTable[unit] = {
                    slope: 1,
                    y_intercept: 0,
                    label: data[i].label || unit
                }
            } else {
                this.ci.conversionTable[unit] = {
                    slope: data[i].slope,
                    y_intercept: data[i].y_intercept,
                    label: data[i].label || unit
                }
            }
        }
        
        return this.ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */

    var protoConversionInfoFactoryFunction_ = function(category) {
        this.ci = createConversionInfoSkeleton_("function", category)
        this.cache = {}
    }
    
    protoConversionInfoFactoryFunction_.prototype = new protoConversionInfoFactoryBase_()
    
    protoConversionInfoFactoryFunction_.prototype.setHeader = function(header) {
        
        if (this.checkHeaderCommon(header, this.ci.type) == false) {
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
        
        this.ci.arg = header.arg || "bigDecimal"
        this.ci.initialValue = header.initialValue
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ci.unitList.push(unit)
            this.ci.conversionTable[unit] = {
                converters: data[i].converters,
                label: data[i].label || data[i].unit
            }
        }
        
        return this.ci
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    var createConversionInfoFactory = function(category, header) {
        if ((header.type == null) || (header.type == "ratioSimple")) {
            return new protoConversionInfoFactoryRatioSimple_(category)
        } else if (header.type == "ratio") {
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

