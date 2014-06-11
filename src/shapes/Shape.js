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
                        z.outline = new createjs.Shape();
                        z.outline.shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
                }
                if (!z.selected) {
                        var stage = this.shape.getStage();
                        var index = stage.getChildIndex(this.shape);
                        //console.log("outline",index, z.outline);
                        stage.addChildAt(z.outline, index);
                }
                var outlineObj = {
                        strokeColor: '#fff',
                        strokeSize: z.strokeSize + 6,
                        shape: z.outline,
                        bounds: z.bounds,
                        points: z.points,
                        startX: z.startX,
                        startY: z.startY,
                        endX: z.endX,
                        endY: z.endY,
                        type: 'outline'
                };

                this.rePaint.call(outlineObj);

        };

        PB.Shape = Shape;

})(createjs, paintBoard || {})