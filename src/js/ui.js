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


// 応急処置
unitConverter.ui.oldValueTable = {}


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
    
    jqInput.bind('keyup', unitConverter.ui.factory.inputAction(convertManager, unit))

    return $('<div>').addClass('container').
           append(jqName).append(jqInput).append("<div class='float_clear'><\/>")
}


unitConverter.ui.factory.inputAction = function(convertManager, unit) {
    var converter = convertManager.getConverter()
    var idName = "#" + convertManager.generateCssId(unit)

    var f = function() {
        var resultTable
        var oldValue = unitConverter.ui.oldValueTable[unit]
        var currValue = $(idName).val()
        
        //alert(oldValue)

        if(!currValue || (oldValue === currValue) ||
           (parseFloat(oldValue) == parseFloat(currValue))) {
            return
        }
        try {
            new Big(currValue)
        } catch (e) {
            alert(e)
            return
        }
        
        resultTable = converter.convertAll(unit, currValue)
        unitConverter.ui.controller.setUnitFormValue(convertManager, resultTable)
        unitConverter.ui.oldValueTable[unit] = currValue
    }
    
    return f
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
    unitConverter.ui.oldValueTable = {}
    
    jqUnit = $("#unit").empty()
    jqForm = $("<form id=\"values\"></form>").appendTo(jqUnit)

    // Form 部分を作成
    for(var i = 0; i < unitList.length; i++) {
        unit = unitList[i]
        jqInput = factory.inputForm(cm, unit, resultTable[unit])
        jqForm.append(jqInput)
        unitConverter.ui.oldValueTable[unit] = resultTable[unit]
    }
}


unitConverter.ui.controller.setUnitFormValue = function(convertManager, resultTable) {
    var unitList = convertManager.getUnitNameList()
    var category = convertManager.getCategoryName()
    var prefixStr = "#" + category + "_"

    for(var i = 0; i < unitList.length; i++) {
        $(prefixStr + unitList[i]).val(resultTable[unitList[i]])
        unitConverter.ui.oldValueTable[unitList[i]] = resultTable[unitList[i]]
    }
}


