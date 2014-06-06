(function() {
	var paintBoard = PB = {};
	window.paintBoard = paintBoard;
})();

(function(createjs, PB) {
	function Board(canvas) {
		var config = {
			strokeColor: '#f00',
			fontSize: '24px',
			fontFamily: 'Arial',
			alpha: 1,
			strokeSize: 8
		};
		var shapeType = 'rect',
			creating = false,
			hoverShape = false,
			modifyText = false,
			selectedShape = null,
			temp_input = document.createElement('textarea'),
			mouseX = 0,
			mouseY = 0,
			stageX = 0,
			stageY = 0,
			board = this;


		var stage = new createjs.Stage(canvas);

		function init() {
			stage.enableMouseOver(10);
			stage.on('stagemousedown', function(e) {
				console.info('stage mousedown', hoverShape);
				if (!shapeType) {
					return;
				} else if (hoverShape) {
					return;
				}


				var originalX = e.stageX,
					originalY = e.stageY;
				var s = new PB.Rect(config);
				stage.addChild(s.shape);

				var o = stage.getObjectUnderPoint(e.stageX, e.stageY);
				if (o === null) {
					creating = true;
					if (selectedShape) {
						board.unSelect();
					}

					stage.addEventListener('stagemousemove', mousemove, false);
					stage.addEventListener('stagemouseup', mouseup, false);
				}

				// bind event to shapes

				if (s) {
					var sp = s.shape;
					sp.addEventListener('mouseover', function() {
						console.info('shape mouseover');
						if (creating) {
							return;
						}
						sp.shadow = new createjs.Shadow(s.strokeColor, 0, 0, 10);
						sp.getStage().update();
					}, false);

					sp.addEventListener('mouseout', function() {
						if (!s.selected) {
							sp.shadow = null;
							sp.getStage().update();
						}
					}, false);

					sp.addEventListener('mousedown', function(e) {
						if (creating) {
							return;
						}
						s.bringToTop();
						s.backup = {
							bounds: PB.Utils.cloneObj(s.bounds),
							x: s.shape.x,
							y: s.shape.y,
							strokeColor: s.strokeColor,
							strokeSize: s.strokeSize,
							cx: s.calloutPointX,
							cy: s.calloutPointY
						};

						s._startX = e.stageX;
						s._startY = e.stageY;

						var offsetX = s.x - e.stageX;
						var offsetY = s.y - e.stageY;
						s.offset = {
							x: offsetX,
							y: offsetY
						};

						if (selectedShape && selectedShape.shape.id != sp.id) {
							board.unSelect();
						}
						s.select();
						selectedShape = s;
					}, false);

					sp.addEventListener('pressmove', function(e) {
						if (creating) {
							return;
						}
						var moveX = e.stageX - s._startX;
						var moveY = e.stageY - s._startY;

						var prev_bounds = s.backup.bounds;
						s.setBounds(prev_bounds.x + moveX, prev_bounds.y + moveY, prev_bounds.width, prev_bounds.height);
						if (s.calloutPointX) {
							s.calloutPointX = s.backup.cx + moveX;
							s.calloutPointY = s.backup.cy + moveY;
						}
						s.rePaint();
						s.drawHandlers();
						sp.getStage().update();
					}, false);
				}


				function mousemove(e) {
					if (s.shape.baseType == 'BoundShape') {
						s.bounds.width = Math.abs(e.stageX - originalX);
						s.bounds.height = Math.abs(e.stageY - originalY);
						s.bounds.x = Math.min(originalX, e.stageX);
						s.bounds.y = Math.min(originalY, e.stageY);
						if (s.subType == 'callout') {
							s.calloutPointX = s.bounds.x + 10;
							s.calloutPointY = s.bounds.y + s.bounds.height + 20;
						}
					} else if (s.shape.baseType == 'line') {
						s.endX = e.stageX;
						s.endY = e.stageY;
					} else if (s.shape.baseType == 'free') {
						s.points.push({
							x: e.stageX,
							y: e.stageY
						});
						var angle = Math.atan2(e.stageY - s._oY, e.stageX - s._oX) * 180 / Math.PI;

						setTimeout(function() {
							s._oX = e.stageX;
							s._oY = e.stageY;
						}, 100);

						s.endX = e.stageX;
						s.endY = e.stageY;
					}

					s.rePaint(angle);

					stage.update();
				}

				function mouseup(e) {
					console.info('stage mouseup', stage.mouseInBounds);
					if (stage.mouseInBounds) {
						if (e.stageX == originalX && e.stageY == originalY) {
							stage.removeChild(s);
						}
						creating = false;
						stage.off('stagemousemove', mousemove, false);
					}
				}
			}, false);
		}

		this.canvas = document.getElementById(canvas);
		this.stage = stage;


		Board.prototype.unSelect = function() {
			var s = selectedShape,
				stage = s.shape.getStage();

			if (s.handlers) {
				for (var i in s.handlers) {
					stage.removeChild(s.handlers[i]);
				}
			}

			s.shape.shadow = null;
			s.selected = false;
			stage.update();
			selectedShape = null;
		};

		init();
	}

	PB.Board = Board;
})(createjs, paintBoard || {});