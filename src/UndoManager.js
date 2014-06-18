(function(createjs, PB) {

	function UndoManager(stage) {
		this.undos = [];
		this.redos = [];
		this.stage = stage;
	}

	UndoManager.prototype.createUndo = function(type, shape, oldInfo, newInfo) {
		switch (type) {
			case 'boundChange':
				var command = new UndoManager.BoundChange(shape, oldInfo, newInfo);
				break;
			case 'create':
				var command = new UndoManager.shapeCreate(shape);
				break;
		}
		this.undos.push(command);
	};

	UndoManager.prototype.undo = function() {
		if (!this.canUndo()) {
			return;
		}
		var u = this.undos.pop();
		u.undo();
		this.redos.push(u);
		this.stage.update();
		if (this.onChangeHandler) {
			this.onChangeHandler.call(null, this.canUndo, this.canRedo);
		}
	};

	UndoManager.prototype.redo = function() {
		if (!this.canRedo()) {
			return;
		}
		var r = this.redos.pop();
		r.redo();
		this.undos.push(r);
		this.stage.update();
		if (this.onChangeHandler) {
			this.onChangeHandler.call(null, this.canUndo, this.canRedo);
		}
	};

	UndoManager.prototype.canUndo = function() {
		return this.undos.length > 0;
	};

	UndoManager.prototype.canRedo = function() {
		return this.redos.length > 0;
	};

	UndoManager.prototype.onChange = function(callback) {
		this.onChangeHandler = callback;
	};

	var UM = UndoManager;

	UM.BoundChange = function(s, oldInfo, newInfo) {
		this.shape = s;
		this.oInfo = oldInfo;
		this.nInfo = newInfo;
	}

	UM.BoundChange.prototype = {
		undo: function() {
			this.shape.bounds = this.oInfo;
			this.shape.rePaint();
		},

		redo: function() {
			this.shape.bounds = this.nInfo;
			this.shape.rePaint();
		}
	};

	UM.LineChange = function(s, oldInfo, newInfo) {
		this.shape = s;
		this.oInfo = oldInfo;
		this.nInfo = newInfo;
	}

	UM.LineChange.prototype = {
		undo: function() {
			this.shape.startX = this.oInfo.startX;
			this.shape.startY = this.oInfo.startY;
			this.shape.cpX1 = this.oInfo.cpX1;
			this.shape.cpY1 = this.oInfo.cpY1;
			this.shape.cpX2 = this.oInfo.cpX2;
			this.shape.cpY2 = this.oInfo.cpY2;
			this.shape.rePaint();
		},

		redo: function() {
			this.shape.bounds = this.nB;
			this.shape.rePaint();
		}
	};

	UM.shapeCreate = function(s) {
		this.shape = s;
		this.container = this.shape.shape.parent;
	};

	UM.shapeCreate.prototype = {
		undo: function() {
			this.container.removeChild(this.shape.shape);
		},
		redo: function() {
			this.container.addChild(this.shape.shape);
		}
	};


	UM.shapeRemove = function(s) {
		this.shape = s;
		this.container = this.shape.shape.parent;
	};

	UM.shapeRemove.prototype = {
		undo: function() {
			this.container.addChild(this.shape.shape);
		},
		redo: function() {
			this.container.removeChild(this.shape.shape);
		}
	};


	PB.UndoManager = UndoManager;
})(createjs, paintBoard);