(function(createjs, PB) {

	function UndoManager(stage) {
		this.undos = [];
		this.redos = [];
		this.stage = stage;
	}


	UndoManager.prototype.createUndo = function(type, shape, oldInfo, newInfo, container) {
		switch (type) {
			case 'change':
			    if (shape.changed) {
					var command = new UndoManager.shapeChange(shape, oldInfo, newInfo);
			    }
				break;
			case 'create':
				var command = new UndoManager.shapeCreate(shape, container);
				break;
			case 'remove':
				var command = new UndoManager.shapeRemove(shape, container);
				break;
		}

		if (command) {
			this.undos.push(command);
			this.redos = [];
			shape.changed = false;
			console.log('createUndo');
		}

		if (this.onChangeHandler) {
			this.onChangeHandler.call(null, this.canUndo(), this.canRedo());
		}

	};

	UndoManager.prototype.undo = function() {
		if (!this.canUndo()) {
			return;
		}
		var u = this.undos.pop();
		u.undo();
		this.redos.push(u);
		if (this.onChangeHandler) {
			this.onChangeHandler.call(null, this.canUndo(), this.canRedo());
		}
	};

	UndoManager.prototype.redo = function() {
		if (!this.canRedo()) {
			return;
		}
		var r = this.redos.pop();
		r.redo();
		this.undos.push(r);
		if (this.onChangeHandler) {
			this.onChangeHandler.call(UndoManager, this.canUndo(), this.canRedo());
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
		_do: function(type) {
			var s = this.shape,
				o = (type === 'undo') ? this.oInfo : this.nInfo;

			if (s.baseType === 'BoundShape') {
				s.bounds = o.bounds;
				if (s.subType === 'pic') {
					s.shape.x = o.x;
					s.shape.y = o.y;
					s.shape.scaleX = o.scaleX;
					s.shape.scaleY = o.scaleY;
				}
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
				s.shape.x = o.x;
				s.shape.y = o.y;

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

	UM.shapeCreate = function(s, container) {
		this.shape = s;
		this.container = container;
		console.log(this.container);
	};

	UM.shapeCreate.prototype = {
		undo: function() {
			this.container.removeChild(this.shape.shape);
		},
		redo: function() {
			this.container.addChild(this.shape.shape);
		}
	};


	UM.shapeRemove = function(s, container) {
		this.shape = s;
		this.container = container;
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