/**
 * Entry Point.
 *
 * @author  Shunsuke
 */


$(function() {
    
    var jqCategory = $("#category")
    var jqButton
    var cml = unitConverter.core.getConvertManagerList()
    var categoryList = cml.getCategoryNameList()
    
    // 左側に Unit Button を配置
    for (var i=0; i<categoryList.length; i++) {
        jqButton = $("<div class=\"button\">" + categoryList[i] + "</div>")
        jqButton.click( unitConverter.ui.generateButtonClickAction(categoryList[i]) )
        jqCategory.append(jqButton)
    }
    
    jqCategory.children().eq(0).click()


    /*
    n1 = new BigDecimal("1234.5678")
    n2 = new BigDecimal("35678")
    
    alert(n1.isPositive())
    
    n = n1.add(n2)
    alert(parseFloat(n))
    */
})