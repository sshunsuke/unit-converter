/**
 * Core function of Unit Converter.
 * This script must be loaded just after loading librarys.
 * 
 */

// All Unit Converter objects should point back to these
unitConverter = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.core = (function(){
    
    var utMap_ = {}
    
    return {
        SCALE: 20,
        
        unittable: function(category, meta, conversionTable) {
            var unit
            
            // あれこれプリプロセス処理を追加する予定
            
            // unitList のチェックとか
            
            var t = {
                unitList: [],
                unitInfoMap: {}
            }
            
            for (var i=0; i<conversionTable.length; i++) {
                unit = conversionTable[i].unit
                t.unitList.push(unit)
                t.unitInfoMap[unit] = {
                    ratio: conversionTable[i].ratio,
                }
                t.unitInfoMap[unit].label = conversionTable[i].label || conversionTable[i].unit
            }
            utMap_[category] = t
        },
        
        getCategoryList: function() {
            var list = []
            for (var k in utMap_) {
                if (utMap_.hasOwnProperty(k)) {
                    list.push(k)
                }
            }
            return list
        },
        
        getUnitList: function(category) {
            return (utMap_[category] == null) ? null : utMap_[category].unitList
        },
        
        getLabel: function(category, unit) {
            return (utMap_[category] == null) ? null : utMap_[category].unitInfoMap[unit].label
        },
        
        convert: function(category, unit, value) {
            var unitList, unitInfoMap
            var from, to, u
            var resultTable = {}
            
            if (utMap_[category] == null) {
                return null
            }
            
            unitList = utMap_[category].unitList
            unitInfoMap = utMap_[category].unitInfoMap
            
            try {
                from = new BigDecimal(String(unitInfoMap[unit].ratio))
                value = new BigDecimal(value)

                for(var i = 0; i < unitList.length; i++) {
                    unitName = unitList[i]
                    to = new BigDecimal(String(unitInfoMap[unitName].ratio))

                    // value * to / from
                    result = value.multiply(to).divide(from, unitConverter.core.SCALE, BigDecimal.ROUND_HALF_UP)

                    // 正規表現で余分な0を削る
                    resultTable[unitName] = result.toString().replace(/\.?0+$/, "")
                }
            } catch (e) {
                alert("error: convert")
                return null
            }
            
            return resultTable
        }
    }
    
})()

