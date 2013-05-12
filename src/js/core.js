/**
 * Core features of Unit Converter.
 * This script must be loaded just after loading librarys.
 * 
 * Core features are provide through OOP style interface.
 * Following are key objects in the core interface.
 *   - ConvertManagerList
 *     - ConvertManager
 *       - Converter
 *       - UnitList
 * 
 * And, below is typical code of unit conversion.
 *   cml = unitConverter.core.getConvertManagerList();
 *   cm = cml.getConvertManager( "categoryName" );
 *   converter = cm.getConverter();
 *   result = converter.convertAll("unitFrom", valueFrom);
 * 
 *   str = ""
 *   for (unit in result) {
 * 	   if ( result.hasOwnProperty(unit) ) {
 * 	     str = str + unit + ": " + result[unit] + "¥n";
 *     }
 *   }
 *   alert(str)
 * 
 * @author  Shunsuke
 */

//'use strict';

// All Unit Converter objects should point back to these.
var unitConverter = {}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

unitConverter.core = (function(){
    
    // Conversion Info Map
    var ciMap_ = {}
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // prototype object of "Convert Manager List".
    
    var protoConvertManagerList_ = function() {}
    
    protoConvertManagerList_.prototype.getCategoryNameList = function() {
        var list = []
        for(var k in ciMap_) {
        	if (ciMap_.hasOwnProperty(k)) {
        		list.push(k)
            }
        }
        return list
    }
    
    protoConvertManagerList_.prototype.getConvertManager = function(category) {
        if (ciMap_[category] == null) {
            return null
        }
        return unitConverter.core.cmf_.create(category, ciMap_[category])
    }
        
    protoConvertManagerList_.prototype.size = function(){
        return ciMap_.length
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // Publib Methods.
    return {
        SCALE: 20,
        
        registerConversionInfo: function(category, ci) {
            ciMap_[category] = ci
        },
        
        /**
         * Get a "Convert Manager List" object.
         * 
         * @return a ConvertManagerList object
         *         This object has following methods.
         *           - getCategoryNameList()
         *           - getConvertManager(category)
         *           - size()
         */
        getConvertManagerList: function(){
            return new protoConvertManagerList_()
        }
    }
    
})()


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// Converter Manager Factory.
unitConverter.core.cmf_ = (function(){
    
    // Actual 
    var convertLogic_ = {}
    
    // A function to do actual conversion
    convertLogic_.convertAll = function(category, ci, unit, value) {
        var resultTable = {}
        
        try {
            if (ci.type == "ratioLite") {
                resultTable = convertLogic_.ratioLiteAll(ci, unit, value)
            } else if (ci.type == "linear") {
                resultTable = convertLogic_.linearAll(ci, unit, value)
            } else if (ci.type == "function") {
                resultTable = convertLogic_.functionAll(ci, unit, value)
            } else {
                alert("error")
            }
        } catch (e) {
            alert("error: " + e.toString())
            return null
        }
        
        return resultTable
    }
    
    // 
    convertLogic_.ratioLiteAll = function(ci, unit, value) {
        var unitList, conversionTable
        var from, to, unitName
        var resultTable = {}

        unitList = ci.unitList
        conversionTable = ci.conversionTable
        
        from = new Big( conversionTable[unit].ratio )
        value = new Big(value)

        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            to = new Big(conversionTable[unitName].ratio)
            
            // value * to / from
            result = value.times(to).div(from).round(unitConverter.core.SCALE)
            
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString()  // .replace(/\.?0+$/, "")
        }

        return resultTable
    }
    
    // 
    convertLogic_.linearAll = function(ci, unit, value) {
        var unitName, unitInfo
        var uSlope, uY_intercept
        var resultTable = {}
        
        var unitList = ci.unitList
        var conversionTable = ci.conversionTable
        
        var basevalue = (function() {
            var v = new Big(value)
            var slope = new Big(conversionTable[unit].slope)
            var y_intercept = new Big(conversionTable[unit].y_intercept)
            
            //   (1 / slope * value) - (y_intercept / slope)
            // = (value - y_intercept) / slope
            return v.minus(y_intercept).div(slope).round(unitConverter.core.SCALE)
        })()
        
        for(var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            unitInfo = conversionTable[unitName]
            
            if (unitName == unit) {
                resultTable[unitName] = value
                continue
            }
            
            uSlope = new Big(unitInfo.slope)
            uY_intercept = new Big(unitInfo.y_intercept)
            
            // (unitInfo.slope * basevalue) + unitInfo.y_intercept
            result = uSlope.times(basevalue).plus(uY_intercept)
            
            // 正規表現で余分な0を削る
            resultTable[unitName] = result.toString()  // .replace(/\.?0+$/, "")
        }
        
        return resultTable
    }
    
    convertLogic_.functionAll = function(ci, unit, value) {
        var unitName
        var resultTable = {}
        var unitList = ci.unitList
        var conversionTable = ci.conversionTable
        var converters = ci.conversionTable[unit].converters
        
        value = new Big(value)

        for (var i = 0; i < unitList.length; i++) {
            unitName = unitList[i]
            
            if (unitName == unit) {
                resultTable[unitName] = value.toString()
            } else {
                //alert(unitName + "  " + unit)
                //alert(converters[unit])
                resultTable[unitName] = converters[unitName](value).toString()
            }
        }
            
        return resultTable
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // Factory method for Converter.
    var createConverter_ = function(category, ci) {
        return {
            convertAll: function(unit, value) {
                return convertLogic_.convertAll(category, ci, unit, value)
            }
        }
    }
    
    // Factory method for Label Manager.
    var createLabelNameManager_ = function(category, ci) {
        return {
            getLabelFromUnit: function(unit) {
                return ci.conversionTable[unit].label
            }
        }
    }
    
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
    // Publib Methods.
    return {
        
        /**
         * Create a "Convert Manager" object.
         * @param category
         * @param ci       ConversionInfo
         *                 (this is internal data using inside of core modules)
         * @return object of Converter Manager
         */
        create: function(category, ci) {
            var cache = {}
            
            return {
                getUnitNameList: function() {
                    return ci.unitList
                },
                
                getConverter: function() {
                    if (cache.converter == null) {
                        cache.converter = createConverter_(category, ci)
                    }
                    return cache.converter
                },
                             
                getLabelNameManager: function() {
                    if (cache.lnm == null) {
                        cache.lnm = createLabelNameManager_(category, ci)
                    }
                    return cache.lnm
                },
                
                getCategoryName: function() {
                    return category
                },
                
                generateCssId: function(unit) {
                    return (category + "_" + unit)
                }
            }
        }
    }
})()


