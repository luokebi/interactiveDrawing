;
(function() {
	var pathParser = {};
	
	pathParser.parsePathData = function(data) {
		// Path Data Segment must begin with a moveTo
		//m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
		//M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
		//l (x y)+  Relative lineTo
		//L (x y)+  Absolute LineTo
		//h (x)+    Relative horizontal lineTo
		//H (x)+    Absolute horizontal lineTo
		//v (y)+    Relative vertical lineTo
		//V (y)+    Absolute vertical lineTo
		//z (closepath)
		//Z (closepath)
		//c (x1 y1 x2 y2 x y)+ Relative Bezier curve
		//C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
		//q (x1 y1 x y)+       Relative Quadratic Bezier
		//Q (x1 y1 x y)+       Absolute Quadratic Bezier
		//t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
		//T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
		//s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
		//S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
		//a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
		//A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

		// return early if data is not defined
		if (!data) {
			return [];
		}

		// command string
		var cs = data;

		// command chars
		var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
		// convert white spaces to commas
		cs = cs.replace(new RegExp(' ', 'g'), ',');
		// create pipes so that we can split the data
		for (var n = 0; n < cc.length; n++) {
			cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
		}
		// create array
		var arr = cs.split('|');
		var ca = [];
		// init context point
		var cpx = 0;
		var cpy = 0;
		for (n = 1; n < arr.length; n++) {
			var str = arr[n];
			var c = str.charAt(0);
			str = str.slice(1);
			// remove ,- for consistency
			str = str.replace(new RegExp(',-', 'g'), '-');
			// add commas so that it's easy to split
			str = str.replace(new RegExp('-', 'g'), ',-');
			str = str.replace(new RegExp('e,-', 'g'), 'e-');
			var p = str.split(',');
			if (p.length > 0 && p[0] === '') {
				p.shift();
			}
			// convert strings to floats
			for (var i = 0; i < p.length; i++) {
				p[i] = parseFloat(p[i]);
			}
			while (p.length > 0) {
				if (isNaN(p[0])) { // case for a trailing comma before next command
					break;
				}

				var cmd = null;
				var points = [];
				var startX = cpx,
					startY = cpy;
				// Move var from within the switch to up here (jshint)
				var prevCmd, ctlPtx, ctlPty; // Ss, Tt
				var rx, ry, psi, fa, fs, x1, y1; // Aa


				// convert l, H, h, V, and v to L
				switch (c) {

					// Note: Keep the lineTo's above the moveTo's in this switch
					case 'l':
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'L';
						points.push(cpx, cpy);
						break;
					case 'L':
						cpx = p.shift();
						cpy = p.shift();
						points.push(cpx, cpy);
						break;

						// Note: lineTo handlers need to be above this point
					case 'm':
						var dx = p.shift();
						var dy = p.shift();
						cpx += dx;
						cpy += dy;
						cmd = 'M';
						// After closing the path move the current position 
						// to the the first point of the path (if any). 
						if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
							for (var idx = ca.length - 2; idx >= 0; idx--) {
								if (ca[idx].command === 'M') {
									cpx = ca[idx].points[0] + dx;
									cpy = ca[idx].points[1] + dy;
									break;
								}
							}
						}
						points.push(cpx, cpy);
						c = 'l';
						// subsequent points are treated as relative lineTo
						break;
					case 'M':
						cpx = p.shift();
						cpy = p.shift();
						cmd = 'M';
						points.push(cpx, cpy);
						c = 'L';
						// subsequent points are treated as absolute lineTo
						break;

					case 'h':
						cpx += p.shift();
						cmd = 'L';
						points.push(cpx, cpy);
						break;
					case 'H':
						cpx = p.shift();
						cmd = 'L';
						points.push(cpx, cpy);
						break;
					case 'v':
						cpy += p.shift();
						cmd = 'L';
						points.push(cpx, cpy);
						break;
					case 'V':
						cpy = p.shift();
						cmd = 'L';
						points.push(cpx, cpy);
						break;
					case 'C':
						points.push(p.shift(), p.shift(), p.shift(), p.shift());
						cpx = p.shift();
						cpy = p.shift();
						points.push(cpx, cpy);
						break;
					case 'c':
						points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'C';
						points.push(cpx, cpy);
						break;
					case 'S':
						ctlPtx = cpx;
						ctlPty = cpy;
						prevCmd = ca[ca.length - 1];
						if (prevCmd.command === 'C') {
							ctlPtx = cpx + (cpx - prevCmd.points[2]);
							ctlPty = cpy + (cpy - prevCmd.points[3]);
						}
						points.push(ctlPtx, ctlPty, p.shift(), p.shift());
						cpx = p.shift();
						cpy = p.shift();
						cmd = 'C';
						points.push(cpx, cpy);
						break;
					case 's':
						ctlPtx = cpx;
						ctlPty = cpy;
						prevCmd = ca[ca.length - 1];
						if (prevCmd.command === 'C') {
							ctlPtx = cpx + (cpx - prevCmd.points[2]);
							ctlPty = cpy + (cpy - prevCmd.points[3]);
						}
						points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'C';
						points.push(cpx, cpy);
						break;
					case 'Q':
						points.push(p.shift(), p.shift());
						cpx = p.shift();
						cpy = p.shift();
						points.push(cpx, cpy);
						break;
					case 'q':
						points.push(cpx + p.shift(), cpy + p.shift());
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'Q';
						points.push(cpx, cpy);
						break;
					case 'T':
						ctlPtx = cpx;
						ctlPty = cpy;
						prevCmd = ca[ca.length - 1];
						if (prevCmd.command === 'Q') {
							ctlPtx = cpx + (cpx - prevCmd.points[0]);
							ctlPty = cpy + (cpy - prevCmd.points[1]);
						}
						cpx = p.shift();
						cpy = p.shift();
						cmd = 'Q';
						points.push(ctlPtx, ctlPty, cpx, cpy);
						break;
					case 't':
						ctlPtx = cpx;
						ctlPty = cpy;
						prevCmd = ca[ca.length - 1];
						if (prevCmd.command === 'Q') {
							ctlPtx = cpx + (cpx - prevCmd.points[0]);
							ctlPty = cpy + (cpy - prevCmd.points[1]);
						}
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'Q';
						points.push(ctlPtx, ctlPty, cpx, cpy);
						break;
					case 'A':
						rx = p.shift();
						ry = p.shift();
						psi = p.shift();
						fa = p.shift();
						fs = p.shift();
						x1 = cpx;
						y1 = cpy;
						cpx = p.shift();
						cpy = p.shift();
						cmd = 'A';
						points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
						break;
					case 'a':
						rx = p.shift();
						ry = p.shift();
						psi = p.shift();
						fa = p.shift();
						fs = p.shift();
						x1 = cpx;
						y1 = cpy;
						cpx += p.shift();
						cpy += p.shift();
						cmd = 'A';
						points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
						break;
				}

				ca.push({
					command: cmd || c,
					points: points
				});
			}

			if (c === 'z' || c === 'Z') {
				ca.push({
					command: 'z',
					points: []
				});
			}
		}

		return ca;
	};


	pathParser.convertEndpointToCenterParameterization = function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
		// Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		var psi = psiDeg * (Math.PI / 180.0);
		var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
		var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

		var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

		if (lambda > 1) {
			rx *= Math.sqrt(lambda);
			ry *= Math.sqrt(lambda);
		}

		var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

		if (fa === fs) {
			f *= -1;
		}
		if (isNaN(f)) {
			f = 0;
		}

		var cxp = f * rx * yp / ry;
		var cyp = f * -ry * xp / rx;

		var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
		var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

		var vMag = function(v) {
			return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
		};
		var vRatio = function(u, v) {
			return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
		};
		var vAngle = function(u, v) {
			return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
		};
		var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
		var u = [(xp - cxp) / rx, (yp - cyp) / ry];
		var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
		var dTheta = vAngle(u, v);

		if (vRatio(u, v) <= -1) {
			dTheta = Math.PI;
		}
		if (vRatio(u, v) >= 1) {
			dTheta = 0;
		}
		if (fs === 0 && dTheta > 0) {
			dTheta = dTheta - 2 * Math.PI;
		}
		if (fs === 1 && dTheta < 0) {
			dTheta = dTheta + 2 * Math.PI;
		}
		return [cx, cy, rx, ry, theta, dTheta, psi, fs];
	};

	window.pathParser = pathParser;
})();