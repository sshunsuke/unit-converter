/**
 * Conversion Table.
 * 
 * @author  Shunsuke
 */


unitConverter.conversionTable = (function(){

	var createUnitTableSkeleton_ = function(type, category) {
		return {
			type: type,
			category: category,
			unitList: [],
			unitInfoMap: {}
		}
	}
	
	var checkHeaderCommon_ = function(header, type) {
	    /*
	    alert("ch")
	    alert(header.type)
	    alert(type)
	    alert("--")
	    */
	    
		if ((header.type == undefined) || (header.type == type)) {
			return true
		}
		return false
	}
	
	var checkConversionDataCommon_ = function(data) {
		// unit の重複
		
		return true
	}
	
	/*
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
	var protoUnitTableFactoryRatio_ = function(category) {
		this.ut = createUnitTableSkeleton_("ratio", category)
		this.cache = {}
	}
	
	protoUnitTableFactoryRatio_.prototype.common = {
		checkHeader: checkHeaderCommon_,
		checkConversionData: checkConversionDataCommon_
	}
	
	protoUnitTableFactoryRatio_.prototype.setHeader = function(header) {
	    if (this.common.checkHeader(header, this.ut.type) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoUnitTableFactoryRatio_.prototype.setConversionData = function(data) {
		if (this.common.checkConversionData(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
		
		return true
	}
	
	protoUnitTableFactoryRatio_.prototype.create = function() {
		var unit
		var data = this.cache.data
		
		for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            this.ut.unitInfoMap[unit] = {
            	ratio: data[i].ratio,
            	label: data[i].label || data[i].unit
            }
        }
        
		
		return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	var protoUnitTableFactoryLinear_ = function(category) {
		this.ut = createUnitTableSkeleton_("linear", category)
		this.cache = {}
	}
	
	protoUnitTableFactoryLinear_.prototype.common = {
		checkHeader: checkHeaderCommon_,
		checkConversionData: checkConversionDataCommon_
	}
	
	protoUnitTableFactoryLinear_.prototype.setHeader = function(header) {
		if (this.common.checkHeader(header, this.ut.type) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoUnitTableFactoryLinear_.prototype.setConversionData = function(data) {
		if (this.common.checkConversionData(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
		
		return true
	}
	
	protoUnitTableFactoryLinear_.prototype.create = function() {
	    var unit
        var data = this.cache.data
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            
            // check baseunit
            if (data[i].type == "baseunit") {
                this.ut.baseunit = unit
                this.ut.unitInfoMap[unit] = {
                    slope: 1,
                    y_intercept: 0,
                    label: data[i].label || unit
                }
            } else {
                this.ut.unitInfoMap[unit] = {
                    slope: data[i].slope,
                    y_intercept: data[i].y_intercept,
                    label: data[i].label || unit
                }
            }
        }
        
        return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	var protoUnitTableFactoryFunction_ = function(category) {
		this.ut = createUnitTableSkeleton_("function", category)
		this.cache = {}
	}
	
	protoUnitTableFactoryFunction_.prototype.common = {
		checkHeader: checkHeaderCommon_,
		checkConversionData: checkConversionDataCommon_
	}
	
	protoUnitTableFactoryFunction_.prototype.setHeader = function(header) {
	    
		if (this.common.checkHeader(header, this.ut.type) == false) {
			return false
		}
		
		// header check (linear)
		
		this.cache.header = header
		
		return true
	}
	
	protoUnitTableFactoryFunction_.prototype.setConversionData = function(data) {
		if (this.common.checkConversionData(data) == false) {
			return false
		}
		
		// check data.
		
		this.cache.data = data
	}
	
	protoUnitTableFactoryFunction_.prototype.create = function() {
		var unit
		var header = this.cache.header
        var data = this.cache.data
        
        this.ut.arg = header.arg || "bigDecimal"
        this.ut.initialValue = header.initialValue
        
        for(var i = 0; i < data.length; i++) {
            unit = data[i].unit
            this.ut.unitList.push(unit)
            this.ut.unitInfoMap[unit] = {
                converters: data[i].converters,
                label: data[i].label || data[i].unit
            }
        }
        
        return this.ut
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	var createUnitTableFactory = function(category, header) {
	    if ((header.type == null) || (header.type == "ratio")) {
	        return new protoUnitTableFactoryRatio_(category)
	    } else if (header.type == "linear") {
            return new protoUnitTableFactoryLinear_(category)
        } else if (header.type == "function") {
            return new protoUnitTableFactoryFunction_(category)
        }
	    return null
	}
	
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    
    
    
    
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
   
    /*
    // Function Table containing register process 
    var utRegister_ = {}
    
    // Unit Table の登録処理.
    utRegister_.checkMeta = function(meta) {
        if ((meta.type == null) || (meta.type == "ratio") ||
            (meta.type == "linear") || (meta.type == "function")) {
            return true    
        }
        return false
    }
   
    utRegister_.unitInfo = function(type, unitDefinition) {
        var unitInfo = {}
        
        if (type == "ratio") {
            unitInfo.ratio = unitDefinition.ratio
        } else if (type == "linear") {
            unitInfo.slope = unitDefinition.slope
            unitInfo.y_intercept = unitDefinition.y_intercept
        } else if (type == "function") {
            unitInfo.converters = unitDefinition.converters
        } else {
            alert("error: xx")
        }
        
        unitInfo.label = unitDefinition.label || unitDefinition.unit
        
        return unitInfo
    }
  
    utRegister_.register = function(category, meta, conversionTable) {
        var i
        var unit

        // あれこれプリプロセス処理を追加する予定

        // unitList のチェックとか

        var t = {
            unitList : [],
            unitInfoMap : {}
        }
        
        if (!utRegister_.checkMeta(meta)) {
            alert("error: meta")
        }

        // Default 値のセット
        t.type = meta.type || "ratio"

        if (t.type == "linear") {
            for (i = 0; i < conversionTable.length; i++) {
                if (conversionTable[i].type == "baseunit") {
                    t.baseunit = conversionTable[i].unit
                    conversionTable[i].slope = 1
                    conversionTable[i].y_intercept = 0
                    break
                }
            }
        } else if (t.type == "function") {
            t.arg = meta.arg || "bigDecimal"
            t.initialValue = meta.initialValue
        }

        // 実際の登録処理
        for(i = 0; i < conversionTable.length; i++) {
            unit = conversionTable[i].unit
            t.unitList.push(unit)
            t.unitInfoMap[unit] = utRegister_.unitInfo(t.type, conversionTable[i])
        }
        
        //utMap_[category] = t
        unitConverter.core.registerUnittable(category, t)
    }
    */
    
    return function(category, meta, conversionTable) {
        //utRegister_.register(category, meta, conversionTable)
        
        var utf = createUnitTableFactory(category, meta)
        
        utf.setHeader(meta)
        utf.setConversionData(conversionTable)
        
        unitConverter.core.registerUnittable(category, utf.create())
    }
}())

