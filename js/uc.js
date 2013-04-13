/**
 * Core function of Unit Converter.
 * This script must be loaded before loading unit tables and "js/main.js".
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



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
unitConverter.ui = (function(){
    var core_ = unitConverter.core
    var utables_ = unitConverter.unittables    // alias of Unit Tables.
    
    var factory_ = {}
    var controller_ = {}
    
    /* - - - - - - - - - - - - - - - - - - - - */
    
    factory_.inputTag = function(category, unit, value) {
        return $('<input>').attr({
            type: 'text',
            id: category + "_" + unit,
            name: unit,
            'class': "uvalue",
            value: value,  //utables_[category][k],
            size: 30
        })
    }
    
    factory_.inputForm = function(category, unit, value) {
        var jqName = $('<div>').attr({
            'class': "uname"
        }).text(unit + " :  ")
        var jqInput = factory_.inputTag(category, unit, value)
        
        return $('<div>').addClass('container').append(jqName).append(jqInput).append("<div class='float_clear'><\/>")
    }
    
    factory_.inputAction = function(category, unit) {
        var idName = "#" + category + "_" + unit
        var oldValue = $(idName).val()
        
        return function() {
            var resultTable
            var currValue = $(idName).val()
            
            if ((oldValue === currValue) ||
                (parseFloat(oldValue) == parseFloat(currValue))) {
                return
            }
            try {
                new BigDecimal(currValue)
            } catch (e) {
                //alert(e)
                return
            }
            
            resultTable = unitConverter.core.convert(category, unit, currValue)
            controller_.setUnitFormValue(category, resultTable)
            oldValue = currValue
        }
    }
    
    /* - - - - - - - - - - - - - - - - - - - - */
    
    controller_.repaintUnit = function(category, resultTable) {
        var jqUnit, jqForm, jqInput
        var unitList = unitConverter.core.unitList(category)
        var resultTable = unitConverter.core.convert(category, unitList[0], "1")
        
        jqUnit = $("#unit").empty()
        jqForm = $("<form id=\"values\"></form>").appendTo(jqUnit)
        
        // Form 部分を作成
        for (var i=0; i<unitList.length; i++) {
            jqInput = factory_.inputForm(category, unitList[i], resultTable[unitList[i]])
            jqForm.append(jqInput)
            jqInput.bind('keyup', factory_.inputAction(category, unitList[i]) )
        }
    }
    
    controller_.setUnitFormValue = function(category, resultTable) {
        var unitList = unitConverter.core.unitList(category)
        var prefixStr = "#" + category + "_"
        
        for (var i=0; i<unitList.length; i++) {
            $(prefixStr + unitList[i]).val(resultTable[unitList[i]])
        }
    }
    
    /* - - - - - - - - - - - - - - - - - - - - */
    
    return {
        generateButtonClickAction: function(category) {
            var f = function() {
                // Form 部分を作成
                controller_.repaintUnit(category)
            }
            return f
        }
    }
})()


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
