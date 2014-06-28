var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var srcs = [

	// easeljs patch
	"src/easeljs-patch.js",

	// core
	"src/bootstrap.js",
	"src/UndoManager.js",
	"src/Board.js",
	"src/Utils.js",

	// shapes
	"src/shapes/Shape.js",
	"src/shapes/BoundShape.js",
	"src/shapes/LineShape.js",
	"src/shapes/Rect.js",
	"src/shapes/Ellipse.js",
	"src/shapes/Line.js",
	"src/shapes/Arrow.js",
	"src/shapes/FreeLine.js",
	"src/shapes/FreeArrow.js",
	"src/shapes/Text.js",
	"src/shapes/Pic.js",
	"src/shapes/Blur.js",
	"src/shapes/SpeechBubble.js"

];

gulp.task('build', function() {
	return gulp.src(srcs)
		.pipe(concat('paintBoard.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});
