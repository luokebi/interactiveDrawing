;
(function(createjs, PB) {
    function LineShape() {
        this.startX = this.endX = this.startY = this.endY = 0
        this.baseType = 'LineShape';
        PB.Shape.apply(this, arguments);
    }

    PB.Utils.extend(LineShape, PB.Shape);

    LineShape.prototype.select = function() {
        this.drawOutline();
        this.drawHandlers();
        this.selected = true;
        //this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
    };

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
                        z.drawOutline();
                        z.drawHandlers();
                    });
                }

                z.shape.getStage().addChild(r);

                r.center = {
                    x: h.x,
                    y: h.y
                };

                r.children[0].graphics.clear().beginFill('#fff').drawCircle(h.x, h.y, 8);
                r.children[1].graphics.clear().beginFill(PB.HANDLER_FILL_COLOR).drawCircle(h.x, h.y, 6);
                z.shape.getStage().update();
            })(i);
        }
    };

    PB.LineShape = LineShape;

})(createjs, paintBoard || {});