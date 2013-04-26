/**
 * Core function of Unit Converter.
 * This script must be loaded just after loading librarys.
 * 
 * @author  Shunsuke
 */

// All Unit Converter objects should point back to these.
unitConverter = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.core = (function(){
    
    // Unit Table Map
    var utMap_ = {}
    
    /* - - - - - - - - - - - - - - - - - - - */
    
    // Function Table containing register process 
    var utRegister_ = {}
    
    /* - - - - - - - - - - - - - - - - - - - */
    

    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
 
    /* - - - - - - - - - - - - - - - - - - - */
    
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
        
        utMap_[category] = t
    }
   
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // Convert Manager List.
    // singleton object.
    var convertManagerList_ = (function() {
        var protoF = function() {}
        
        protoF.prototype.getCategoryNameList = function() {
            var list = []
            for(var k in utMap_) {
                if(utMap_.hasOwnProperty(k)) {
                    list.push(k)
                }
            }
            return list
        }
        
        protoF.prototype.getConvertManager = function(category) {
            if (utMap_[category] == null) {
                return null
            }
            return unitConverter.core.cmf_.create(category, utMap_[category])
        }
        
        protoF.prototype.size = function(){
            return utMap_.length
        }
        
        return new protoF() 
    })()
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // Publib Methods.
    return {
        SCALE: 20,
        
        registerUnittable: function(category, meta, conversionTable) {
            utRegister_.register(category, meta, conversionTable)
        },
        
        getConvertManagerList: function(){
            return convertManagerList_
        }
    }
    
})()


// Converter Manager Factory.
unitConverter.core.cmf_ = (function(){
    
    // Actual 
    var convertLogic_ = {}
    
    // A function to do actual conversion
    convertLogic_.convertAll = function(category, ut, unit, value) {
        var resultTable = {}
        
        try {
            if (ut.type == "ratio") {
                resultTable = convertLogic_.ratioAll(ut, unit, value)
            } else if (ut.type == "linear") {
                resultTable = convertLogic_.linearAll(ut, unit, value)
            } else if (ut.type == "function") {
                resultTable = convertLogic_.functionAll(ut, unit, value)
            } else {
                alert("error")
            }
        } catch (e) {
            alert("error: " + e.toString())
            return null
        }
        
        return resultTable
    }
    
    // 
    convertLogic_.ratioAll = function(ut, unit, value) {
        var unitList, unitInfoMap
        var from, to, unitName
        var resultTable = {}

        unitList = ut.unitList
        unitInfoMap = ut.unitInfoMap
        
        from = new Big( unitInfoMap[unit].ratio )
        value = new Big(value)

        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            to = new Big(unitInfoMap[unitName].ratio)
            
            // value * to / from
            result = value.times(to).div(from).round(unitConverter.core.SCALE)
            
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString()  // .replace(/\.?0+$/, "")
        }

        return resultTable
    }
    
    // 
    convertLogic_.linearAll = function(ut, unit, value) {
        var unitName, unitInfo
        var uSlope, uY_intercept
        var resultTable = {}
        
        var unitList = ut.unitList
        var unitInfoMap = ut.unitInfoMap
        
        var basevalue = (function() {
            var v = new Big(value)
            var slope = new Big(unitInfoMap[unit].slope)
            var y_intercept = new Big(unitInfoMap[unit].y_intercept)
            
            //   (1 / slope * value) - (y_intercept / slope)
            // = (value - y_intercept) / slope
            return v.minus(y_intercept).div(slope).round(unitConverter.core.SCALE)
        })()
        
        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            unitInfo = unitInfoMap[unitName]
            
            if (unitName == unit) {
                resultTable[unitName] = value
                continue
            }
            
            uSlope = new Big(unitInfo.slope)
            uY_intercept = new Big(unitInfo.y_intercept)
            
            // (unitInfo.slope * basevalue) + unitInfo.y_intercept
            result = uSlope.times(basevalue).plus(uY_intercept)
            
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString()  // .replace(/\.?0+$/, "")
        }
        
        return resultTable
    }
    
    convertLogic_.functionAll = function(ut, unit, value) {
        var unitName
        var resultTable = {}
        var unitList = ut.unitList
        var unitInfoMap = ut.unitInfoMap
        var converters = ut.unitInfoMap[unit].converters
        
        value = new Big(value)

        for (var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            
            if (unitName == unit) {
                resultTable[unitName] = value.toString()
            } else {
                //alert(unitName + "  " + unit)
                //alert(converters[unit])
                resultTable[unitName] = converters[unitName](value).toString()
            }
        }
            
        return resultTable
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    var createConverter_ = function(category, ut) {
        return {
            convertAll: function(unit, value) {
                return convertLogic_.convertAll(category, ut, unit, value)
            }
        }
    }
    
    var createLabelNameManager_ = function(category, ut) {
        return {
            getLabelFromUnit: function(unit) {
                return ut.unitInfoMap[unit].label
            }
        }
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    return {
        
        // Create Convert Manager.
        create: function(category, ut) {
            var cache = {}
            
            return {
                getUnitNameList: function() {
                    return ut.unitList
                },
                
                getConverter: function() {
                    if (cache.converter == null) {
                        cache.converter = createConverter_(category, ut)
                    }
                    return cache.converter
                },
                             
                getLabelNameManager: function() {
                    if (cache.lnm == null) {
                        cache.lnm = createLabelNameManager_(category, ut)
                    }
                    return cache.lnm
                },
                
                getCategoryName: function() {
                    return category
                },
                
                generateCssId: function(unit) {
                    return (category + "_" + unit)
                }
            }
        }
    }
})()



unitConverter.conversionTable = function(category, meta, conversionTable) {
    unitConverter.core.registerUnittable(category, meta, conversionTable)
}



