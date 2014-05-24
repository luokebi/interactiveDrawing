;
(function() {
    function PaintBoard(canvas) {
        var pb = this;
        pb.canvas = document.getElementById(canvas);
        pb.stage = new createjs.Stage(canvas);
        pb.shapeType = 'rect';
        pb.strokeColor = '#f00';
        pb.textSize = '24px';
        pb.textFamily = "Arial";
        pb.strokeSize = 8;
        pb.creating = false;
        pb.hoverShape = false;
        pb.modifyText = false;
        pb.selectedShape = null;
        pb.mouseX = 0;
        pb.mouseY = 0;
        pb.stageX = 0;
        pb.stageY = 0;
        pb.insert = insert;

        init();

        function init() {
            pb.stage.enableMouseOver(10);
            pb.stage.on('stagemousedown', mouseDown, false);
            insertInput();
            document.addEventListener('mousedown', function() {

            });
        }

        function mouseDown(e) {
            console.info('stage mousedown');
            if (!pb.shapeType) {
                return;
            } else if (pb.hoverShape) {
                return;
            }

            if (pb.selectedShape) {
                pb.unSelect();
            }

            pb.creating = true;

            var originalX = e.stageX,
                originalY = e.stageY;

            switch (pb.shapeType) {
                case 'rect':
                    var s = new Rect(e.stageX, e.stageY);
                    break;
                case 'ellipse':
                    var s = new Ellipse(e.stageX, e.stageY);
                    break;
                case 'r-rect':
                    var s = new RoundRect(e.stageX, e.stageY);
                    break;
                case 'line':
                    var s = new Line(e.stageX, e.stageY);
                    break;
                case 'arrow':
                    var s = new Arrow(e.stageX, e.stageY);
                    break;
                case 'free-line':
                    var s = new FreeLine(e.stageX, e.stageY);
                    break;
                case 'free-arrow':
                    var s = new FreeArrow(e.stageX, e.stageY);
                    break;
                case 'text':
                    drawText(e.nativeEvent.pageX, e.nativeEvent.pageY, e.stageX, e.stageY);
                    pb.creating = false;
                    break;
            }

            if (!s) {
                return;
            }

            console.log(s);

            pb.stage.addChild(s.shape);

            pb.stage.addEventListener('stagemousemove', mousemove, false);
            pb.stage.addEventListener('stagemouseup', mouseup, false);

            function mousemove(e) {
                console.info('stagemousemove');
                if (s._type == 'shape') {
                    s.bounds.width = e.stageX - s.bounds.x;
                    s.bounds.height = e.stageY - s.bounds.y;
                } else if (s._type == 'line') {
                    s.endX = e.stageX;
                    s.endY = e.stageY;
                } else if (s._type == 'free') {
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



                pb.stage.update();
            }

            function mouseup(e) {
                if (pb.stage.mouseInBounds) {
                    if (e.stageX == originalX && e.stageY == originalY) {
                        pb.stage.removeChild(s);
                    }
                    pb.creating = false;

                    pb.stage.off('stagemousemove', mousemove, false);
                }
            }
        }

        function insertInput() {
            pb.temp_input = document.createElement('textarea');
            pb.temp_input.id = 'temp_input';
            pb.temp_input.style.position = 'absolute';
            pb.temp_input.style.display = 'none';
            document.body.appendChild(pb.temp_input);

            pb.temp_input.addEventListener('blur', function(e) {
                var x = this.getAttribute('data-stage-x'),
                    y = this.getAttribute('data-stage-y'),
                    isEdit = this.getAttribute('data-edit') == 'true' ? true : false;

                console.info(x, y, isEdit);

                if (this.value != '') {
                    var content = temp_input.value;
                    if (isEdit) {
                        pb.textOnEdit.text = content;
                        pb.textOnEdit.hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, pb.textOnEdit.getMeasuredWidth(), pb.textOnEdit.getMeasuredHeight());
                    } else {
                        var text = new Text(content, x, y);
                        pb.stage.addChild(text.shape);
                    }
                    pb.stage.update();

                }

                temp_input.value = '';
                temp_input.style.display = 'none';
                temp_input.setAttribute('data-edit', 'false');
            }, false);
        }

        function drawText(px, py, sx, sy) {
            if (pb.hoverShape) {
                return;
            }

            pb.stageX = sx;
            pb.stageY = sy;

            var temp_input = pb.temp_input;

            temp_input.style.left = px + 'px';
            temp_input.style.top = py + 'px';
            if (temp_input.style.display == 'none') {
                temp_input.setAttribute('data-stage-x', sx);
                temp_input.setAttribute('data-stage-y', sy);
            }
            temp_input.style.display = 'block';

            setTimeout(function() {
                temp_input.focus();
            }, 10);
        }

        function insert(src) {
            var image = new Image();
            image.src = src; /*"assets/tick-off.png"*/
            image.crossOrigin = "Anonymous";
            image.onload = onloadHandler;

            function onloadHandler() {
                var img = new ImageShape(image);

                pb.stage.addChild(img.shape);
                pb.stage.update();
            }
        }



        /** 
         * Utils
         =================================================*/


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

        function bringToTop() {
            var z = this,
                stage = z.shape.getStage(),
                index = stage.getChildIndex(z.shape),
                num = stage.getNumChildren();

            stage.addChildAt(z.shape, num);
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

        /** 
         * Shape, Line shape, Free shape, Text, Image shape
         =================================================*/

        // Shape
        function Shape(x, y) {
            this.bounds = {
                x: x,
                y: y,
                width: 0,
                height: 0
            };
            this.handlers = [];

            this._startX = 0;
            this._startY = 0;
            this.selected = false;
            this.strokeColor = pb.strokeColor;
            this.strokeSize = pb.strokeSize;
            this.textSize = pb.textSize;
            this.shape = new createjs.Shape();
            this._type = 'shape';

            this.init();
        }

        Shape.prototype.init = function() {
            var z = this,
                s = z.shape;

            s.cursor = 'move';
            s.hitArea = new createjs.Shape();

            s.addEventListener('mouseover', function() {
                console.info('shape mouseover');
                pb.hoverShape = true;
                s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                if (!z.selected) {
                    s.shadow = null;
                    s.getStage().update();
                }
                pb.hoverShape = false;

            }, false);

            s.addEventListener('mousedown', function(e) {
                z.bringToTop();
                z.backup = {
                    bounds: cloneObj(z.bounds),
                    x: z.shape.x,
                    y: z.shape.y,
                    strokeColor: z.strokeColor,
                    strokeSize: z.strokeSize
                };

                z._startX = e.stageX;
                z._startY = e.stageY;

                var offsetX = s.x - e.stageX;
                var offsetY = s.y - e.stageY;
                z.offset = {
                    x: offsetX,
                    y: offsetY
                };

                z.select();
                pb.lastShape = z;
            }, false);

            s.addEventListener('pressmove', function(e) {
                if (pb.creating) {
                    return;
                }

                var moveX = e.stageX - z._startX;
                var moveY = e.stageY - z._startY;

                var prev_bounds = z.backup.bounds;
                z.setBounds(prev_bounds.x + moveX, prev_bounds.y + moveY, prev_bounds.width, prev_bounds.height);
                z.rePaint();
                z.drawHandlers();
                s.getStage().update();
            });
        };

        Shape.prototype.setBounds = function(x, y, w, h) {
            this.bounds = {
                x: x,
                y: y,
                width: w,
                height: h
            };
        };

        Shape.prototype.select = function() {
            if (pb.selectedShape) {
                pb.unSelect();
            }
            this.drawHandlers();
            pb.selectedShape = this;
            this.selected = true;
            this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
        };

        Shape.prototype.bringToTop = function() {
            bringToTop.call(this);
        };

        Shape.prototype.drawHandlers = function() {
            var z = this,
                bounds = cloneObj(z.bounds),
                x = bounds.x,
                y = bounds.y,
                w = bounds.width,
                h = bounds.height,
                handlers = [{
                    name: 'lt',
                    cursor: 'nwse-resize',
                    x: x,
                    y: y
                }, {
                    name: 'rt',
                    cursor: 'nesw-resize',
                    x: x + w,
                    y: y
                }, {
                    name: 'lb',
                    cursor: 'nesw-resize',
                    x: x,
                    y: y + h
                }, {
                    name: 'rb',
                    cursor: 'nwse-resize',
                    x: x + w,
                    y: y + h
                }];

            for (var i = 0, n = handlers.length; i < n; i++) {
                (function(i) {
                    var h = handlers[i];

                    var r = z.handlers[h.name];
                    if (!r) {
                        var r = new createjs.Shape();
                        r._type = 'handler';
                        r.name = h.name;
                        r.cursor = h.cursor;
                        z.handlers[h.name] = r;

                        r.on('pressmove', function(e) {
                            var bounds = cloneObj(z.bounds);
                            var rx, ry, rw, rh;
                            if (r.name == 'rb') {
                                rx = bounds.x;
                                ry = bounds.y;
                                rw = e.stageX - bounds.x;
                                rh = e.stageY - bounds.y
                            } else if (r.name == 'lb') {
                                rx = e.stageX;
                                ry = bounds.y;
                                rw = bounds.x - e.stageX + bounds.width;
                                rh = e.stageY - bounds.y;
                            } else if (r.name == 'lt') {
                                rx = e.stageX;
                                ry = e.stageY;
                                rw = bounds.x - e.stageX + bounds.width;
                                rh = bounds.y - e.stageY + bounds.height;
                            } else if (r.name == 'rt') {
                                rx = bounds.x;
                                ry = e.stageY;
                                rw = e.stageX - bounds.x;
                                rh = bounds.y - e.stageY + bounds.height;
                            }

                            z.bounds.x = rx;
                            z.bounds.y = ry;
                            z.bounds.width = rw;
                            z.bounds.height = rh;

                            z.rePaint();
                            z.drawHandlers();
                        });

                        r.on('mouseover', function() {
                            pb.hoverShape = true;
                        });
                        r.on('mouseout', function() {
                            pb.hoverShape = false;
                        });

                        r.on('mousedown', function() {
                            /*var z = shape;
                        z.backup = {
                            bounds: z.getBounds().clone(),
                            x: z.x,
                            y: z.y
                        };*/
                        });

                        r.on('pressup', function(e) {

                            /*undoManager.createUndo({
                            target: shape,
                            x: shape.backup.x,
                            y: shape.backup.y,
                            bounds: cloneObj(shape.backup.bounds)

                        });*/
                        });
                    }

                    z.shape.getStage().addChild(r);

                    r.center = {
                        x: h.x,
                        y: h.y
                    }

                    r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('#fff').drawCircle(h.x, h.y, 6);
                    z.shape.getStage().update();
                })(i);
            }
        };


        // Line shape
        function LineShape(x, y) {
            this.startX = this.endX = x;
            this.startY = this.endY = y;
            this.strokeColor = pb.strokeColor;
            this.strokeSize = pb.strokeSize;
            this.handlers = [];
            this.selected = false;
            this.shape = new createjs.Shape();
            this._type = 'line';

            this.init();
        }

        LineShape.prototype.init = function() {
            var z = this,
                s = z.shape;

            s.cursor = "move";

            s.addEventListener('mouseover', function() {
                console.info('shape mouseover');
                if (pb.creating) {
                    return;
                }
                pb.hoverShape = true;
                s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                if (!z.selected) {
                    s.shadow = null;
                    s.getStage().update();
                }
                pb.hoverShape = false;

            }, false);

            s.addEventListener('mousedown', function(e) {
                z.bringToTop();
                z.backup = {
                    startX: z.startX,
                    startY: z.startY,
                    endX: z.endX,
                    endY: z.endY,
                    strokeColor: z.strokeColor,
                    strokeSize: z.strokeSize
                };

                z._startX = e.stageX;
                z._startY = e.stageY;

                /*var offsetX = s.x - e.stageX;
                var offsetY = s.y - e.stageY;
                z.offset = {
                    x: offsetX,
                    y: offsetY
                };*/
                z.select();
                pb.lastShape = z;
            }, false);

            s.addEventListener('pressmove', function(e) {
                if (pb.creating) {
                    return;
                }

                var moveX = e.stageX - z._startX;
                var moveY = e.stageY - z._startY;

                z.startX = z.backup.startX + moveX;
                z.startY = z.backup.startY + moveY;
                z.endX = z.backup.endX + moveX;
                z.endY = z.backup.endY + moveY;
                z.rePaint();
                z.drawHandlers();
                s.getStage().update();
            }, false);
        };

        LineShape.prototype.bringToTop = function() {
            bringToTop.call(this);
        };

        LineShape.prototype.select = function() {
            if (pb.selectedShape) {
                pb.unSelect();
            }
            this.drawHandlers();
            pb.selectedShape = this;
            this.selected = true;
            this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
        };

        LineShape.prototype.drawHandlers = function() {
            var z = this,
                handlers = [{
                    name: 'start',
                    cursor: 'move',
                    x: z.startX,
                    y: z.startY
                }, {
                    name: 'end',
                    cursor: 'move',
                    x: z.endX,
                    y: z.endY
                }];

            for (var i = 0, n = handlers.length; i < n; i++) {
                (function(i) {
                    var h = handlers[i],
                        r = z.handlers[h.name];

                    if (!r) {
                        var r = new createjs.Shape();
                        r._type = 'handler';
                        r.name = h.name;
                        r.cursor = h.cursor;
                        z.handlers[h.name] = r;

                        r.on('pressmove', function(e) {
                            var sx, sy, ex, ey;
                            if (r.name == 'end') {
                                sx = z.startX;
                                sy = z.startY;
                                ex = e.stageX;
                                ey = e.stageY;
                            } else {
                                sx = e.stageX;
                                sy = e.stageY;
                                ex = z.endX;
                                ey = z.endY;
                            }
                            z.startX = sx;
                            z.startY = sy;
                            z.endX = ex;
                            z.endY = ey;
                            z.rePaint();
                            z.drawHandlers();
                        });

                        r.on('mouseover', function() {
                            pb.hoverShape = true;
                        });
                        r.on('mouseout', function() {
                            pb.hoverShape = false;
                        });
                    }

                    z.shape.getStage().addChild(r);

                    r.center = {
                        x: h.x,
                        y: h.y
                    };

                    r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('#fff').drawCircle(h.x, h.y, 6);
                    z.shape.getStage().update();
                })(i);
            }
        };

        //Free shape
        function FreeShape(x, y) {
            this.points = [];
            this._type = 'free';
            this._oX = x;
            this._oY = y;
            this.selected = false;
            this.strokeColor = pb.strokeColor;
            this.strokeSize = pb.strokeSize;
            this.shape = new createjs.Shape();

            this.init();
        }

        FreeShape.prototype.init = function() {
            var z = this,
                s = z.shape;

            s.cursor = 'move';

            s.addEventListener('mouseover', function() {
                console.info('shape mouseover');
                if (pb.creating) {
                    return;
                }
                pb.hoverShape = true;
                s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                if (!z.selected) {
                    s.shadow = null;
                    s.getStage().update();
                }
                pb.hoverShape = false;

            }, false);

            s.addEventListener('mousedown', function(e) {
                z.bringToTop();
                z.backup = {
                    points: cloneArray(z.points),
                    x: z.shape.x,
                    y: z.shape.y,
                    strokeColor: z.strokeColor,
                    strokeSize: z.strokeSize
                };

                z._startX = e.stageX;
                z._startY = e.stageY;

                var offsetX = s.x - e.stageX;
                var offsetY = s.y - e.stageY;
                z.offset = {
                    x: offsetX,
                    y: offsetY
                };

                z.select();
                pb.lastShape = z;
            }, false);

            s.addEventListener('pressmove', function(e) {
                if (pb.creating) {
                    return;
                }

                var moveX = e.stageX - z._startX;
                var moveY = e.stageY - z._startY;

                z.shape.x = e.stageX + z.offset.x;
                z.shape.y = e.stageY + z.offset.y;

                s.getStage().update();
            }, false);
        };

        FreeShape.prototype.bringToTop = function() {
            bringToTop.call(this);
        };

        FreeShape.prototype.select = function() {
            if (pb.selectedShape) {
                pb.unSelect();
            }
            this.selected = true;
            pb.selectedShape = this;
            this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
        };

        // Text 
        function Text(content, x, y) {
            this._type = 'text';
            this.content = content;
            this.x = x;
            this.y = y;
            this.strokeColor = pb.strokeColor;
            this.font = pb.textSize + " " + pb.textFamily;
            this.shape = new createjs.Text(content, pb.textSize + " " + pb.textFamily, pb.strokeColor);

            this.init();
        }

        Text.prototype.init = function() {
            var z = this,
                s = this.shape;

            s.x = this.x;
            s.y = this.y;
            s.hitArea = new createjs.Shape();
            s.hitArea.graphics.clear().beginFill("#f00").drawRect(0, 0, s.getMeasuredWidth(), s.getMeasuredHeight());
            s.cursor = "move";

            s.addEventListener('mouseover', function() {
                console.info('shape mouseover');
                if (pb.creating) {
                    return;
                }
                pb.hoverShape = true;
                s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                if (!z.selected) {
                    s.shadow = null;
                    s.getStage().update();
                }
                pb.hoverShape = false;

            }, false);

            s.addEventListener('mousedown', function(e) {
                z.bringToTop();
                z.backup = {
                    strokeColor: z.strokeColor,
                    font: z.font,
                    content: z.content,
                    x: z.x,
                    y: z.y
                };

                z._startX = e.stageX;
                z._startY = e.stageY;

                var offsetX = s.x - e.stageX;
                var offsetY = s.y - e.stageY;
                z.offset = {
                    x: offsetX,
                    y: offsetY
                };

                z.select();
                pb.lastShape = z;
            }, false);

            s.addEventListener('pressmove', function(e) {
                if (pb.creating) {
                    return;
                }

                var moveX = e.stageX - z._startX;
                var moveY = e.stageY - z._startY;

                z.shape.x = e.stageX + z.offset.x;
                z.shape.y = e.stageY + z.offset.y;

                s.getStage().update();
            });

            s.addEventListener('dblclick', function(e) {
                pb.textOnEdit = s;
                var offset = getOffset(pb.canvas);
                pb.temp_input.style.top = parseFloat(s.y) + offset.top + 'px';
                pb.temp_input.style.left = parseFloat(s.x) + offset.left + 'px';
                pb.temp_input.value = s.text;
                pb.temp_input.setAttribute('data-edit', "true");
                pb.temp_input.style.display = 'block';
                setTimeout(function() {
                    pb.temp_input.focus();
                }, 0);
            }, false);
        };

        Text.prototype.rePaint = function(o) {
            var text = this.shape;

            text.color = o.strokeColor;
            text.text = o.content;
            text.font = o.font;
        };

        Text.prototype.select = function() {
            if (pb.selectedShape) {
                pb.unSelect();
            }
            this.selected = true;
            pb.selectedShape = this;
            this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
        };

        Text.prototype.bringToTop = function() {
            bringToTop.call(this);
        };

        // Image shape
        function ImageShape(image) {
            this.x = 100;
            this.y = 100;
            this.shape = new createjs.Bitmap(image);

            this.init();
        }

        ImageShape.prototype.init = function() {
            var z = this,
                s = z.shape;

            s.cursor = "move";
            s.scaleX = 0.5;
            s.scaleY = 0.5;

            s.addEventListener('mouseover', function() {
                pb.hoverShape = true;
            }, false);

            s.addEventListener('mouseout', function() {
                pb.hoverShape = false;
            }, false);

            s.addEventListener('mousedown', function(e) {
                if (pb.selectedShape) {
                    pb.unSelect();
                }
                z.bringToTop();
                z.backup = {
                    x: z.shape.x,
                    y: z.shape.y
                };

                z._startX = e.stageX;
                z._startY = e.stageY;

                var offsetX = s.x - e.stageX;
                var offsetY = s.y - e.stageY;
                z.offset = {
                    x: offsetX,
                    y: offsetY
                };
            }, false);

            s.addEventListener('pressmove', function(e) {
                var moveX = e.stageX - z._startX;
                var moveY = e.stageY - z._startY;

                z.shape.x = e.stageX + z.offset.x;
                z.shape.y = e.stageY + z.offset.y;

                s.getStage().update();
            }, false);


        };

        ImageShape.prototype.bringToTop = function() {
            bringToTop.call(this);
        };


        /** 
         * Rectangle
         =================================================*/

        function Rect(x, y) {
            Shape.apply(this, arguments);
        };

        extend(Rect, Shape);

        Rect.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
            z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
        };

        /** 
         * Round rectangle
         =================================================*/

        function RoundRect(x, y) {
            Shape.apply(this, arguments);
        }

        extend(RoundRect, Shape);

        RoundRect.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawRoundRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height, 10);
            z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRoundRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height, 10);
        };

        /** 
         * Ellipse
         =================================================*/

        function Ellipse(x, y) {
            Shape.apply(this, arguments);
        };

        extend(Ellipse, Shape);

        Ellipse.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawEllipse(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
            z.shape.hitArea.graphics.clear().beginFill("#FFF").drawEllipse(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
        };

        /** 
         * Line
         =================================================*/

        function Line(x, y) {
            LineShape.apply(this, arguments);
        };

        extend(Line, LineShape);

        Line.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).moveTo(z.startX, z.startY).lineTo(z.endX, z.endY);
        };

        /** 
         * Arrow
         =================================================*/

        function Arrow(x, y) {
            LineShape.apply(this, arguments);
        };

        extend(Arrow, LineShape);

        Arrow.prototype.rePaint = function() {
            var z = this;
            var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
            this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(8).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, 8 * 1.5, 3, 0.5, angle);
        };

        /** 
         * Free line
         =================================================*/

        function FreeLine(x, y) {
            FreeShape.apply(this, arguments);
        };

        extend(FreeLine, FreeShape);

        FreeLine.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
            for (var i = 0, n = z.points.length; i < n; i++) {
                var p = z.points[i];

                z.shape.graphics.lineTo(p.x, p.y);
            }
        };

        /** 
         * Free arrow.
         =================================================*/

        function FreeArrow(x, y) {
            FreeShape.apply(this, arguments);
        };

        extend(FreeArrow, FreeShape);

        FreeArrow.prototype.rePaint = function(angle) {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
            for (var i = 0, n = z.points.length; i < n; i++) {
                var p = z.points[i];

                z.shape.graphics.lineTo(p.x, p.y);
            }

            z.shape.graphics.endStroke().setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, 8 * 2.5, 3, 0.5, angle);
        };



    }

    PaintBoard.prototype.unSelect = function() {
        var s = pb.selectedShape,
            stage = s.shape.getStage();

        if (s.handlers) {
            for (var i in s.handlers) {
                stage.removeChild(s.handlers[i]);
            }
        }

        s.shape.shadow = null;
        s.selected = false;
        stage.update();
    };

    PaintBoard.prototype.setShapeType = function(type) {
        this.shapeType = type;
        return this;
    };

    PaintBoard.prototype.setStokeColor = function(color) {
        this.strokeColor = color;
        return this;
    };

    PaintBoard.prototype.setStokeSize = function(color) {
        this.strokeSize = color;
        return this;
    };

    PaintBoard.prototype.setTextSize = function(size) {
        this.setTextSize = size;
        return this;
    };

    PaintBoard.prototype.zoomIn = function(level) {
        this.canvas.style.transform = "scale(" + level + ")";
        return this;
    };

    PaintBoard.prototype.zoomOut = function(level) {
        this.canvas.style.transform = "scale(" + level + ")";
        return this;
    };

    PaintBoard.prototype.insert = function(src) {
        function onloadHandler() {
            var bitmap = new createjs.Bitmap(image);
            bitmap.x = 100;
            bitmap.y = 100;
            bitmap.regX = 50;
            bitmap.regY = 50;
            bitmap.scaleX = 0.5;
            bitmap.scaleY = 0.5;
            bitmap.cursor = 'move';

            bitmap.addEventListener('mousedown', mouseDown, false);
            bitmap.addEventListener('pressmove', pressMove, false);
            bitmap.addEventListener('mouseover', mouseOver, false);
            bitmap.addEventListener('mouseout', mouseOut, false);

            function mouseDown(e) {

            }

            function mouseOver() {
                this.hoverShape = true;
            }

            function mouseOut() {
                this.hoverShape = false;
            }

            this.stage.addChild(bitmap);
            this.stage.update();
        }



    };

    PaintBoard.prototype.toDataURL = function(mimeType) {
        return this.stage.toDataURL(null, mimeType);
    };



    window.PaintBoard = PaintBoard;
})();