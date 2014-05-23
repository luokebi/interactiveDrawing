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
        pb.mouseX = 0;
        pb.mouseY = 0;
        pb.stageX = 0;
        pb.stageY = 0;

        init();

        function init() {
            pb.stage.enableMouseOver(10);
            pb.stage.on('stagemousedown', mouseDown, false);
        }

        function mouseDown(e) {
            console.log(!pb.shapeType);
            if (!pb.shapeType) {
                return;
            } else if (pb.hoverShape) {
                return;
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
                    if (document.getElementById('temp_input').style.display == 'none') {
                        pb.textX = e.stageX;
                        pb.textY = e.stageY;
                    }
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

        



        /******Utils******/
        function extend(Child, Parent) {
            var F = function() {};　　　　
            F.prototype = Parent.prototype;　　　　
            Child.prototype = new F();　　　　
            Child.prototype.constructor = Child;　　　　
            Child.uber = Parent.prototype;
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
                s.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
                s.getStage().update();
            }, false);

            s.addEventListener('mouseout', function() {
                pb.hoverShape = false;
                s.shadow = null;
                s.getStage().update();
            }, false);
        };


        /****Rectangle***/
        function Rect(x, y) {
            Shape.apply(this, arguments);
        };

        extend(Rect, Shape);

        Rect.prototype.rePaint = function() {
            var z = this;
            z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
            z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
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