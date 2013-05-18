// 'use strict';

function assertTrue(condition, msg) {
	if (!condition) {
		throw new Error("assertTrue() " + (typeof msg == "string" ? msg : ""))
	}
	print("assertTrue(): OK  " + (typeof msg == "string" ? msg : ""))
}


function assertObject(object, msg) {
	if (typeof object != "object") {
		throw new Error("assertObject() " + (typeof msg == "string" ? msg : ""))
	}
	print("assertObject(): OK  " + (typeof msg == "string" ? msg : ""))
}

function assertArray(array, msg) {
	if (!(array instanceof Array)) {
		throw new Error("assertArray() " + (typeof msg == "string" ? msg : ""))
	}
	print("assertArray(): OK  " + (typeof msg == "string" ? msg : ""))
}


function assertEquals(expected, actual, msg) {
	var s = "assertEquals(): "
	if (expected != actual) {
		s += "expected='" + expected + "', actual='" + actual + "'"
		s += typeof msg == "string" ? (", msg='" + msg + "'") : ""
		throw new Error(s)
	}
	print(s + "OK  " + (typeof msg == "string" ? msg : ""))
}


function assertArrayEquals(expecteds, actuals, msg) {
	assertArray(actuals, msg)    // is array?
	if (expecteds.length != actuals.length) {
		throw new Error("assertArrayEquals() lenght of array")
	}
	for (var i=0; i<expecteds.length; i++) {
		if (expecteds[i] != actuals[i]) {
			throw new Error("assertArrayEquals() index=" + i)
		}
	}
	print("assertArrayEquals(): OK  " + (typeof msg == "string" ? msg : ""))
}
	
function assertExactlyEquals(expected, actual) {
	
}