/**
 * Conversion Table.
 * 
 * @author  Shunsuke
 */


unitConverter.conversionTable = (function(){
    
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
    
    return function(category, meta, conversionTable) {
        utRegister_.register(category, meta, conversionTable)
    }
}())

