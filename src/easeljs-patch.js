;(function(c) {
	/** 
     * Extend easeljs Graphics
     =================================================*/
	c.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLen) {
		this.moveTo(x1, y1);

		var dX = x2 - x1;
		var dY = y2 - y1;
		var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
		var dashX = dX / dashes;
		var dashY = dY / dashes;

		var q = 0;
		while (q++ < dashes) {
			x1 += dashX;
			y1 += dashY;
			this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
		}
		this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
		return this;
	};

	c.Graphics.prototype.drawDashedRect = function(x1, y1, w, h, dashLen) {
		this.moveTo(x1, y1);
		var x2 = x1 + w;
		var y2 = y1 + h;
		this.dashedLineTo(x1, y1, x2, y1, dashLen);
		this.dashedLineTo(x2, y1, x2, y2, dashLen);
		this.dashedLineTo(x2, y2, x1, y2, dashLen);
		this.dashedLineTo(x1, y2, x1, y1, dashLen);
		return this;
	};

	var a = document.createElement('canvas');
	ctx = a.getContext('2d'),
	isSurpportSetLineDash = !!ctx.setLineDash,
	isSurpportEllipse = !!ctx.ellipse;

	delete a;
	if (isSurpportEllipse) {
		c.Graphics.prototype.drawEllipseByAngle = function(x, y, rx, ry, r, sa, ea, anti) {
			this._dirty = this._active = true;
			var z = this;
			this._activeInstructions.push(new c.Graphics.Command(z._ctx.ellipse, [x, y, rx, ry, r, sa, ea, anti]));

			return this;
		};
	}


	if (isSurpportSetLineDash) {
		c.Graphics.prototype.setLineDash = function(arr) {
			if (this._active) {
				this._newPath();
			}
			var z = this;
			this._strokeStyleInstructions.push(new c.Graphics.Command(z._ctx.setLineDash, [arr]));

			return this;
		};
	}
})(createjs);