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

unitConverter.ui.factory.inputTag = function(convertManager, unit, value) {
    return $('<input>').attr({
        type : 'text',
        id : convertManager.generateCssId(unit),
        name : unit,
        'class' : "uvalue",
        value : value,
        size : 30
    })
}


unitConverter.ui.factory.labelTextTag = function(label) {
    return $('<div>').attr({'class' : "uname"}).text(label + " :  ")
}


unitConverter.ui.factory.inputForm = function(convertManager, unit, value) {
    var jqName, jqInput
    var lnm = convertManager.getLabelNameManager()
    var label = lnm.getLabelFromUnit(unit)
    
    jqName = unitConverter.ui.factory.labelTextTag(label)
    jqInput = unitConverter.ui.factory.inputTag(convertManager, unit, value)

    return $('<div>').addClass('container').
           append(jqName).append(jqInput).append("<div class='float_clear'><\/>")
}


unitConverter.ui.factory.inputAction = function(convertManager, unit) {
    var converter = convertManager.getConverter()
    var idName = "#" + convertManager.generateCssId(unit)
    var oldValue = $(idName).val()

    return function() {
        var resultTable
        var currValue = $(idName).val()

        if((oldValue === currValue) ||
           (parseFloat(oldValue) == parseFloat(currValue))) {
            return
        }
        try {
            new Big(currValue)
        } catch (e) {
            //alert(e)
            return
        }
        
        resultTable = converter.convertAll(unit, currValue)
        unitConverter.ui.controller.setUnitFormValue(convertManager, resultTable)
        oldValue = currValue
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.ui.controller = {}

unitConverter.ui.controller.repaintUnit = function(category, resultTable) {
    var cm, converter, unitList, unit
    var jqUnit, jqForm, jqInput
    var resultTable
    var factory = unitConverter.ui.factory
    
    cm = unitConverter.core.getConvertManagerList().getConvertManager(category)
    converter = cm.getConverter()
    unitList = cm.getUnitNameList(category)
    
    resultTable = converter.convertAll(unitList[0], "1")
    
    jqUnit = $("#unit").empty()
    jqForm = $("<form id=\"values\"></form>").appendTo(jqUnit)

    // Form 部分を作成
    for(var i = 0; i < unitList.length; i++) {
        unit = unitList[i]
        jqInput = factory.inputForm(cm, unit, resultTable[unit])
        jqForm.append(jqInput)
        jqInput.bind('keyup', factory.inputAction(cm, unit))
    }
}


unitConverter.ui.controller.setUnitFormValue = function(convertManager, resultTable) {
    var unitList = convertManager.getUnitNameList()
    var category = convertManager.getCategoryName()
    var prefixStr = "#" + category + "_"

    for(var i = 0; i < unitList.length; i++) {
        $(prefixStr + unitList[i]).val(resultTable[unitList[i]])
    }
}


