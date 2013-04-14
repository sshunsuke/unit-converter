/**
 * UI control functions of Unit Converter.
 * 
 */

unitConverter.ui = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.ui.generateButtonClickAction = function(category) {
    var f = function() {
        // Form 部分を作成
        unitConverter.ui.controller.repaintUnit(category)
    }
    return f
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.ui.factory = {}

unitConverter.ui.factory.inputTag = function(category, unit, value) {
    return $('<input>').attr({
        type : 'text',
        id : category + "_" + unit,
        name : unit,
        'class' : "uvalue",
        value : value,
        size : 30
    })
}


unitConverter.ui.factory.labelTextTag = function(category, unit) {
    //var label = unitConverter.core.getUnitInfo(category, unit).label
    
    var label = unitConverter.core.getLabel(category, unit)
    return $('<div>').attr({'class' : "uname"}).text(label + " :  ")
}


unitConverter.ui.factory.inputForm = function(category, unit, value) {
    var jqName = unitConverter.ui.factory.labelTextTag(category, unit)
    var jqInput = unitConverter.ui.factory.inputTag(category, unit, value)

    return $('<div>').addClass('container').
           append(jqName).append(jqInput).append("<div class='float_clear'><\/>")
}

unitConverter.ui.factory.inputAction = function(category, unit) {
    var idName = "#" + category + "_" + unit
    var oldValue = $(idName).val()

    return function() {
        var resultTable
        var currValue = $(idName).val()

        if((oldValue === currValue) ||
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
        unitConverter.ui.controller.setUnitFormValue(category, resultTable)
        oldValue = currValue
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.ui.controller = {}

unitConverter.ui.controller.repaintUnit = function(category, resultTable) {
    var jqUnit, jqForm, jqInput
    var factory = unitConverter.ui.factory
    var unitList = unitConverter.core.getUnitList(category)
    var resultTable = unitConverter.core.convert(category, unitList[0], "1")
    
    jqUnit = $("#unit").empty()
    jqForm = $("<form id=\"values\"></form>").appendTo(jqUnit)

    // Form 部分を作成
    for(var i = 0; i < unitList.length; i++) {
        jqInput = factory.inputForm(category, unitList[i], resultTable[unitList[i]])
        jqForm.append(jqInput)
        jqInput.bind('keyup', factory.inputAction(category, unitList[i]))
    }
}

unitConverter.ui.controller.setUnitFormValue = function(category, resultTable) {
    var unitList = unitConverter.core.getUnitList(category)
    var prefixStr = "#" + category + "_"

    for(var i = 0; i < unitList.length; i++) {
        $(prefixStr + unitList[i]).val(resultTable[unitList[i]])
    }
}


