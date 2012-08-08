/**
 * Basic StringBuilder object:
 */
function StringBuilder(value) {
    this.strings = [];
    this.append(value);
}
StringBuilder.prototype.append = function (value) {
    if (value) {
        this.strings.push(value);
    }
};
StringBuilder.prototype.clear = function () {
    this.strings.length = 0;
};
StringBuilder.prototype.toString = function () {
    return this.strings.join("");
};


if ( typeof(WP) == "undefined") {
	var WP = {};
}
WP.Utils = {};

//{title : "Save Dialog", size : blackberry.ui.dialog.SIZE_MEDIUM, position : blackberry.ui.dialog.LOC_BOTTOM}
WP.Utils.standardDialog = function( options ) {
	try  {
		WP.Utils.Debug.log("standardDialog", "in standardDialog", debug.info);
		
		if ((window.blackberry === undefined) || (blackberry.ui === undefined) || (blackberry.ui.dialog === undefined)) {
			alert("blackberry.ui.dialog object is undefined.  Unable to complete action.");
			WP.Utils.Debug.log("standardDialog", "blackberry.ui.dialog object is undefined.", WP.Utils.Debug.error);
			return false;
		}
		var ops = {title : "Save Dialog", size : blackberry.ui.dialog.SIZE_MEDIUM, position : blackberry.ui.dialog.LOC_BOTTOM};
		ops = WP.Utils.mixin(ops, options);	
		if (blackberry.ui.dialog.standardAskAsync !== undefined) {
			blackberry.ui.dialog.standardAskAsync("Save?", blackberry.ui.dialog.D_SAVE, standardDialogCallBack, ops);
		} 
		else {
			blackberry.ui.dialog.standardAsk(blackberry.ui.dialog.D_YES_NO, "Save?", 0, true);
		}
	} 
	catch (e) {
		WP.Utils.Debug.log("standardDialog", e, WP.Utils.Debug.exception);
	}
};

WP.Utils.errorDialog = function( exception ) {
	try  {
		if ((window.blackberry === undefined) || (blackberry.ui === undefined) || (blackberry.ui.dialog === undefined)) {
			alert(exception.name+ " " + exception.message);
			return false;
		}
		var ops = { title : "Error", size : blackberry.ui.dialog.SIZE_MEDIUM, position : blackberry.ui.dialog.LOC_CENTER };
		if (blackberry.ui.dialog.standardAskAsync !== undefined) {
			blackberry.ui.dialog.standardAskAsync(exception.name+ " - " + exception.message, blackberry.ui.dialog.D_OK, function(){}, ops);
		} else {
			blackberry.ui.dialog.standardAsk(blackberry.ui.dialog.D_OK, exception.name+ " - " + exception.message, 0, true);
		}
	} 
	catch (e) {
		WP.Utils.Debug.log("errorDialog", e, WP.Utils.Debug.exception);
		alert( e.toString() );
	}
};


/**
 * Debugger object - used to output messages to console window.
 */
WP.Utils.Debug = {};
WP.Utils.Debug.logLevel = 0;
WP.Utils.Debug.info = 1;
WP.Utils.Debug.warning = 2;
WP.Utils.Debug.error = 3;
WP.Utils.Debug.exception = 4;
WP.Utils.Debug.numMsgs = 0;
WP.Utils.Debug.logLevelLabels = ["", "INFO", "WARNING", "ERROR", "EXCEPTION"];
WP.Utils.Debug.log = function (source, message, debugLevel) {
	if (debugLevel >= this.logLevel) {
		console.log(this.logLevelLabels[debugLevel]+" [" + source + "] " + message);
		this.numMsgs = this.numMsgs + 1;
	}
};
WP.Utils.Debug.size = function() {
	return this.numMsgs;
};
WP.Utils.Debug.clear = function() {
	this.numMsgs = 0;
};


/**
 * Methods to add content to page elements.
 */
WP.Utils.setContent = function(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
		ele.innerHTML = content;
	}
};

WP.Utils.appendContent = function(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
//		ele.innerHTML = ele.innerHTML + content;
		ele.insertAdjacentHTML("beforeend", content);		//try a faster construct instead of insertHTML
	}
};
WP.Utils.prependContent = function(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
//		ele.innerHTML = content + ele.innerHTML;
		ele.insertAdjacentHTML("afterbegin", content);		//try a faster construct instead of insertHTML
	}
};
WP.Utils.show = function(id) {
	var ele = document.getElementById(id); 
	if (id) {
		ele.style.display = '';
	}
};
WP.Utils.hide= function(id) {
	var ele = document.getElementById(id);
	if (id) {
		ele.style.display = 'none';
	}
};
WP.Utils.setClassName = function (id, className) {
	var ele = document.getElementById(id);
	if (ele) {
		ele.className = className;
	}
};
WP.Utils.openUrl = function(url) {
	try
	{
		//Attempt to use the WebWorks Invoke API to open the URL in the native broser application:
		if ((window.blackberry !== undefined) && (blackberry.invoke !== undefined) && (blackberry.invoke.BrowserArguments !== undefined)) {
			var args = new blackberry.invoke.BrowserArguments(url);
			blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
			return true;
		}
		
		//Otherwise open the URL in the current window (if done from a WebWorks app, this may prevent the user from returning to the current page as there is no native 'back' button)
		window.location = url;
	}
	catch(e) {
		WP.Utils.Debug.log("openUrl", e, debug.exception);
	}
};
WP.Utils.isBlackBerrySmartphone = function() {
	var ua, isMIDP, isWebKit, isBlackBerry;
	ua = navigator.userAgent.toLowerCase();		
	isMIDP = (ua.indexOf("midp") >= 0);
	isWebKit = (ua.indexOf("webkit") >= 0);
	isBlackBerry = (ua.indexOf("blackberry") >= 0);
	return ((isMIDP || isWebKit) && isBlackBerry);
};
WP.Utils.isBlackBerryPlayBook = function() {
	var ua, isWebKit, isTablet;
	ua = navigator.userAgent.toLowerCase();		
	isWebKit = (ua.indexOf("webkit") >= 0);
	isTablet = (ua.indexOf("playbook") >= 0);
	return (isWebKit && isTablet);
};

/*
WP.Utils.parseURL = function() {
	try {
		WP.Utils.Debug.log("parseURL", "in parseURL");

		if ((window.blackberry === undefined) || (blackberry.utils === undefined)) {
			WP.Utils.Debug.log("parseURL", "blackberry.utils object is undefined", debug.error);
			return false;
		}

		var ele = document.getElementById("txtURL");
		if (ele) {
			var url = blackberry.utils.parseURL(ele.value);
			
			var sb = new StringBuilder();
			sb.append("<table>");
			sb.append("<tr><th>Host</th><td>" + url.host + "</td></tr>");
			sb.append("<tr><th>Port</th><td>" + url.port + "</td></tr>");
			sb.append("<tr><th>Parameter (index 0)</th><td>" + url.getURLParameterByIndex(0) + "</td></tr>");
			sb.append("<tr><th>Parameter (name 'FOO')</th><td>" + url.getURLParameter("FOO") + "</td></tr>");
			sb.append("</table>");
			appendContent("urlDetails", sb.toString());
		}
		
	} 
	catch(e) {
		WP.Utils.Debug.log("parseURL", e, debug.exception);
	}
}
*/
WP.Utils.generateUID = function() {
	try {
		WP.Utils.Debug.log("generateUID", "in generateUID", debug.info);

		if ((window.blackberry === undefined) || (blackberry.utils === undefined)) {
			WP.Utils.Debug.log("generateUID", "blackberry.utils object is undefined", debug.error);
			return false;
		}
		var uniqueId = blackberry.utils.generateUniqueId();
		return uniqueId;
	} 
	catch(e) {
		WP.Utils.Debug.log("generateUID", e, debug.exception);
	}
};



if( typeof(EW) == "undefined" ) { 
	EW={ }; 
}

EW.Utils = {};

EW.Utils.toArray = function(pseudoArray) {
	var result = [];
	for (var i = 0; i < pseudoArray.length; i++)
		result.push(pseudoArray[i]);
	return result;
};

EW.Utils.createMethodReference = function(object, methodName) {
	var oldArguments = EW.Utils.toArray(arguments).slice(2);
	return function () {
		var newArguments = EW.Utils.toArray(arguments);
		object[methodName].apply(object, oldArguments.concat(newArguments));
	};
};

EW.Utils.showErrorDialog = function(error_title, error_obj) {
	alert(error_obj.name + "--" + error_obj.message);	
};


EW.LogSystem = {

		_logger : null,
		_ajaxAppender : null,

		init :function(urlAjaxAppender){	

		},
		trace:function(msg){
			console.trace(msg);
		},
		debug:function(msg){
			console.debug(msg);
		},
		info:function(msg){
			console.info(msg);
		},
		warn:function(msg){
			console.warn(msg);
		},
		error:function(msg){
			console.error(msg);
		},
		unload:function(){
			this._logger=null;
			return;	
		}	
};

//hehe
(function(){

	//* Returns a random Integer between 0 and inBound (0 <= results < inBound).
	//
	//		var randomLetter = String.fromCharCode(enyo.irand(26) + 97);
	//
	WP.Utils.irand = function(inBound) {
		return Math.floor(Math.random() * inBound);
	};

	//* Returns inString with the first letter capitalized.
	WP.Utils.cap = function(inString) {
		return inString.slice(0, 1).toUpperCase() + inString.slice(1);
	};

	//* Returns inString with the first letter un-capitalized.
	WP.Utils.uncap = function(inString) {
		return inString.slice(0, 1).toLowerCase() + inString.slice(1);
	};

	WP.Utils.format = function(inVarArgs) {
		var pattern = /\%./g;
		var arg = 0, template = inVarArgs, args = arguments;
		var replacer = function(inCode) {
			return args[++arg];
		};
		return template.replace(pattern, replacer);
	};

	var toString = Object.prototype.toString;

	//* Returns true if _it_ is a string.
	WP.Utils.isString = function(it) {
		return toString.call(it) === "[object String]";
	};

	//* Returns true if _it_ is a function.
	WP.Utils.isFunction = function(it) {
		return toString.call(it) === "[object Function]";
	};

	//* Returns true if _it_ is an array.
	WP.Utils.isArray = function(it) {
		return toString.call(it) === "[object Array]";
	};

	if (Array.isArray) {
		WP.Utils.isArray = Array.isArray;
	}

	//* @protected
	var empty = {};
	
	//* @public
	/**
		Copies custom properties from the _source_ object to the _target_ object.
		If _target_ is falsey, an object is created.
		If _source_ is falsey, the target or empty object is returned.
	*/
	WP.Utils.mixin = function(target, source) {
		target = target || {};
		if (source) {
			var name, s, i;
			for (name in source) {
				// the "empty" conditional avoids copying properties in "source"
				// inherited from Object.prototype.  For example, if target has a custom
				// toString() method, don't overwrite it with the toString() method
				// that source inherited from Object.prototype
				s = source[name];
				if (empty[name] !== s) {
					target[name] = s;
				}
			}
		}
		return target;
	};
	
	//* Returns the index of the element in _inArray_ that is equivalent (==) to _inElement_, or -1 if no element is found.
	WP.Utils.indexOf = function(inElement, inArray) {
		for (var i=0, l=inArray.length, e; (e=inArray[i]) || (i<l); i++) {
			if (e == inElement) {
				return i;
			}
		}
		return -1;
	};
	
	//* Removes the first element in _inArray_ that is equivalent (==) to _inElement_.
	WP.Utils.remove = function(inElement, inArray) {
		var i = WP.Utils.indexOf.indexOf(inElement, inArray);
		if (i >= 0) {
			inArray.splice(i, 1);
		}
	};
	
	/**
		Invokes _inFunc_ on each element of _inArray_.
		Returns an array (map) of the return values from each invocation of _inFunc_.
		If _inContext_ is specified, _inFunc_ is called with _inContext_ as _this_.
	
		Aliased as _enyo.map_.
	*/
	WP.Utils.forEach = function(inArray, inFunc, inContext) {
		var result = [];
		if (inArray) {
			var context = inContext || this;
			for (var i=0, l=inArray.length, v; i<l; i++) {
				v = inFunc.call(context, inArray[i], i, inArray);
				if (v !== undefined) {
					result.push(v);
				}
			}
		}
		return result;
	};
	WP.Utils.map = WP.Utils.forEach;
	
	/**
		Clones an existing Array, or converts an array-like object into an Array.
	
		If _inOffset_ is non-zero, the cloning is started from that index in the source Array.
		The clone may be appended to an existing Array by passing the existing Array as _inStartWith_.
	
		Array-like objects have _length_ properties, and support square-bracket notation ([]).
		Often array-like objects do not support Array methods, such as _push_ or _concat_, and
		must be converted to Arrays before use.
		The special _arguments_ variable is an example of an array-like object.
	*/
	WP.Utils.cloneArray = function(inArrayLike, inOffset, inStartWith) {
		var arr = inStartWith || [];
		for(var i = inOffset || 0, l = inArrayLike.length; i<l; i++){
			arr.push(inArrayLike[i]);
		}
		return arr;
	};
	WP.Utils.toArray = WP.Utils.cloneArray;
	
	/**
		Shallow-clones an object or an array.
	*/
	WP.Utils.clone = function(obj) {
		return WP.Utils.isArray(obj) ? WP.Utils.cloneArray(obj) : WP.Utils.mixin({}, obj);
	};

})();


/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
};