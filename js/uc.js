/**
 * Core function of Unit Converter.
 * This script must be loaded before loading unit tables and "js/main.js".
 * 
 */

// All Unit Converter objects should point back to these
unitConverter = {}

unitConverter.unittables = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
unitConverter.core = (function(){
    var utables_ = unitConverter.unittables
    
    return {
        SCALE: 20,
        
        unittable: function(meta, unitList) {
            var t = {}
            // あれこれプリプロセス処理を追加する予定
            
            // unitList のチェックとか
            
            // 応急処置
            for (var i=0; i<unitList.length; i++) {
                t[unitList[i].unit] = unitList[i].ratio
            }
            
            return t
        },
        
        convert: function(category, unit, value) {
            var from = new BigDecimal(String(utables_[category][unit]))
            var to, result
            value = new BigDecimal(value)
            //alert(value.toString())
            for (k in utables_[category]){
                to = new BigDecimal(String(utables_[category][k]))
                result = value.multiply(to).divide(from, unitConverter.core.SCALE, BigDecimal.ROUND_HALF_UP)
                
                //alert(result.toString())
                //alert(result.toString().replace(/\.?0+$/, "x"))
                
                
                //alert(to / from * value)
                // 正規表現で余分な0を削る
                $("#" + category + "_" + k).val(result.toString().replace(/\.?0+$/, ""))
            }
        }
    }
    
})()

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
unitConverter.ui = (function(){
    var core_ = unitConverter.core
    var utables_ = unitConverter.unittables    // alias of Unit Tables.
    var factory_ = {}
    
    factory_.inputTag = function(category, unit) {
        return $('<input>').attr({
            type: 'text',
            id: category + "_" + unit,
            name: unit,
            'class': "uvalue",
            value: utables_[category][k],
            size: 30
        })
    }
    
    factory_.inputForm = function(category, unit) {
        var jqName = $('<div>').attr({
            'class': "uname"
        }).text(unit + " :  ")
        var jqInput = factory_.inputTag(category, unit)
        
        return $('<div>').addClass('container').append(jqName).append(jqInput).append("<div class='float_clear'><\/>")
    }
    
    factory_.inputAction = function(category, unit) {
        var idName = "#" + category + "_" + unit
        var oldValue = $(idName).val()
        return function() {
            var currValue = $(idName).val()
            if (oldValue !== currValue && !isNaN(parseFloat(currValue))) {
                if ( parseFloat(oldValue) != parseFloat(currValue) ) {
                    core_.convert(category, unit, currValue)
                    oldValue = currValue
                }
            }
        }
    }
    
    return {
        generateButtonClickAction: function(category) {
            var f = function() {
                var jqUnit = $("#unit").empty()
                var jqForm = $("<form id=\"values\"></form>").appendTo(jqUnit)
                var inputTag, jqInput
                
                for (k in utables_[category]) {
                    jqInput = factory_.inputForm(category, k)
                    jqForm.append(jqInput)
                    jqInput.bind('keyup', factory_.inputAction(category, k) )
                }
            }
            return f
        }
    }
})()


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
