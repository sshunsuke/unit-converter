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
    
    // Actual 
    var convertLogic_ = {}
    
    // Function Table containing register process 
    var utRegister_ = {}
    
    /* - - - - - - - - - - - - - - - - - - - */
    
    // Prototype of Convert Manager objects.
    var protoConvertManager_ = function(category) {
        this.category = category
        this.cache = {}
    }
    
    // Prototype of Converter objects.
    var protoConverter_ = function(category) {
        this.category = category
    }
    
    // Prototype of Label Name Manager.
    var protoLabelNameManager_ = function(category) {
        this.category = category
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // A function to do actual conversion
    convertLogic_.convertAll = function(category, unit, value) {
        var resultTable = {}
        
        if(utMap_[category] == null) {
            return null
        }
        
        try {
            if (utMap_[category].type == "ratio") {
                resultTable = convertLogic_.ratioAll(category, unit, value)
            } else if (utMap_[category].type == "linear") {
                resultTable = convertLogic_.linearAll(category, unit, value)
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
    convertLogic_.ratioAll = function(category, unit, value) {
        var unitList, unitInfoMap
        var from, to, unitName
        var resultTable = {}

        unitList = utMap_[category].unitList
        unitInfoMap = utMap_[category].unitInfoMap
        
        from = new BigDecimal(String(unitInfoMap[unit].ratio))
        value = new BigDecimal(value)

        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            to = new BigDecimal(String(unitInfoMap[unitName].ratio))
            
            // value * to / from
            result = value.multiply(to).divide(from,
                                               unitConverter.core.SCALE,
                                               BigDecimal.ROUND_HALF_UP)
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString().replace(/\.?0+$/, "")
        }

        return resultTable
    }
    
    // 
    convertLogic_.linearAll = function(category, unit, value) {
        var unitName, unitInfo
        var uSlope, uY_intercept
        var resultTable = {}
        
        var unitList = utMap_[category].unitList
        var unitInfoMap = utMap_[category].unitInfoMap
        
        var basevalue = (function() {
            var v = new BigDecimal(value)
            var slope = new BigDecimal(String(unitInfoMap[unit].slope))
            var y_intercept = new BigDecimal(String(unitInfoMap[unit].y_intercept))
            
            //   (1 / slope * value) - (y_intercept / slope)
            // = (value - y_intercept) / slope
            return v.subtract(y_intercept).divide(slope,
                           unitConverter.core.SCALE, BigDecimal.ROUND_HALF_UP)
        })()
        
        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            unitInfo = unitInfoMap[unitName]
            
            if (unitName == unit) {
                resultTable[unitName] = value
                continue
            }
            
            uSlope = new BigDecimal(String(unitInfo.slope))
            uY_intercept = new BigDecimal(String(unitInfo.y_intercept))
            
            // (unitInfo.slope * basevalue) + unitInfo.y_intercept
            result = uSlope.multiply(basevalue).add(uY_intercept)
            
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString().replace(/\.?0+$/, "")
        }
        
        return resultTable
    }
 
    /* - - - - - - - - - - - - - - - - - - - */
    
    // Unit Table の登録処理.
    
    utRegister_.checkMeta = function(meta) {
        if ((meta.type == null) ||
            (meta.type == "ratio") || (meta.type == "linear")) {
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
        }

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
            return new protoConvertManager_(category)
        }
        
        protoF.prototype.size = function(){
            return utMap_.length
        }
        
        return new protoF() 
    })()
    
    /* - - - - - - - - - - - - - - - - - - - */
    // Convert Manager
    
    protoConvertManager_.prototype.getUnitNameList = function() {
        return utMap_[this.category].unitList
    }
    
    protoConvertManager_.prototype.getLabelNameManager = function() {
        if (this.cache.lnm == null) {
            this.cache.lnm = new protoLabelNameManager_(this.category)
        }
        return this.cache.lnm
    }
    
    protoConvertManager_.prototype.getConverter = function() {
        if (this.cache.converter == null) {
            this.cache.converter = new protoConverter_(this.category)
        }
        return this.cache.converter
    }
    
    protoConvertManager_.prototype.getCategoryName = function() {
        return this.category
    }
    
    protoConvertManager_.prototype.generateCssId = function(unit) {
        return (this.category + "_" + unit)
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    

    protoConverter_.prototype.convertAll = function(unit, value) {
        return convertLogic_.convertAll(this.category, unit, value)
    }
    
    
    /* - - - - - - - - - - - - - - - - - - - */
    
    protoLabelNameManager_.prototype.getLabelFromUnit = function(unit) {
        return utMap_[this.category].unitInfoMap[unit].label
    }
    
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


unitConverter.conversionTable = function(category, meta, conversionTable) {
    unitConverter.core.registerUnittable(category, meta, conversionTable)
}



