;
(function(createjs, PB) {
        function Shape(conf) {
                this.strokeColor = conf.strokeColor;
                this.strokeSize = conf.strokeSize;
                this.alpha = conf.alpha;
                this.config = conf;
                this.handlers = [];
                this.outline = null;
                this.selected = false;
        }

        Shape.prototype.bringToTop = function() {
                var z = this,
                        stage = z.shape.getStage(),
                        index = stage.getChildIndex(z.shape),
                        num = stage.getNumChildren();

                stage.addChildAt(z.shape, num);
        };

        Shape.prototype.drawOutline = function() {
                var z = this;
                if (!z.outline) {
                        z.outline = new createjs.Container();
                        z.outline.addChild(new createjs.Shape());
                        z.outline.addChild(new createjs.Shape());

                        z.outline.children[1].shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
                        z.outline.children[1]._type = 'outline';
                }
                if (!z.selected) {
                        var stage = this.shape.getStage();
                        var index = stage.getChildIndex(this.shape);
                        console.log("outline", index, z.outline);
                        var oindex = index === 0 ? 0 : index - 1;
                        stage.addChildAt(z.outline, index);
                }
                var outlineObj = {
                        strokeColor: '#fff',
                        strokeSize: z.strokeSize + 6,
                        shape: z.outline.children[1],
                        bounds: z.bounds,
                        points: z.points,
                        startX: z.startX,
                        startY: z.startY,
                        endX: z.endX,
                        endY: z.endY,
                        cpX1: z.cpX1,
                        cpY1: z.cpY1,
                        cpX2: z.cpX2,
                        cpY2: z.cpY2,
                        type: 'outline'
                };

                if (z.subType === 'curveArrow') {
                        z.outline.children[0].shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
                        z.outline.children[0].graphics.clear().setStrokeStyle(1).beginStroke('#fff').lineTo(z.startX, z.startY).lineTo(z.cpX1, z.cpY1).lineTo(z.cpX2, z.cpY2).lineTo(z.endX, z.endY);
                }

                this.rePaint.call(outlineObj);


        };

        PB.Shape = Shape;

})(createjs, paintBoard || {})