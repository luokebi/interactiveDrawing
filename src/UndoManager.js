(function(createjs, PB) {
	function UndoManager(stage) {
		this.undos = [];
		this.stage = stage;
	}

	UndoManager.prototype.createUndo = function() {
		console.log('createUndo');
		var ninja_stage = this.stage.clone();
		this.undos.push(ninja_stage);
	};

	UndoManager.prototype.undo = function() {
		var ninja_stage = this.undos.pop();
		this.stage.removeAllChildren();
		for(var i = 0, n = ninja_stage.children.length; i < n; i++) {
			this.stage.addChild(children[i]);
		}

		this.stage.update();
	};

	PB.UndoManager = UndoManager;
})(createjs, paintBoard);