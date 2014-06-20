(function(createjs, PB) {

	function UndoManager(stage) {
		this.undos = [];
		this.redos = [];
		this.stage = stage;
	}


	UndoManager.prototype.createUndo = function(type, shape, oldInfo, newInfo) {
		switch (type) {
			case 'change':
				var command = new UndoManager.shapeChange(shape, oldInfo, newInfo);
				break;
			case 'create':
				var command = new UndoManager.shapeCreate(shape);
				break;
			case 'remove':
				var command = new UndoManager.shapeRemove(shape);
				break;
		}

		if (command) {
			this.undos.push(command);
		}

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

	UM.shapeChange = function(s, oldInfo, newInfo) {
		this.shape = s;
		this.oInfo = oldInfo;
		this.nInfo = newInfo;
	}

	UM.shapeChange.prototype = {
		_do: function (type) {
			var s = this.shape,
				o = (type === 'undo') ? this.oInfo : this.nInfo;
			
			if (s.baseType === 'BoundShape') {
				s.bounds = o.bounds;
			} else if (s.baseType === 'LineShape') {
				s.startX = o.startX;
				s.startY = o.startY;
				s.endX = o.endX;
				s.endY = o.endY;
				s.cpX1 = o.cpX1;
				s.cpY1 = o.cpY1;
				s.cpX2 = o.cpX2;
				s.cpY2 = o.cpY2;
			} else if (s.baseType === 'FreeShape') {

			}

			s.strokeColor = o.strokeColor;
			s.strokeSize = o.strokeSize;

			s.rePaint();
		},

		undo: function() {
			this._do('undo');
		},

		redo: function() {
			this._do('redo');
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