/**
 * Core function of Unit Converter.
 * This script must be loaded just after loading librarys.
 * 
 */

// All Unit Converter objects should point back to these
unitConverter = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.core = (function(){
    var utables_ = unitConverter.unittables
    
    var utMap_ = {}
    
    return {
        SCALE: 20,
        
        unittable: function(category, meta, conversionTable) {
            var unit
            
            // あれこれプリプロセス処理を追加する予定
            
            // unitList のチェックとか
            
            var t = {
                unitList: [],
                conversionInfo: {}
            }
            
            for (var i=0; i<conversionTable.length; i++) {
                unit = conversionTable[i].unit
                t.unitList.push(unit)
                t.conversionInfo[unit] = conversionTable[i].ratio
            }
            utMap_[category] = t
        },
        
        categoryList: function() {
            var list = []
            for (var k in utMap_) {
                if (utMap_.hasOwnProperty(k)) {
                    list.push(k)
                }
            }
            return list
        },
        
        unitList: function(category) {
            if (!(utMap_[category])) {
                return null
            }
            return utMap_[category].unitList
        },
        
        convert: function(category, unit, value) {
            var from, to, u
            var resultTable = {}
            var unitList = unitConverter.core.unitList(category)
            var conversionInfo = utMap_[category].conversionInfo
            
            try {
                from = new BigDecimal(String(conversionInfo[unit]))
                value = new BigDecimal(value)

                for(var i = 0; i < unitList.length; i++) {
                    u = unitList[i]
                    to = new BigDecimal(String(conversionInfo[u]))

                    // value * to / from
                    result = value.multiply(to).divide(from, unitConverter.core.SCALE, BigDecimal.ROUND_HALF_UP)

                    // 正規表現で余分な0を削る
                    resultTable[u] = result.toString().replace(/\.?0+$/, "")
                }
            } catch (e) {
                alert("error: convert")
                return null
            }
            
            return resultTable
        }
    }
    
})()

