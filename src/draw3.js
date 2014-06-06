 ;
 (function() {
     /** 
     * Extend easeljs Graphics
     =================================================*/
     createjs.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLen) {
         this.moveTo(x1, y1);

         var dX = x2 - x1;
         var dY = y2 - y1;
         var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
         var dashX = dX / dashes;
         var dashY = dY / dashes;

         var q = 0;
         while (q++ < dashes) {
             x1 += dashX;
             y1 += dashY;
             this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
         }
         this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
         return this;
     };

     createjs.Graphics.prototype.drawDashedRect = function(x1, y1, w, h, dashLen) {
         this.moveTo(x1, y1);
         var x2 = x1 + w;
         var y2 = y1 + h;
         this.dashedLineTo(x1, y1, x2, y1, dashLen);
         this.dashedLineTo(x2, y1, x2, y2, dashLen);
         this.dashedLineTo(x2, y2, x1, y2, dashLen);
         this.dashedLineTo(x1, y2, x1, y1, dashLen);
         return this;
     };

     var a = document.createElement('canvas');
     ctx = a.getContext('2d'),
     isSurpportSetLineDash = !!ctx.setLineDash,
     isSurpportEllipse = !!ctx.ellipse;

     delete a;
     if (isSurpportEllipse) {
         createjs.Graphics.prototype.drawEllipseByAngle = function(x, y, rx, ry, r, sa, ea, anti) {
             this._dirty = this._active = true;
             var z = this;
             this._activeInstructions.push(new createjs.Graphics.Command(z._ctx.ellipse, [x, y, rx, ry, r, sa, ea, anti]));

             return this;
         };
     }


     if (isSurpportSetLineDash) {
         createjs.Graphics.prototype.setLineDash = function(arr) {
             if (this._active) {
                 this._newPath();
             }
             var z = this;
             this._strokeStyleInstructions.push(new createjs.Graphics.Command(z._ctx.setLineDash, [arr]));

             return this;
         };
     }



     /** 
      * Main object
      =================================================*/

     var paintBoard = PB = {};
     PB.createBoard = function(canvas) {
         var shapeType = 'rect',
             strokeColor = '#f00',
             fontSize = '24px',
             fontFamily = "Arial",
             alpha = 1,
             strokeSize = 8,
             creating = false,
             hoverShape = false,
             modifyText = false,
             selectedShape = null,
             temp_input = document.createElement('textarea'),
             mouseX = 0,
             mouseY = 0,
             stageX = 0,
             stageY = 0,
             board = null;

         function Board(canvas) {
             this.canvas = document.getElementById(canvas);
             this.stage = new createjs.Stage(canvas);
         }

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

         Board.prototype.insert = function(src) {
             var stage = this.stage;
             var image = new Image();
             image.src = src; /*"assets/tick-off.png"*/
             image.crossOrigin = "Anonymous";
             image.onload = onloadHandler;

             function onloadHandler() {
                 var img = new ImageShape(image);

                 stage.addChild(img.shape);
                 stage.update();

                 return img.shape;
             }

             return this;
         };

         Board.prototype.setShapeType = function(type) {
             shapeType = type;
             return this;
         };

         Board.prototype.getShapeType = function() {
             return shapeType;
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

         Board.prototype.setStokeColor = function(color) {
             if (selectedShape) {
                 selectedShape.strokeColor = color;
                 selectedShape.rePaint();
                 this.stage.update();
             }
             strokeColor = color;
             return this;
         };

         Board.prototype.setStokeSize = function(size) {
             if (selectedShape) {
                 selectedShape.strokeSize = size;
                 selectedShape.rePaint();
                 this.stage.update();
             }
             strokeSize = size;
             return this;
         };

         Board.prototype.setFontSize = function(size) {
             if (selectedShape) {
                 selectedShape.fontSize = size;
                 selectedShape.rePaint();
                 this.stage.update();
             }
             fontSize = size;
             return this;
         };

         Board.prototype.setFontFamily = function(f) {
             if (selectedShape) {
                 selectedShape.fontFamily = f;
                 selectedShape.rePaint();
                 this.stage.update();
             }
             fontFamily = f;
             return this;
         };

         Board.prototype.zoomIn = function(level) {
             this.canvas.style.transform = "scale(" + level + ")";
             return this;
         };

         Board.prototype.zoomOut = function(level) {
             this.canvas.style.transform = "scale(" + level + ")";
             return this;
         };

         Board.prototype.toDataURL = function(mimeType) {
             return this.stage.toDataURL(null, mimeType);
         };

         function init() {
             board = new Board(canvas);
             var stage = board.stage;

             insertInput();

             stage.enableMouseOver(10);
             stage.on('stagemousedown', mouseDown, false);

             var a = new createjs.Shape();
             a.graphics.setStrokeStyle(strokeSize).setLineDash([10, 5]).beginStroke(strokeColor).drawEllipseByAngle(233, 99, 178, 70, 0, 3 / 4 * Math.PI, 2.65 * Math.PI, false).lineTo(70, 210).closePath();
             a.shadow = new createjs.Shadow('rgba(0,0,0,.5)', 0, 2, 2);
             stage.addChild(a);
             stage.update();

             function mouseDown(e) {
                 console.info('stage mousedown', hoverShape);
                 if (!shapeType) {
                     return;
                 } else if (hoverShape) {
                     return;
                 }

                 if (selectedShape) {
                     board.unSelect();
                     return;
                 }

                 creating = true;

                 var originalX = e.stageX,
                     originalY = e.stageY;

                 switch (shapeType) {
                     case 'rect':
                         var s = new Rect(e.stageX, e.stageY);
                         break;
                     case 'd-rect':
                         var s = new DashedRect(e.stageX, e.stageY);
                         break;
                     case 'ellipse':
                         var s = new Ellipse(e.stageX, e.stageY);
                         break;
                     case 's-b':
                         var s = new speechBubble2(e.stageX, e.stageY);
                         break;
                     case 'r-rect':
                         var s = new RoundRect(e.stageX, e.stageY);
                         break;
                     case 'line':
                         var s = new Line(e.stageX, e.stageY);
                         break;
                     case 'd-line':
                         var s = new DashedLine(e.stageX, e.stageY);
                         break;
                     case 'arrow':
                         var s = new Arrow(e.stageX, e.stageY);
                         break;
                     case 'd-arrow':
                         var s = new DashedArrow(e.stageX, e.stageY);
                         break;
                     case 'db-arrow':
                         var s = new DoubleArrow(e.stageX, e.stageY);
                         break;
                     case 'dbd-arrow':
                         var s = new DoubleDashedArrow(e.stageX, e.stageY);
                         break;
                     case 'free-line':
                         var s = new FreeLine(e.stageX, e.stageY);
                         break;
                     case 'free-arrow':
                         var s = new FreeArrow(e.stageX, e.stageY);
                         break;
                     case 'text':
                         drawText(e.nativeEvent.pageX, e.nativeEvent.pageY, e.stageX, e.stageY);
                         creating = false;
                         break;
                     case 'blur':
                         var s = new BlurRect(e.stageX, e.stageY);
                         break;
                 }

                 if (!s) {
                     return;
                 }

                 console.log(s);

                 stage.addChild(s.shape);

                 stage.addEventListener('stagemousemove', mousemove, false);
                 stage.addEventListener('stagemouseup', mouseup, false);

                 function mousemove(e) {
                     //console.info('stagemousemove');
                     if (s._type == 'shape') {
                         s.bounds.width = Math.abs(e.stageX - originalX);
                         s.bounds.height = Math.abs(e.stageY - originalY);
                         s.bounds.x = Math.min(originalX, e.stageX);
                         s.bounds.y = Math.min(originalY, e.stageY);
                         if (s.subType == 'callout') {
                             s.calloutPointX = s.bounds.x + 10;
                             s.calloutPointY = s.bounds.y + s.bounds.height + 20;
                         }
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

                    window.freeline = s;

                     stage.update();
                 }

                 function mouseup(e) {
                     console.info('stage mouseup', stage.mouseInBounds);
                     if (stage.mouseInBounds) {
                         if (e.stageX == originalX && e.stageY == originalY) {
                             stage.removeChild(s);
                         }
                         creating = false;
                        freeline.smooth();
                         stage.off('stagemousemove', mousemove, false);
                     }
                 }
             }


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
                 temp_input.style.color = strokeColor;
                 temp_input.style.fontSize = fontSize;
                 temp_input.style.fontFamily = fontFamily;
                 temp_input.style.lineHeight = fontSize;
                 document.body.appendChild(temp_input);
                 autoExpand(temp_input);

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
                             var text = new Text(content, x, y);
                             text.bounds.width = w;
                             text.bounds.height = h;
                             text.rePaint();
                             stage.addChild(text.shape);
                         }
                         stage.update();

                     }

                     temp_input.value = '';
                     temp_input.style.display = 'none';
                     temp_input.setAttribute('data-edit', 'false');
                 }, false);
             }

             function drawText(px, py, sx, sy) {
                 if (hoverShape) {
                     return;
                 }

                 stageX = sx;
                 stageY = sy;

                 temp_input.style.left = px + 'px';
                 temp_input.style.top = py + 'px';
                 if (temp_input.style.display == 'none') {
                     temp_input.setAttribute('data-stage-x', sx);
                     temp_input.setAttribute('data-stage-y', sy);
                 }
                 temp_input.style.display = 'block';
                 fixTextarea(temp_input);

                 setTimeout(function() {
                     temp_input.focus();
                 }, 10);
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
             //textarea.setAttribute('rows', k);
             //textarea.setAttribute('cols', l);
         }

         function getWidth(text, fontSize, fontFamily) {
             text += "m";
             var temp_text = new createjs.Text(text, fontSize + ' ' + fontFamily);
             var w = temp_text.getMeasuredWidth();
             temp_text = null;
             return w;
         }

         /** 
         * Basic Shapes: Shape, Line shape, Free shape, Text, Image shape
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
             this.alpha = alpha;
             this._startX = 0;
             this._startY = 0;
             this.selected = false;
             this.strokeColor = strokeColor;
             this.strokeSize = strokeSize;
             this.shape = new createjs.Shape();
             this._type = 'shape';

             this.init();
         }

         Shape.prototype.init = function() {
             var z = this,
                 s = z.shape;

             s.cursor = 'move';
             s.alpha = alpha;
             s.hitArea = new createjs.Shape();

             s.addEventListener('mouseover', function() {
                 console.info('shape mouseover');
                 if (creating) {
                     return;
                 }
                 hoverShape = true;
                 s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                 s.getStage().update();
             }, false);

             s.addEventListener('mouseout', function() {
                 if (!z.selected) {
                     s.shadow = null;
                     s.getStage().update();
                 }
                 hoverShape = false;

             }, false);

             s.addEventListener('mousedown', function(e) {
                 if (creating) {
                     return;
                 }
                 z.bringToTop();
                 z.backup = {
                     bounds: cloneObj(z.bounds),
                     x: z.shape.x,
                     y: z.shape.y,
                     strokeColor: z.strokeColor,
                     strokeSize: z.strokeSize,
                     cx: z.calloutPointX,
                     cy: z.calloutPointY
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
                 lastShape = z;
             }, false);

             s.addEventListener('pressmove', function(e) {
                 console.log(creating);
                 if (creating) {
                     return;
                 }

                 var moveX = e.stageX - z._startX;
                 var moveY = e.stageY - z._startY;

                 var prev_bounds = z.backup.bounds;
                 z.setBounds(prev_bounds.x + moveX, prev_bounds.y + moveY, prev_bounds.width, prev_bounds.height);
                 if (z.calloutPointX) {
                     z.calloutPointX = z.backup.cx + moveX;
                     z.calloutPointY = z.backup.cy + moveY;
                 }
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
             if (selectedShape && selectedShape.shape.id != this.shape.id) {
                 board.unSelect();
             }
             this.drawHandlers();
             selectedShape = this;
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

             if (z.subType == 'callout') {
                 handlers.push({
                     name: 'cp',
                     cursor: 'move',
                     x: z.calloutPointX,
                     y: z.calloutPointY
                 });
             }

             //console.log(x,y,w,h)

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
                         var obounds = {};
                         r.on('mousedown', function() {
                             obounds = cloneObj(z.bounds);
                         }, false);

                         r.on('pressmove', function(e) {
                             console.log(r.name);
                             var _bounds = cloneObj(z.bounds);
                             var rx, ry, rw, rh;
                             if (r.name == 'rb') {
                                 rx = Math.min(e.stageX, obounds.x);
                                 ry = Math.min(e.stageY, obounds.y);
                                 rw = Math.abs(e.stageX - obounds.x);
                                 rh = Math.abs(e.stageY - obounds.y);
                             } else if (r.name == 'lb') {
                                 rx = (obounds.x - e.stageX + obounds.width) >= 0 ? e.stageX : _bounds.x;
                                 ry = Math.min(e.stageY, obounds.y);
                                 rw = Math.abs(obounds.x - e.stageX + obounds.width);
                                 rh = Math.abs(e.stageY - obounds.y);
                             } else if (r.name == 'lt') {
                                 rx = (obounds.x - e.stageX + obounds.width) >= 0 ? e.stageX : _bounds.x;
                                 ry = (obounds.y - e.stageY + obounds.height) >= 0 ? e.stageY : _bounds.y;
                                 rw = Math.abs(obounds.x - e.stageX + obounds.width);
                                 rh = Math.abs(obounds.y - e.stageY + obounds.height);
                             } else if (r.name == 'rt') {
                                 rx = Math.min(e.stageX, obounds.x);
                                 ry = (obounds.y - e.stageY + obounds.height) >= 0 ? e.stageY : _bounds.y;
                                 rw = Math.abs(e.stageX - obounds.x);
                                 rh = Math.abs(obounds.y - e.stageY + obounds.height);
                             } else if (r.name == 'cp') {
                                 z.calloutPointX = e.stageX;
                                 z.calloutPointY = e.stageY;
                                 var a = z.calloutPointX - (z.bounds.x + z.bounds.width / 2);
                                 var b = z.calloutPointY - (z.bounds.y + z.bounds.height / 2);

                                 var angle = Math.atan(z.bounds.height / z.bounds.width * Math.abs(a / b));
                                 if (a >= 0 && b >= 0) {
                                     angle = Math.PI / 2 - angle;
                                 } else if (a >= 0 && b <= 0) {
                                     angle = Math.PI * 1.5 + angle;
                                 } else if (a <= 0 && b >= 0) {
                                     angle = Math.PI / 2 + angle;
                                 } else if (a <= 0 && b <= 0) {
                                     angle = Math.PI * 1.5 - angle;
                                 }

                                 z.sAngle = angle + Math.PI / 18;
                                 z.eAngle = angle - Math.PI / 18;
                             }

                             if (r.name != 'cp') {
                                 z.bounds.x = rx;
                                 z.bounds.y = ry;
                                 z.bounds.width = rw;
                                 z.bounds.height = rh;
                             }


                             z.rePaint();
                             z.drawHandlers();
                         });

                         r.on('mouseover', function() {
                             hoverShape = true;
                         });
                         r.on('mouseout', function() {
                             hoverShape = false;
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
                     if (r.name == 'cp') {
                         r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('yellow').drawCircle(h.x, h.y, 4);
                     } else {
                         r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('#fff').drawCircle(h.x, h.y, 6);
                     }

                     z.shape.getStage().update();
                 })(i);
             }
         };


         // Line shape
         function LineShape(x, y) {
             this.startX = this.endX = x;
             this.startY = this.endY = y;
             this.strokeColor = strokeColor;
             this.strokeSize = strokeSize;
             this.alpha = alpha;
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
             s.alpha = z.alpha;

             s.addEventListener('mouseover', function() {
                 console.info('shape mouseover');
                 if (creating) {
                     return;
                 }
                 hoverShape = true;
                 s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                 s.getStage().update();
             }, false);

             s.addEventListener('mouseout', function() {
                 if (!z.selected) {
                     s.shadow = null;
                     s.getStage().update();
                 }
                 hoverShape = false;

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
                 lastShape = z;
             }, false);

             s.addEventListener('pressmove', function(e) {
                 if (creating) {
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
             if (selectedShape && selectedShape.shape.id != this.shape.id) {
                 board.unSelect();
             }
             this.drawHandlers();
             selectedShape = this;
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
                             hoverShape = true;
                         });
                         r.on('mouseout', function() {
                             hoverShape = false;
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
             this.alpha = alpha;
             this._oX = x;
             this._oY = y;
             this.selected = false;
             this.strokeColor = strokeColor;
             this.strokeSize = strokeSize;
             this.shape = new createjs.Shape();

             this.init();
         }

         FreeShape.prototype.init = function() {
             var z = this,
                 s = z.shape;

             s.cursor = 'move';
             s.alpha = z.alpha;

             s.addEventListener('mouseover', function() {
                 console.info('shape mouseover');
                 if (creating) {
                     return;
                 }
                 hoverShape = true;
                 s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                 s.getStage().update();
             }, false);

             s.addEventListener('mouseout', function() {
                 if (!z.selected) {
                     s.shadow = null;
                     s.getStage().update();
                 }
                 hoverShape = false;

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
                 lastShape = z;
             }, false);

             s.addEventListener('pressmove', function(e) {
                 if (creating) {
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
             if (selectedShape && selectedShape.shape.id != this.shape.id) {
                 board.unSelect();
             }
             this.selected = true;
             selectedShape = this;
             this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
         };

         // Text 
         function Text(content, x, y) {
             this._type = 'text';
             this.content = content;
             this.x = x;
             this.y = y;
             this.bounds = {
                 x: x,
                 y: y,
                 width: 0,
                 height: 0
             },
             this.alpha = alpha;
             this.strokeColor = strokeColor;
             this.fontSize = fontSize;
             this.fontFamily = fontFamily;
             this.shape = new createjs.Text(content, fontSize + " " + fontFamily, strokeColor);

             this.init();
         }

         Text.prototype.init = function() {
             var z = this,
                 s = this.shape;

             s.x = this.x;
             s.y = this.y;
             s.alpha = z.alpha;
             s.hitArea = new createjs.Shape();
             s.hitArea.graphics.clear().beginFill("#f00").drawRect(0, 0, s.getMeasuredWidth(), s.getMeasuredHeight());
             s.cursor = "move";

             s.addEventListener('mouseover', function() {
                 console.info('shape mouseover');
                 if (creating) {
                     return;
                 }
                 hoverShape = true;
                 s.shadow = new createjs.Shadow(z.strokeColor, 0, 0, 10);
                 s.getStage().update();
             }, false);

             s.addEventListener('mouseout', function() {
                 if (!z.selected) {
                     s.shadow = null;
                     s.getStage().update();
                 }
                 hoverShape = false;

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
                 lastShape = z;
             }, false);

             s.addEventListener('pressmove', function(e) {
                 if (creating) {
                     return;
                 }

                 var moveX = e.stageX - z._startX;
                 var moveY = e.stageY - z._startY;

                 z.shape.x = e.stageX + z.offset.x;
                 z.shape.y = e.stageY + z.offset.y;

                 s.getStage().update();
             });

             s.addEventListener('dblclick', function(e) {
                 textOnEdit = z;
                 var offset = getOffset(board.canvas);
                 temp_input.style.top = parseFloat(s.y) + offset.top + 'px';
                 temp_input.style.left = parseFloat(s.x) + offset.left + 'px';
                 temp_input.value = s.text;
                 temp_input.setAttribute('data-edit', "true");
                 temp_input.style.color = z.strokeColor;
                 temp_input.style.fontSize = z.fontSize;
                 temp_input.style.fontFamily = z.fontFamily;
                 temp_input.style.lineHeight = z.fontSize;
                 temp_input.style.display = 'block';
                 fixTextarea(temp_input);
                 s.text = '';
                 s.getStage().update();
                 setTimeout(function() {
                     temp_input.focus();
                 }, 0);
             }, false);
         };

         Text.prototype.rePaint = function() {
             var z = this;
             var text = z.shape;
             console.log(this);
             text.color = z.strokeColor;

             text.text = z.content;
             console.log(z.content);
             text.font = z.fontSize + " " + z.fontFamily;
             text.lineHeight = parseInt(z.fontSize);

             text.hitArea.graphics.clear().beginFill("#f00").drawRect(0, 0, z.bounds.width, z.bounds.height);
         };

         Text.prototype.select = function() {
             if (selectedShape && selectedShape.shape.id != this.shape.id) {
                 board.unSelect();
             }
             this.selected = true;
             selectedShape = this;
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
             s.scaleX = 0.3;
             s.scaleY = 0.3;

             s.addEventListener('mouseover', function() {
                 hoverShape = true;
             }, false);

             s.addEventListener('mouseout', function() {
                 hoverShape = false;
             }, false);

             s.addEventListener('mousedown', function(e) {
                 if (selectedShape) {
                     board.unSelect();
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


         // Call out Shape

         function CallOutShape(x, y) {
             this.subType = 'callout';
             this.calloutPointX = x;
             this.calloutPointY = y;
             this.content = '';
             this.text = new createjs.Text(this.content, "14px Arial", "#ffffff");
             this.sAngle = 135 / 180 * Math.PI;
             this.eAngle = 475 / 180 * Math.PI;
             Shape.apply(this, arguments);
             var z = this;

             this.shape.on('click', function() {
                 var offset = getOffset(board.canvas);
                 var cx = z.bounds.x + z.bounds.width / 2;
                 var cy = z.bounds.y + z.bounds.height / 2;
                 var sx = -Math.sqrt(2) * z.bounds.width / 4 + cx;
                 var sy = -Math.sqrt(2) * z.bounds.height / 4 + cy;

                 var dx = sx + offset.left + 10;
                 var dy = sy + offset.top + 10;
                 temp_input.style.left = dx + 'px';
                 temp_input.style.top = dy + 'px';
                 temp_input.style.width = Math.sqrt(2) * z.bounds.width / 2 - 20 + 'px';
                 temp_input.style.height = Math.sqrt(2) * z.bounds.height / 2 - 20 + 'px';
                 temp_input.style.color = '#fff';
                 temp_input.style.fontSize = '14px';
                 temp_input.style.display = 'block';
             }, false);
         }

         extend(CallOutShape, Shape);


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
             //z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).decodePath('M 0 0 L 200 100 L 170 200 z');
         };

         /** 
          * Dashed Rectangle
          =================================================*/

         function DashedRect(x, y) {
             Shape.apply(this, arguments);
         };

         extend(DashedRect, Shape);

         DashedRect.prototype.rePaint = function() {
             var z = this;
             if (isSurpportSetLineDash) {
                 z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").setLineDash([10]).beginStroke(this.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
             } else {
                 z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawDashedRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height, 15);
             }

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
         * Speech bubble 1 (circle)
         =================================================*/

         function speechBubble1(x, y) {
             CallOutShape.apply(this, arguments);
             this.shape.shadow = new createjs.Shadow('rgba(0,0,0,.5)', 2, 2, 4);
         };

         extend(speechBubble1, CallOutShape);

         speechBubble1.prototype.rePaint = function() {
             var z = this;
             z.shape.graphics.clear().beginFill(this.strokeColor).drawEllipse(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height).endStroke();
             z.shape.graphics.beginFill(this.strokeColor).drawCircle(z.bounds.x + z.bounds.width / 5, z.bounds.y + z.bounds.height + z.bounds.height / 8, z.bounds.height / 8).endFill().beginFill(this.strokeColor).drawCircle(z.bounds.x + z.bounds.width / 5 - (z.bounds.height / 15 + z.bounds.height / 8 + 10), z.bounds.y + z.bounds.height + z.bounds.height / 8 + z.bounds.height / 15 + 15, z.bounds.height / 15);
             z.shape.hitArea.graphics.clear().beginFill("#FFF").drawEllipse(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
         };

         /** 
         * Speech bubble1 2 (arrow)
         =================================================*/

         function speechBubble2(x, y) {
             CallOutShape.apply(this, arguments);
         }

         extend(speechBubble2, CallOutShape);

         speechBubble2.prototype.rePaint = function() {
             var z = this;
             var cx = z.bounds.width / 2 + z.bounds.x,
                 cy = z.bounds.height / 2 + z.bounds.y;
             z.shape.graphics.clear().beginFill(z.strokeColor).drawEllipseByAngle(cx, cy, z.bounds.width / 2, z.bounds.height / 2, 0, z.sAngle, z.eAngle, false).lineTo(z.calloutPointX, z.calloutPointY).closePath();
             z.shape.hitArea.graphics.clear().beginFill("#FFF").drawEllipseByAngle(cx, cy, z.bounds.width / 2, z.bounds.height / 2, 0, z.sAngle, z.eAngle, false).lineTo(z.calloutPointX, z.calloutPointY).closePath();
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
          * Dashed Line
          =================================================*/

         function DashedLine(x, y) {
             LineShape.apply(this, arguments);
         };

         extend(DashedLine, LineShape);

         DashedLine.prototype.rePaint = function() {
             var z = this;
             if (isSurpportSetLineDash) {
                 z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).moveTo(z.startX, z.startY).lineTo(z.endX, z.endY);
             } else {
                 z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10);
             }

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
             this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2, 3, 0.5, angle);
         };

         /** 
          * Dashed Arrow
          =================================================*/

         function DashedArrow(x, y) {
             LineShape.apply(this, arguments);
         };

         extend(DashedArrow, LineShape);

         DashedArrow.prototype.rePaint = function() {
             var z = this;
             var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
             if (isSurpportSetLineDash) {
                 this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2, 3, 0.5, angle);
             } else {
                 this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2.5, 3, 0.5, angle);
             }

         };

         /** 
          * Double Arrow
          =================================================*/

         function DoubleArrow(x, y) {
             LineShape.apply(this, arguments);
         };

         extend(DoubleArrow, LineShape);

         DoubleArrow.prototype.rePaint = function() {
             var z = this;
             var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
             this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, z.strokeSize * 2, 3, 0.5, 180 + angle);
         };

         /** 
          * Double Dashed Arrow
          =================================================*/

         function DoubleDashedArrow(x, y) {
             LineShape.apply(this, arguments);
         };

         extend(DoubleDashedArrow, LineShape);

         DoubleDashedArrow.prototype.rePaint = function() {
             var z = this;
             var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
             if (isSurpportSetLineDash) {
                 this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, z.strokeSize * 2, 3, 0.5, 180 + angle);
             } else {
                 this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, z.strokeSize * 2.5, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, z.strokeSize * 2, 3, 0.5, 180 + angle);
             }
         };



         /** 
         * Free line
         =================================================*/

         function FreeLine(x, y) {
             FreeShape.apply(this, arguments);
         };

         extend(FreeLine, FreeShape);

         /*FreeLine.prototype.smooth = function() {
             var z = this;
             z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
             // z.shape.graphics.moveTo(z.points[0].x, z.points[0].y);
             // for (var i = 1, n = z.points.length - 2; i < n; i++) {
             //     var p = z.points[i];
             //     var xc = (p.x + z.points[i + 1].x) / 2;
             //     var yc = (z.points[i].y + z.points[i + 1].y) / 2;
             //     z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, xc, yc);

             // }

             //z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, z.points[i+1].x,z.points[i+1].y);
             var dist = function(a, b) {
                 var x = a.x - b.x;
                 var y = a.y - b.y;
                 return x * x + y * y;
             };
             var _p = [];

             var last = z.points[z.points.length - 1];
             for (var j = 0; j < 5; j++) {
                 _p.push(z.points[0]);
             }
             for (var i = 0; i < z.points.length - 1; i++) {
                 var p = z.points[i];
                 if (dist(p, last) > 16 * 16) {
                     _p.push(p);
                 }
             }

                 var a = 0.2;
                 var p = _p[_p.length - 1]
                 var p1 = _p[_p.length - 2];
                 _p[_p.length - 1] = {
                     x: p.x * a + p1.x * (1 - a),
                     y: p.y * a + p1.y * (1 - a)
                 }

             console.log(_p);
             for (var k = 0; k < _p.length; k++) {
                 z.shape.graphics.lineTo(_p[k].x, _p[k].y);
             }
         };*/

         FreeLine.prototype.rePaint = function() {
             var z = this;
             z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
             z.shape.graphics.moveTo(z.points[0].x, z.points[0].y);
             for (var i = 1,n = z.points.length - 3; i < n; i++) {
                 var p = z.points[i];
                 var xc = (p.x + z.points[i + 1].x) / 2;
                 var yc = (z.points[i].y + z.points[i + 1].y) / 2;
                 z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, xc, yc);

             }
             if (i > 1) {
                z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, z.points[i+1].x,z.points[i+1].y);
             }
             


         };


         FreeLine.prototype.smooth = function () {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
            for(var i = 0; i<z.points.length;i+=4) {
                var p = z.points[i];
                 var xc = (p.x + z.points[i + 1].x) / 2;
                 var yc = (z.points[i].y + z.points[i + 1].y) / 2;
                 z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, xc, yc);
            }
         }

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
             z.shape.graphics.moveTo(z.points[0].x, z.points[0].y);
             for (var i = 1,n = z.points.length - 3; i < n; i++) {
                 var p = z.points[i];
                 var xc = (p.x + z.points[i + 1].x) / 2;
                 var yc = (z.points[i].y + z.points[i + 1].y) / 2;
                 z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, xc, yc);

             }
             if (i > 1) {
                z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, z.points[i+1].x,z.points[i+1].y);
             }

             z.shape.graphics.endStroke().setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, 8 * 2.5, 3, 0.5, angle);
         };

         /** 
         * Blur rectangle.
         =================================================*/

         function BlurRect(x, y) {
             Shape.apply(this, arguments);
             this.addImg();
         }

         extend(BlurRect, Shape);

         BlurRect.prototype.addImg = function() {
             var z = this;
             var image = new Image();
             image.onload = imgOnLoad;
             image.src = "assets/test.png";
             image.crossOrigin = "Anonymous";
             z.shape = new createjs.Bitmap(image);
             z.shape.shadow = new createjs.Shadow('#f00', 0, 0, 10);
             z.init();
             z.shape.hitArea = null;
             z.shape.alpha = 1;

             function imgOnLoad() {
                 var s = z.shape;
                 var blurFilter = new createjs.BlurFilter(10, 10, 1);
                 s.x = z.bounds.x;
                 s.y = z.bounds.y;
                 s.cache(0, 0, 0, 0);
                 s.filters = [blurFilter];
                 s.cursor = 'move';
             }


         };

         BlurRect.prototype.rePaint = function() {
             var z = this,
                 s = z.shape;

             s.sourceRect = new createjs.Rectangle(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
             s.x = z.bounds.x;
             s.y = z.bounds.y;
             s.cache(0, 0, z.bounds.width, z.bounds.height);
             s.width = z.bounds.width;
             s.height = z.bounds.height;
         };

         init();

         return board;
     }

     window.paintBoard = paintBoard;
 })();