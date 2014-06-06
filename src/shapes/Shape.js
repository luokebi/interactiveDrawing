;
(function(createjs, PB) {
        function Shape(conf) {
                this.strokeColor = conf.strokeColor;
                this.strokeSize = conf.strokeSize;
                this.alpha = conf.alpha;
                this.handlers = [];
        }

        Shape.prototype.bringToTop = function() {
                var z = this,
                        stage = z.shape.getStage(),
                        index = stage.getChildIndex(z.shape),
                        num = stage.getNumChildren();

                stage.addChildAt(z.shape, num);
        };

        PB.Shape = Shape;

})(createjs, paintBoard || {})