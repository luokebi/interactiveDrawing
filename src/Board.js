;
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
			scaleLevel = 1;
		mouseX = 0,
		mouseY = 0,
		stageX = 0,
		stageY = 0,
		selectImage = null,
		board = this;


		var stage = new createjs.Stage(canvas);

		function init() {
			insertInput();
			stage.enableMouseOver(10);
			stage.on('stagemousedown', function(e) {
				//console.info('stage mousedown', hoverShape);
				if (!shapeType) {
					return;
				}

				var o = stage.getObjectUnderPoint(e.stageX, e.stageY);

				var originalX = e.stageX,
					originalY = e.stageY;
				console.log(originalX, originalY);

				switch (shapeType) {
					case 'rect':
						var s = new PB.Rect(config);
						break;
					case 'line':
						var s = new PB.Line(config);
						break;
					case 'd-line':
						var s = new PB.DashedLine(config);
						break;
					case 'r-rect':
						var s = new PB.RoundRect(config);
						break;
					case 'd-rect':
						var s = new PB.DashedRect(config);
						break;
					case 'arrow':
						var s = new PB.Arrow(config);
						break;
					case 'd-arrow':
						var s = new PB.DashedArrow(config);
						break;
					case 'db-arrow':
						var s = new PB.DoubleArrow(config);
						break;
					case 'dbd-arrow':
						var s = new PB.DoubleDashedArrow(config);
						break;
					case 'ellipse':
						var s = new PB.Ellipse(config);
						break;
					case 'free-line':
						var s = new PB.FreeLine(config);
						break;
					case 'free-arrow':
						var s = new PB.FreeArrow(config);
						break;
					case 'text':
						showInput(e.nativeEvent.pageX, e.nativeEvent.pageY, e.stageX, e.stageY);
						creating = false;
						break;
					case 'pic':
						if (o === null) {
							if (selectedShape) {
								board.unSelect();
								return;
							}
							var image = new Image();
							image.src = insetImageSrc; /*"assets/tick-off.png"*/
							image.crossOrigin = "Anonymous";
							image.onload = onloadHandler;

							function onloadHandler() {
								var s = new PB.Pic(config, image, e.stageX, e.stageY);
								bindEventforShape(s);
								stage.addChild(s.shape);
								s.select();
								selectedShape = s;
								stage.update();
							}
						}

						break;
					case 'blur':
						var s = new PB.Blur(config);
						break;

				}
				console.log(s, o);

				if (o === null && shapeType !== 'pic') {
					creating = true;
					if (selectedShape) {
						board.unSelect();
					}

					stage.addEventListener('stagemousemove', mousemove, false);
					stage.addEventListener('stagemouseup', mouseup, false);
				}

				// bind event to shapes

				function bindEventforShape(s) {
					stage.addChild(s.shape);
					var sp = s.shape;
					if (s.subType !== 'pic' && s.subType !== 'blur') {
						sp.addEventListener('mouseover', function() {
							//console.info('shape mouseover');
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
					}

					sp.addEventListener('mousedown', function(e) {
						if (creating) {
							return;
						}
						s.bringToTop();
						s.backup = {
							bounds: PB.Utils.cloneObj(s.bounds),
							points: s.points ? PB.Utils.cloneArray(s.points) : [],
							x: s.shape.x,
							y: s.shape.y,
							startX: s.startX,
							startY: s.startY,
							endX: s.endX,
							endY: s.endY,
							strokeColor: s.strokeColor,
							strokeSize: s.strokeSize,
							cx: s.calloutPointX,
							cy: s.calloutPointY
						};

						s._startX = e.stageX;
						s._startY = e.stageY;

						var offsetX = sp.x - e.stageX;
						var offsetY = sp.y - e.stageY;
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

						if (s.baseType === 'BoundShape') {
							var prev_bounds = s.backup.bounds;
							s.setBounds(prev_bounds.x + moveX, prev_bounds.y + moveY, prev_bounds.width, prev_bounds.height);
							if (s.calloutPointX) {
								s.calloutPointX = s.backup.cx + moveX;
								s.calloutPointY = s.backup.cy + moveY;
							}
						} else if (s.baseType === 'LineShape') {
							s.startX = s.backup.startX + moveX;
							s.startY = s.backup.startY + moveY;
							s.endX = s.backup.endX + moveX;
							s.endY = s.backup.endY + moveY;
						} else if (s.baseType === 'FreeShape') {
							s.shape.x = e.stageX + s.offset.x;
							s.shape.y = e.stageY + s.offset.y;
						}


						s.rePaint();
						if (s.baseType !== "FreeShape") {
							s.drawHandlers();
						}

						sp.getStage().update();
					}, false);
				}

				if (s) {
					bindEventforShape(s);
				}

				function mousemove(e) {
					if (!s) {
						return;
					}
					if (s.baseType == 'BoundShape') {
						s.bounds.width = Math.abs(e.stageX - originalX);
						s.bounds.height = Math.abs(e.stageY - originalY);
						s.bounds.x = Math.min(originalX, e.stageX);
						s.bounds.y = Math.min(originalY, e.stageY);
						if (s.subType == 'callout') {
							s.calloutPointX = s.bounds.x + 10;
							s.calloutPointY = s.bounds.y + s.bounds.height + 20;
						}
					} else if (s.baseType == 'LineShape') {
						s.startX = originalX;
						s.startY = originalY;
						s.endX = e.stageX;
						s.endY = e.stageY;
					} else if (s.baseType == 'FreeShape') {
						s.points.push({
							x: e.stageX,
							y: e.stageY
						});

						if (!s._oX) {
							s._oX = originalX;
							s._oY = originalY;
						}

						setTimeout(function() {
							s._oX = e.stageX;
							s._oY = e.stageY;
						}, 100);

						s.endX = e.stageX;
						s.endY = e.stageY;
					}

					s.rePaint();

					stage.update();
				}

				function mouseup(e) {
					//console.info('stage mouseup', stage.mouseInBounds);
					if (stage.mouseInBounds) {
						if (e.stageX == originalX && e.stageY == originalY && s) {
							stage.removeChild(s.shape);
						}
						creating = false;
						stage.off('stagemousemove', mousemove, false);
					}
				}
			}, false);

			function insertInput() {
				temp_input.id = 'temp_input';
				temp_input.style.position = 'absolute';
				temp_input.style.display = 'none';
				temp_input.style.border = '1px dashed #f00';
				temp_input.style.outline = 'none';
				temp_input.style.padding = 0;
				temp_input.style.resize = 'none';
				temp_input.style.backgroundColor = 'transparent';
				temp_input.style.overflow = 'hidden';
				temp_input.style.color = config.strokeColor;
				temp_input.style.fontSize = config.fontSize;
				temp_input.style.fontFamily = config.fontFamily;
				temp_input.style.lineHeight = config.fontSize;
				document.body.appendChild(temp_input);
				PB.Utils.autoExpand(temp_input);

				temp_input.addEventListener('blur', function(e) {
					var x = this.getAttribute('data-stage-x'),
						y = this.getAttribute('data-stage-y'),
						isEdit = this.getAttribute('data-edit') == 'true' ? true : false;

					console.info(x, y, isEdit);

					if (this.value != '') {
						var content = temp_input.value,
							w = parseInt(temp_input.style.width),
							h = parseInt(temp_input.style.height);

						if (isEdit) {
							console.log(textOnEdit);
							textOnEdit.content = content;
							textOnEdit.bounds.width = w;
							textOnEdit.bounds.height = h;
							textOnEdit.rePaint();
						} else {
							var text = new PB.Text(config, content, x, y);
							console.log(text);
							text.bounds.width = w;
							text.bounds.height = h;
							text.rePaint();
							stage.addChild(text.shape);
							var sp = text.shape;
							var s = text;


							// bind event for text
							sp.addEventListener('mouseover', function() {
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
									strokeColor: s.strokeColor,
									font: s.font,
									content: s.content,
									bouds: PB.Utils.cloneObj(s.bouds)
								};

								s._startX = e.stageX;
								s._startY = e.stageY;

								var offsetX = sp.x - e.stageX;
								var offsetY = sp.y - e.stageY;
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

								s.shape.x = e.stageX + s.offset.x;
								s.shape.y = e.stageY + s.offset.y;

								sp.getStage().update();
							});

							sp.addEventListener('dblclick', function(e) {
								textOnEdit = s;
								var offset = PB.Utils.getOffset(board.canvas);
								temp_input.style.top = parseFloat(sp.y) + offset.top + 'px';
								temp_input.style.left = parseFloat(sp.x) + offset.left + 'px';
								temp_input.value = sp.text;
								temp_input.setAttribute('data-edit', "true");
								temp_input.style.color = s.strokeColor;
								temp_input.style.fontSize = s.fontSize;
								temp_input.style.borderColor = s.strokeColor;
								temp_input.style.fontFamily = s.fontFamily;
								temp_input.style.lineHeight = s.fontSize;
								temp_input.style.display = 'block';
								PB.Utils.fixTextarea(temp_input);
								sp.text = '';
								sp.getStage().update();
								setTimeout(function() {
									temp_input.focus();
								}, 0);
							}, false);


						}
						stage.update();

					}

					temp_input.value = '';
					temp_input.style.display = 'none';
					temp_input.setAttribute('data-edit', 'false');
				}, false);
			}

			function showInput(px, py, sx, sy) {
				var o = stage.getObjectUnderPoint(sx, sy);
				if (o !== null) {
					return;
				}

				stageX = sx;
				stageY = sy;

				temp_input.style.left = px + 'px';
				temp_input.style.top = py + 'px';
				temp_input.style.borderColor = config.strokeColor;
				temp_input.style.color = config.strokeColor;
				if (temp_input.style.display == 'none') {
					temp_input.setAttribute('data-stage-x', sx);
					temp_input.setAttribute('data-stage-y', sy);
				}
				temp_input.style.display = 'block';
				PB.Utils.fixTextarea(temp_input);

				setTimeout(function() {
					temp_input.focus();
				}, 10);
			}
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

		Board.prototype.setAlpha = function(al) {
			if (selectedShape) {
				selectedShape.alpha = al;
				selectedShape.rePaint();
				this.stage.update();
			}
			alpha = al;
			return this;
		};

		Board.prototype.setShapeType = function(type) {
			shapeType = type;
			return this;
		};

		Board.prototype.getShapeType = function(type) {
			return shapeType;
		};

		Board.prototype.setStokeColor = function(color) {
			if (selectedShape) {
				selectedShape.strokeColor = color;
				selectedShape.rePaint();
				this.stage.update();
			}
			config.strokeColor = color;
			return this;
		};

		Board.prototype.setInsertImage = function(src) {
			insetImageSrc = src;
			return this;
		};

		Board.prototype.setStokeSize = function(size) {
			if (selectedShape) {
				selectedShape.strokeSize = size;
				selectedShape.rePaint();
				this.stage.update();
			}
			config.strokeSize = size;
			return this;
		};

		Board.prototype.setFontSize = function(size) {
			if (selectedShape) {
				selectedShape.fontSize = size;
				selectedShape.rePaint();
				this.stage.update();
			}
			config.fontSize = size;
			return this;
		};

		Board.prototype.setFontFamily = function(f) {
			if (selectedShape) {
				selectedShape.fontFamily = f;
				selectedShape.rePaint();
				this.stage.update();
			}
			config.fontFamily = f;
			return this;
		};

		Board.prototype.zoomIn = function() {
			if (scaleLevel < 1.75) {
				scaleLevel += 0.25;
				this.canvas.style.webkitTransform = "scale(" + scaleLevel + ")";
			}
			return this;
		};

		Board.prototype.zoomOut = function() {
			if (scaleLevel > 0.25) {
				scaleLevel -= 0.25;
				this.canvas.style.webkitTransform = "scale(" + scaleLevel + ")";
			}
			return this;
		};

		Board.prototype.setZoomLevel = function(level) {
			if (0 < scaleLevel < 2) {
				scaleLevel = level;
				this.canvas.style.webkitTransform = "scale(" + scaleLevel + ")";
			}
			return this;
		};

		Board.prototype.getZoomLevel = function() {
			return scaleLevel;
		};

		Board.prototype.toDataURL = function(mimeType) {
			return this.stage.toDataURL(null, mimeType);
		};

		init();
	}

	PB.Board = Board;
})(createjs, paintBoard || {});