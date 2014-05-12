var shapeType = null;

var elements = [];

$('#actions').find('.btn').on('click', function() {
	shapeType = $(this).siblings('.btn').removeClass('active').end().addClass('active').attr('id');
});

$('#switcher').find('.btn').on('click', function() {
	$(this).siblings('.btn').removeClass('active').end().addClass('active');
});

var canvas = document.querySelector('#test');
var stage = new createjs.Stage("test");
stage.enableMouseOver(10);
var creating = false;
var hoverShape = false;
var mouseX = 0;
var mouseY = 0;
var stageX = 0;
var stageY = 0;
stage.addEventListener('stagemousedown', mouseDown, false);

document.querySelector('#off').addEventListener('click', function() {
	console.log('off');
	stage.off('stagemousedown', mouseDown, false);
});

document.querySelector('#on').addEventListener('click', function() {
	console.log('on');
	stage.addEventListener('stagemousedown', mouseDown, false);
});

/*$(document).on('click', function(e) {
	if (e.target.id != 'temp-input' && e.target.id == 'test') {
		mouseX = e.clientX;
		mouseY = e.clientY;
		if (!$('#temp-input').is(':visible')) {
			$('#temp-input').show().css({
				left: mouseX,
				top: mouseY
			});
		}

	}



});*/

$(canvas).on('click', function(e) {
	if (!$('#temp-input').is(':visible')) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		$('#temp-input').show().css({
			left: mouseX,
			top: mouseY
		});
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

stage.addEventListener('click', onStageClick, false);

function onStageClick(e) {
	console.log(e, stage);
	if (shapeType == 'text') {
		$('#temp-input').show().css({
			left: stage.mouseX,
			top: stage.mouseY
		});
	}
}

/*$('#temp-input').on('blur', function() {
	console.log('dfd', $(this).val());
	if ($(this).val() != '') {
		var content = $(this).val();
		drawText(content, stageX, stageY);

		$(this).hide().val('');
	}
});*/

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

	text.addEventListener('dblclick', function () {
		var contnet = text.text = "hoverShape";
		//console.log(text.graphics, text)
		//text.graphics.clear();
		$('#temp-input').val(contnet).show().css({
			left: stage.mouseX,
			top: stage.mouseY
		});
	}, false);
	stage.addChild(text);
	stage.update();
}

$('#on').trigger('click');
$('#text').trigger('click');


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
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000").lineTo(originalX, originalY).lineTo(e.stageX, e.stageY).setStrokeStyle(8).beginStroke("#000").beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 1.5, 3, 0.5, angle);;
				break;
			case 'free-line':
				shape._points.push({x:e.stageX,y:e.stageY});
				shape.graphics/*.clear()*/.setStrokeStyle(8, "round", "round").beginStroke("#000");
					shape.graphics.lineTo().moveTo(_oX, _oY).lineTo(e.stageX,e.stageY);
					shape._points.push({x:e.stageX,y:e.stageY});
					_oX = e.stageX;
					_oY = e.stageY
				break;
			case 'text':

				break;
		}
		
		if (shapeType != 'free-line') {
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
		if (stage.mouseInBounds) {

			creating = false;
			stage.off('stagemousemove', smouseMove, false);
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