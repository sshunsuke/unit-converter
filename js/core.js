/**
 * Core function of Unit Converter.
 * This script must be loaded just after loading librarys.
 * 
 * @author  Shunsuke
 */

// All Unit Converter objects should point back to these
unitConverter = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.core = (function(){
    
    // Unit Table Map
    var utMap_ = {}
    
    // Convert Manager
    var protoConvertManager_ = function(category) {
        this.category = category
        this.cache = {}
    }
    
    // Converter
    var protoConverter_ = function(category) {
        this.category = category
    }
    
    // Label Name Manager.
    var protoLabelNameManager_ = function(category) {
        this.category = category
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
    
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
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - */
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
        var unitList, unitInfoMap
        var from, to, u
        var resultTable = {}

        if(utMap_[this.category] == null) {
            return null
        }
        unitList = utMap_[this.category].unitList
        unitInfoMap = utMap_[this.category].unitInfoMap

        try {
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
        } catch (e) {
            alert("error: convert")
            return null
        }

        return resultTable
    }

    
    /* - - - - - */
    
    protoLabelNameManager_.prototype.getLabelFromUnit = function(unit) {
        return utMap_[this.category].unitInfoMap[unit].label
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
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
        
        getConvertManagerList: function(){
            return convertManagerList_
        }
        
        
        /*
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
        */
    }
    
})()

