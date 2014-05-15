var shapeType = null;

var elements = [];

$('#actions').find('.btn').on('click', function() {
	shapeType = $(this).siblings('.btn').removeClass('active').end().addClass('active').attr('id');
	if (shapeType == 'text') {
		$(canvas).on('click', function(e) {
			if (modifyText == true) {
				return;
			}
			if (!$('#temp-input').is(':visible')) {
				mouseX = e.clientX;
				mouseY = e.clientY;
				$('#temp-input').show().css({
					left: stage.mouseX,
					top: stage.mouseY
				}).focus();
			} else {
				if ($('#temp-input').val() != '') {
					var content = $('#temp-input').val();
					drawText(content, stageX, stageY);

					$('#temp-input').hide().val('');
				} else {
					$('#temp-input').hide();
				}
			}
		});
	} else {
		$(canvas).off('click');
	}
});

$('#insert-pic').on('click', function() {
	var image = new Image();
	image.src = "assets/tick-off.png";
	image.width = "100px";
	image.height = '200px;'
	image.crossOrigin = "Anonymous";
	image.onload = insert;

	function insert() {
		var bitmap = new createjs.Bitmap(image);
		bitmap.x = 100;
		bitmap.y = 100;
		bitmap.regX = 50;
		bitmap.regY = 50;
		bitmap.scaleX = 0.5;
		bitmap.scaleY = 0.5;
		bitmap.cursor = 'move';
		bitmap.addEventListener('mousedown', smouseDown);
		bitmap.addEventListener('pressmove', pressMove);
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			bitmap.shadow = null;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}

});

$('#insert-svg').on('click', function() {
	var image = new Image();
	image.src = "assets/check.svg";
	image.width = "100px";
	image.height = '200px;'
	image.crossOrigin = "Anonymous";
	image.onload = insert;

	function insert() {
		var bitmap = new createjs.Bitmap(image);
		bitmap.x = 100;
		bitmap.y = 100;
		/*bitmap.regX = 50;
	bitmap.regY = 50;*/
		bitmap.cursor = 'move';
		bitmap.addEventListener('mousedown', smouseDown);
		bitmap.addEventListener('pressmove', pressMove);
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			bitmap.shadow = null;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}

});

/*$('#blur').on('click', function() {
	var image = new Image();
	image.src = "assets/test.png";
	image.crossOrigin = "Anonymous";
	image.onload = insert;

	function insert() {
		var bitmap = new createjs.Bitmap(image);
		var blurFilter = new createjs.BlurFilter(6, 6, 1);
		bitmap.filters = [blurFilter];

		//bitmap.scaleX = 0.5;
		//bitmap.scaleY = 0.5;
		bitmap.cursor = 'move';
		//var bounds = blurFilter.getBounds();
		//console.log(bounds);
		var shape = new createjs.Shape();
		shape.graphics.drawRect(100, 100, 100, 100);
		bitmap.sourceRect = new createjs.Rectangle(100, 100, 100, 100);
		bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		bitmap.x = 100;
		bitmap.y = 100;
		bitmap.cache(0, 0, 100, 100);
		bitmap.addEventListener('mousedown', smouseDown);
		bitmap.addEventListener('pressmove', function(e) {
			if (creating) {
				return;
			}
			var z = e.target;
			z.x = e.stageX + z.offset.x;
			z.y = e.stageY + z.offset.y;
			z.sourceRect = new createjs.Rectangle(z.x, z.y, 100, 100);
			z.cache(0,0,100,100);
			stage.update();
		});
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}
});*/

$('#switcher').find('.btn').on('click', function() {
	$(this).siblings('.btn').removeClass('active').end().addClass('active');

});

var canvas = document.querySelector('#test');
var stage = new createjs.Stage("test");
stage.enableMouseOver(10);
var creating = false;
var hoverShape = false;
var modifyText = false;
var mouseX = 0;
var mouseY = 0;
var stageX = 0;
var stageY = 0;


var image = new Image();
image.src = "assets/test.png";
image.crossOrigin = "Anonymous";
image.onload = function() {
	var bitmap = new createjs.Bitmap(image);
	stage.addChild(bitmap);
	stage.update();

};

stage.addEventListener('stagemousedown', mouseDown, false);

document.querySelector('#off').addEventListener('click', function() {
	console.log('off');
	stage.off('stagemousedown', mouseDown, false);
});

document.querySelector('#on').addEventListener('click', function() {
	console.log('on');
	stage.addEventListener('stagemousedown', mouseDown, false);
});



//stage.addEventListener('click', onStageClick, false);

function onStageClick(e) {
	console.log(e, stage);
	if (shapeType == 'text') {
		$('#temp-input').show().css({
			left: stage.mouseX,
			top: stage.mouseY
		});
	}
}


function drawText(content, x, y) {
	var text = new createjs.Text(content, "20px Arial", "#ff7700");
	text.x = stageX;
	text.y = stageY;
	text.addEventListener('mousedown', smouseDown);
	text.addEventListener('pressmove', pressMove);
	var hitArea = new createjs.Shape();
	hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, text.getMeasuredWidth(), text.getMeasuredHeight());
	text.hitArea = hitArea;
	text.cursor = 'move';
	text.addEventListener('mouseover', function(e) {
		console.log('mouseover', e);
		hoverShape = true;
		//canvas.classList.remove('normal');
		//document.body.style.cursor = 'move';
		text.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		stage.update();
	}, false);

	text.addEventListener('mouseout', function() {
		console.log('mouseout');
		hoverShape = false;
		//canvas.classList.add('normal');
		//document.body.style.cursor = 'auto';
		text.shadow = null;
		stage.update();
	}, false);

	text.addEventListener('dblclick', function(e) {
		var contnet = text.text;
		modifyText = true;
		console.log(text);
		$('#temp-input').val(contnet).show().css({
			left: e.stageX,
			top: e.stageY
		})
			.focus()
			.on('blur', function() {
				text.text = $(this).val();
				hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, text.getMeasuredWidth(), text.getMeasuredHeight());
				modifyText = false;
				$(this).val('').off('blur');
				stage.update();
			});
	}, false);
	stage.addChild(text);
	stage.update();
}

$('#on').trigger('click');
$('#blur').trigger('click');


function mouseDown(e) {
	console.log('stagemousedown');
	if (shapeType == 'text') {
		if (!$('#temp-input').is(':visible')) {
			stageX = e.stageX;
			stageY = e.stageY;
			return;
		}
	}

	if (hoverShape) {
		return;
	};

	var originalX = _oX = e.stageX;
	var originalY = _oY = e.stageY;

	if (shapeType == 'blur') {
		creating = true;
		var image = new Image();
	image.src = "assets/test.png";
	image.crossOrigin = "Anonymous";

	image.onload = insert;

	var bitmap = new createjs.Bitmap(image);

	function insert() {
		
		var blurFilter = new createjs.BlurFilter(7, 7, 1);
		bitmap.filters = [blurFilter];
		bitmap.cursor = 'move';


		/*bitmap.sourceRect = new createjs.Rectangle(ori, 100, 100, 100);
		bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		bitmap.x = 100;
		bitmap.y = 100;
		bitmap.cache(0, 0, 100, 100);*/
		bitmap.x = originalX;
		bitmap.y = originalY;
		bitmap.cache(0, 0, 0, 0);
		bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		bitmap.addEventListener('mousedown', smouseDown);
		bitmap.addEventListener('pressmove', function(e) {
			if (creating) {
				return;
			}
			var z = e.target;
			z.x = e.stageX + z.offset.x;
			z.y = e.stageY + z.offset.y;
			z.sourceRect = new createjs.Rectangle(z.x, z.y, z.width, z.height);
			z.cache(0,0,z.width,z.height);
			stage.update();
		});
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			bitmap.shadow = null;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}

	} else {

	var shape = new createjs.Shape();
	//shape.graphics.beginStroke("#000").setStrokeStyle(8,"round").drawEllipse(e.stageX, e.stageY, 0, 0);
	creating = true;
	shape.addEventListener('mousedown', smouseDown);
	shape.addEventListener('pressmove', pressMove);
	stage.addChild(shape);
	shape.cursor = 'move';
	shape._points = [];

	var hitArea = new createjs.Shape();
	//hitArea.graphics.beginFill("#FFF").drawEllipse(e.stageX, e.stageY, 1, 1);

	shape.addEventListener('mouseover', function(e) {
		if (creating) {
			return;
		}
		console.log('mouseover', e);
		hoverShape = true;
		shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		stage.update();
	}, false);

	shape.addEventListener('mouseout', function() {
		console.log('mouseout');
		hoverShape = false;
		shape.shadow = null;
		stage.update();
	}, false);

	shape.hitArea = hitArea;
}



	stage.addEventListener('stagemousemove', smouseMove, false);

	function smouseMove(e) {
		switch (shapeType) {
			case 'rect':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'r-rect':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawRoundRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY, 10);
				break;
			case 'ellipse':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawEllipse(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'circle':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawCircle(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'line':
				shape.graphics.clear().setStrokeStyle(8, "round").beginStroke("#000").moveTo(originalX, originalY).lineTo(e.stageX, e.stageY);
				break;
			case 'arrow':
				var angle = Math.atan2(e.stageY - originalY, e.stageX - originalX) * 180 / Math.PI;
				console.log(e.stageY, _oY, e.stageX, _oX, angle);
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000").lineTo(originalX, originalY).lineTo(e.stageX, e.stageY).setStrokeStyle(8).beginStroke("#000").beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 1.5, 3, 0.5, angle);
				break;
			case 'free-arrow':
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000");
				//shape.graphics/*.moveTo(_oX, _oY)*/.lineTo(e.stageX, e.stageY);
				shape._points.push({
					x: e.stageX,
					y: e.stageY
				});
				var angle = Math.atan2(e.stageY - _oY, e.stageX - _oX) * 180 / Math.PI;

				setTimeout(function() {
					_oX = e.stageX;
					_oY = e.stageY;
				}, 100)

				for (var i = 0; i < shape._points.length; i++) {
					var p = shape._points[i];

					shape.graphics.lineTo(p.x, p.y);
				}

				shape.graphics.endStroke().setStrokeStyle(8).beginStroke('#000').beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 2.5, 3, 0.5, angle);
				break;
			case 'free-line':
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000");
				//shape.graphics/*.moveTo(_oX, _oY)*/.lineTo(e.stageX, e.stageY);
				shape._points.push({
					x: e.stageX,
					y: e.stageY
				});
				_oX = e.stageX;
				_oY = e.stageY

				for (var i = 0; i < shape._points.length; i++) {
					var p = shape._points[i];

					shape.graphics.lineTo(p.x, p.y);
				}
				break;
			case 'blur':
				bitmap.sourceRect = new createjs.Rectangle(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				bitmap.cache(0, 0, e.stageX - originalX, e.stageY - originalY);
				bitmap.width = e.stageX - originalX;
				bitmap.height = e.stageY - originalY;
				stage.update();
				break;
		}

		if (shapeType != 'free-line' && shapeType != 'free-arrow') {
			if (shapeType == 'blur'){return;}
			shape.setBounds(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
			shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
		} else {

			var max = {
				x: 0,
				y: 0
			};

			var min = {
				x: 99999,
				y: 99999
			};

			for (var i = 0, n = shape._points.length; i < n; i++) {
				var p = shape._points[i];
				if (p.x > max.x) {
					max.x = p.x;
				}
				if (p.y > max.y) {
					max.y = p.y;
				}
				if (p.x < min.x) {
					min.x = p.x;
				}
				if (p.y < min.y) {
					min.y = p.y;
				}
			}


			shape.setBounds(min.x, min.y, max.x - min.x, max.y - min.y);
			shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(min.x, min.y, max.x - min.x, max.y - min.y);
		}

		stage.update();
	}

	stage.addEventListener('stagemouseup', function(e) {
		console.log("stagemouseup");
		if (stage.mouseInBounds) {

			creating = false;
			stage.off('stagemousemove', smouseMove, false);
			if (bitmap) {
				bitmap.shadow = null;
			}
			
		}

	}, false);
	stage.update();
}

function smouseDown(e) {
	var z = e.target;
	var offsetX = z.x - e.stageX;
	var offsetY = z.y - e.stageY;
	z.offset = {
		x: offsetX,
		y: offsetY
	};
}

function pressMove(e) {
	if (creating) {
		return;
	}
	//console.log('pressmove');
	var z = e.target;
	z.x = e.stageX + z.offset.x;
	z.y = e.stageY + z.offset.y;
	stage.update();
}