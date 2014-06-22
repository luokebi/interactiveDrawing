;
(function(createjs, PB) {
    function LineShape() {
        this.startX = this.endX = this.startY = this.endY = this.cpX1 = this.cpY1 = this.cpX2 = this.cpY2 = 0;
        this.baseType = 'LineShape';
        PB.Shape.apply(this, arguments);
    }

    PB.Utils.extend(LineShape, PB.Shape);

    LineShape.prototype.drawHandlers = function() {
        var z = this,
            handlers = [{
                name: 'start',
                cursor: 'pointer',
                x: z.startX,
                y: z.startY
            }, {
                name: 'end',
                cursor: 'pointer',
                x: z.endX,
                y: z.endY
            }];

        if (z.subType === 'curveArrow') {
            handlers.push({
                name: 'control_1',
                cursor: 'pointer',
                x: z.cpX1,
                y: z.cpY1
            });
            handlers.push({
                name: 'control_2',
                cursor: 'pointer',
                x: z.cpX2,
                y: z.cpY2
            });
        }

        for (var i = 0, n = handlers.length; i < n; i++) {
            (function(i) {
                var h = handlers[i],
                    r = z.handlers[h.name];

                if (!r) {
                    var r = new createjs.Container();
                    r.addChild(new createjs.Shape());
                    r.addChild(new createjs.Shape());
                    r.children[1].cursor = h.cursor;
                    r.children[0].shadow = new createjs.Shadow(PB.HANDLER_SHADOW, 0, 2, 1);
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
                        } else if (r.name === 'start') {
                            sx = e.stageX;
                            sy = e.stageY;
                            ex = z.endX;
                            ey = z.endY;
                        } else if (r.name === 'control_1') {
                            z.cpX1 = e.stageX;
                            z.cpY1 = e.stageY;
                        } else if (r.name === 'control_2') {
                            z.cpX2 = e.stageX;
                            z.cpY2 = e.stageY;
                        }

                        console.log(r.name);
                        z.startX = sx ? sx : z.startX;
                        z.startY = sy ? sy : z.startY;
                        z.endX = ex ? ex : z.endX;
                        z.endY = ey ? ey : z.endY;
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
                };

                //r.children[0].graphics.clear().setStrokeStyle(1).beginStroke('#eee').lineTo(z.startX, z.startY).lineTo(z.cpX1, z.cpY1).lineTo(z.cpX2, z.cpY2).lineTo(z.endX, z.endY).endStroke();
                r.children[0].graphics.clear().beginFill('#fff').drawCircle(h.x, h.y, 8);
                r.children[1].graphics.clear().beginFill(PB.HANDLER_FILL_COLOR).drawCircle(h.x, h.y, 6);
                z.shape.getStage().update();
            })(i);
        }
    };

    PB.LineShape = LineShape;

})(createjs, paintBoard || {});