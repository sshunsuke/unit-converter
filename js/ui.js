/**
 * UI control functions of Unit Converter.
 * 
 */

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
