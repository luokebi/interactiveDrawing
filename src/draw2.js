;
(function() {
    function PaintBoard(canvas) {
        var pb = this;
        pb.canvas = document.getElementById(canvas);
        pb.stage = new createjs.Stage(canvas);
        pb.shapeType = 'rect';
        pb.strokeColor = '#f00';
        pb.color = '#f00';
        pb.textSize = '24px';
        pb.textFamily = "Arial";
        pb.strokeSize = 8;
        pb.creating = false;
        pb.hoverShape = false;
        pb.modifyText = false;
        pb.shapeType = null;
        pb.mouseX = 0;
        pb.mouseY = 0;
        pb.stageX = 0;
        pb.stageY = 0;

        init();

        function init() {
            pb.stage.addEventListener('stagemousedown', function(e) {
                var s = new Shape(e.stageX, e.stageY);
                pb.stage.addChild(s.shape);
                pb.stage.update();
            });
        }

        /*******Shapes*******/
        function Shape(x, y) {
            this.bounds = {
                x: x,
                y: y,
                width: 0,
                height: 0
            };

            this._startX = 0;
            this._startY = 0;
            this.strokeColor = pb.strokeColor;
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

            s.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
            s.hitArea.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);

            s.addEventListener('mouseover', function() {
                console.info('shape mouseover');
                pb.hoverShape = true;
                s.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                pb.hoverShape = false;
                s.shadow = null;
                s.getStage().update();
            }, false);


        };


    }

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

    PaintBoard.prototype.toDataURL = function(mimeType) {
        return this.stage.toDataURL(null, mimeType);
    };



    window.PaintBoard = PaintBoard;
})();