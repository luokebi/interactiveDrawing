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
stage.addEventListener('stagemousedown', mouseDown, false);

document.querySelector('#off').addEventListener('click', function() {
	console.log('off');
	stage.off('stagemousedown', mouseDown, false);
});

document.querySelector('#on').addEventListener('click', function() {
	console.log('on');
	stage.addEventListener('stagemousedown', mouseDown, false);
});

$('#on').trigger('click');
$('#rect').trigger('click');


function mouseDown(e) {
	console.log('stagemousedown');
	if (hoverShape) {
		return;
	};
	var originalX = _oX = e.stageX;
	var originalY = _oY = e.stageY;


	if (shapeType == 'free-line') {
		var container = new createjs.Container();
		container.addEventListener('mousedown', smouseDown);
		container.addEventListener('pressmove', pressMove);
		stage.addChild(container);
		container._children = [];
		container.cursor = 'move';

		var hitArea = new createjs.Shape();
		//hitArea.graphics.beginFill("#FFF").drawEllipse(e.stageX, e.stageY, 1, 1);

		container.addEventListener('mouseover', function() {
			console.log('mouseover');
			hoverShape = true;
			//canvas.classList.remove('normal');
			//document.body.style.cursor = 'move';
			container.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			stage.update();
		}, false);

		container.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			//canvas.classList.add('normal');
			//document.body.style.cursor = 'auto';
			container.shadow = null;
			stage.update();
		}, false);

		container.hitArea = hitArea;
	} else {
		var shape = new createjs.Shape();
		//shape.graphics.beginStroke("#000").setStrokeStyle(8,"round").drawEllipse(e.stageX, e.stageY, 0, 0);
		creating = true;
		shape.addEventListener('mousedown', smouseDown);
		shape.addEventListener('pressmove', pressMove);
		stage.addChild(shape);
		shape.cursor = 'move';

		/*if (shapeType == 'line') {
		shape.graphics.moveTo(originalX, originalY);
	}
*/
		var hitArea = new createjs.Shape();
		//hitArea.graphics.beginFill("#FFF").drawEllipse(e.stageX, e.stageY, 1, 1);

		shape.addEventListener('mouseover', function() {
			console.log('mouseover');
			hoverShape = true;
			//canvas.classList.remove('normal');
			//document.body.style.cursor = 'move';
			shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			stage.update();
		}, false);

		shape.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			//canvas.classList.add('normal');
			//document.body.style.cursor = 'auto';
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
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000").lineTo(originalX, originalY).lineTo(e.stageX, e.stageY).setStrokeStyle(8).beginStroke("#000").beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 1.5, 3, 0.5, angle);;
				break;
			case 'free-line':
				var s = new createjs.Shape();
				s.graphics.setStrokeStyle(8, "round", "round").beginStroke("#000").moveTo(originalX, originalY).lineTo(e.stageX, e.stageY);
				originalX = e.stageX;
				originalY = e.stageY;
				container.addChild(s);
				container._children.push({
					x: e.stageX,
					y: e.stageY
				});
				break;
		}
		//shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8,"round").drawEllipse(originalX, originalY, e.stageX-originalX,e.stageY-originalY);
		if (shapeType != 'free-line') {
			shape.setBounds(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
			shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
		}

		stage.update();
	}

	stage.addEventListener('stagemouseup', function(e) {
		if (stage.mouseInBounds) {

			creating = false;
			stage.off('stagemousemove', smouseMove, false);
			if (container) {
				var max = {
					x: 0,
					y: 0
				};

				var min = {
					x: 99999,
					y: 99999
				};

				for (var i = 0, n = container._children.length; i < n; i++) {
					var p = container._children[i];
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

				console.log(max, min);

				container.setBounds(min.x, min.y, max.x - min.x, max.y - min.y);
				container.hitArea.graphics.clear().beginFill("#FFF").drawRect(min.x, min.y, max.x - min.x, max.y - min.y);
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