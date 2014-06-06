;
(function(createjs, PB) {
        function LineShape() {
                this.startX = this.endX = this.startY = this.endY = 0
                this.baseType = 'LineShape';
                PB.Shape.apply(this, arguments);
        }

        PB.Utils.extend(LineShape, PB.Shape);

        PB.LineShape = LineShape;

})(createjs, paintBoard || {})