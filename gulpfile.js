var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');

var src = 'view/';
var output = '../';

// Change into the src directory
process.chdir(src);

var createBrowserify = function () {
	return browserify({
		entries : './app.js',
		extensions : ['.jsx'], // Needed to find the React JSX source files.
		transform : [reactify],
		cache : {}, // Required by watchify.
		packageCache : {}, // Required by watchify.
		fullPaths : true
	});
};

var doBrowserify = function (bundle) {
	return bundle.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(rename('app.js'))
	.pipe(gulp.dest(output));
};

gulp.task('browserify', function () {
	var b = createBrowserify();
	return doBrowserify(b.bundle());
});

gulp.task('copy_direct', function () {
	gulp.src(['**/*.html', '**/*.png', 'favicon.ico', '**/*.css', 'jquery-2.1.4.min.js'], {
		buffer : false
	})
	.pipe(gulp.dest(output));
});


// The list of tasks to do by default
var tasklist = ['copy_direct', 'browserify'];

gulp.task('default',(function () {
    return tasklist;
})());
