;(function(PB) {
	var Utils = {};
	function extend(Child, Parent) {
		var F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.uber = Parent.prototype;
	}

	function cloneObj(obj) {
		var newObj = {};
		for (var i in obj) {
			newObj[i] = obj[i];
		}

		return newObj;
	}

	function cloneArray(arr) {
		var newArr = [];
		for (var i = 0, n = arr.length; i < n; i++) {
			newArr.push(arr[i]);
		}

		return newArr;
	}

	function getOffset(elem) {
		var offset = null;
		if (elem) {
			offset = {
				left: 0,
				top: 0
			};
			do {
				offset.top += elem.offsetTop;
				offset.left += elem.offsetLeft;
				elem = elem.offsetParent;
			} while (elem);
		}
		return offset;
	}

	function autoExpand(textarea) {
		if (textarea.addEventListener) {
			textarea.addEventListener('input', function() {
				fixTextarea(textarea);
			}, false);
		} else if (textarea.attachEvent) {
			// IE8 compatibility
			textarea.attachEvent('onpropertychange', function() {
				fixTextarea(textarea);
			});
		}
	}

	function fixTextarea(textarea) {
		var k = 1,
			lt = 'mmm'
		var text = textarea.value;
		var m = text.split("\n");
		var k = m.length + 1;

		for (var i = 0, n = m.length; i < n; i++) {
			if (m[i].length > lt.length) {
				lt = m[i];
			}
		}

		var w = getWidth(lt, textarea.style.fontSize, textarea.style.fontFamily);
		textarea.style.width = w + 'px';
		textarea.style.height = k * parseInt(textarea.style.lineHeight) + "px";
	}

	function getWidth(text, fontSize, fontFamily) {
		text += "m";
		var temp_text = new createjs.Text(text, fontSize + ' ' + fontFamily);
		var w = temp_text.getMeasuredWidth();
		temp_text = null;
		return w;
	}

	Utils.extend = extend;
	Utils.cloneObj = cloneObj;
	Utils.cloneArray = cloneArray;
	Utils.autoExpand = autoExpand;
	Utils.fixTextarea = fixTextarea;
	Utils.getOffset = getOffset;

	PB.Utils = Utils;
})(paintBoard);