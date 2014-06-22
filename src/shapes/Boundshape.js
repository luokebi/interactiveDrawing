;
(function(createjs, PB) {
        function BoundShape(conf) {
                this.bounds = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                };
                this.baseType = 'BoundShape';
                PB.Shape.apply(this, arguments);
        }

        PB.Utils.extend(BoundShape, PB.Shape);

        BoundShape.prototype.setBounds = function(x, y, w, h) {
                this.bounds = {
                        x: x,
                        y: y,
                        width: w,
                        height: h
                };
        };


        BoundShape.prototype.drawHandlers = function() {
                var z = this,
                        bounds = PB.Utils.cloneObj(z.bounds),
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

                if (z.subType === 'callout') {
                        handlers.push({
                                name: 'cp',
                                cursor: 'move',
                                x: z.cpX1,
                                y: z.cpY1
                        });
                }

                for (var i = 0, n = handlers.length; i < n; i++) {
                        (function(i) {
                                var h = handlers[i];

                                var r = z.handlers[h.name];
                                if (!r) {
                                        var r = new createjs.Container();
                                        r.addChild(new createjs.Shape());
                                        r.addChild(new createjs.Shape());
                                        r._type = 'handler';
                                        r.name = h.name;
                                        r.children[1].cursor = h.cursor;
                                        r.children[0].shadow = new createjs.Shadow(PB.HANDLER_SHADOW, 0, 2, 1);
                                        z.handlers[h.name] = r;
                                        var obounds = {};
                                        r.children[1].on('mousedown', function() {
                                                obounds = PB.Utils.cloneObj(z.bounds);
                                        }, false);

                                        r.children[1].on('pressmove', function(e) {
                                                console.log(r.name);
                                                var _bounds = PB.Utils.cloneObj(z.bounds);
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
                                                        z.cpX1 = e.stageX;
                                                        z.cpY1 = e.stageY;
                                                        var a = z.cpX1 - (z.bounds.x + z.bounds.width / 2);
                                                        var b = z.cpY1 - (z.bounds.y + z.bounds.height / 2);

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
                                                z.drawOutline();
                                                z.drawHandlers();
                                                z.changed = true;
                                        });

                                        r.children[1].on('mousedown', function() {
                                                z.backUp();
                                        });

                                        r.children[1].on('pressup', function() {
                                                z.undoManager.createUndo('change', z, z.backup, z.getInfo());
                                        });

                                }

                                z.shape.getStage().addChild(r);

                                r.center = {
                                        x: h.x,
                                        y: h.y
                                }
                                if (r.name == 'cp') {
                                        r.children[1].graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('yellow').drawCircle(h.x, h.y, 4);
                                } else {
                                        r.children[0].graphics.clear().beginFill('#fff').drawCircle(h.x, h.y, 8);
                                        r.children[1].graphics.clear().beginFill(PB.HANDLER_FILL_COLOR).drawCircle(h.x, h.y, 6);
                                }

                                z.shape.getStage().update();
                        })(i);
                }
        };

        PB.BoundShape = BoundShape;

})(createjs, paintBoard || {})