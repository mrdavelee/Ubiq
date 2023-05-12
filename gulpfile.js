const   gulp = require('gulp'),
        sass = require('gulp-sass')(require('sass')),
        postcss = require('gulp-postcss'),
        autoprefixer = require('autoprefixer'),
        runSequence = require('gulp4-run-sequence').use(gulp),
        del = require('del'),
        path = require('path'),
        nano = require('gulp-cssnano'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        fs = require('fs'),
        gulpif = require('gulp-if')


const processors = [
	autoprefixer({
		browsers: ['last 3 version']
	})
]

// Super tasks //

gulp.task('build', done => {
	runSequence('clean', 'scripts', 'sass', 'fonts', 'copy')
	done()
})


// Standard tasks



gulp.task('clean', () => {
	return del(['dest'])
})


gulp.task('sass', () => {
	console.log(`Building...`)
	return gulp.src(`src/scss/main.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		//.pipe( sourcemaps.write('.') )
		.pipe(nano())
		.pipe(rename('master-frontend.css'))
		.pipe(gulp.dest(`dest/css`))
})


gulp.task('copy', () => {
	if (fs.existsSync(`Assets/icons`)) {
		gulp.src(`Assets/icons/**/*`)
		.pipe(gulp.dest(`dest/icons`))
	}

	if (fs.existsSync(`Assets/sass/svg/css`)) {
		gulp.src(`Assets/sass/svg/css/sprite*.svg`)
		.pipe(gulp.dest(`dest/css`))
		gulp.src(`Assets/sass/svg/css/sprite*.png`)
		.pipe(gulp.dest(`dest/css`))
	}

	if (fs.existsSync(`Assets/video`)) {
		return gulp.src(`Assets/video/**/*`)
		.pipe(gulp.dest(`dest/video`))
	}
})


gulp.task('scripts', () => {
	return gulp.src('Scripts/dev/*.js')
	  .pipe(concat('all.js'))
	  .pipe(gulp.dest('dest/js'));
  });


// Supplementary tasks

gulp.task('mini', () => {
	return gulp.src(`src/css/*.css`)
	.pipe(postcss(processors))
		//.pipe( sourcemaps.write('.') )
		.pipe(nano())
		.pipe(nano())
		.pipe(gulp.dest(`dest/css`))
})
// functions to come soon

// Watch tasks

gulp.task('watch', () => {
	console.log(`Watching...`)
	gulp.watch(`src/**/*.scss`, gulp.series('sass'))
	gulp.watch(`Scripts/**/*.js`, gulp.series('scripts'))
})

gulp.task('watch:mini', () => {
	console.log(`Watching external CSS...`)
	gulp.watch(`src/css/*.css`, gulp.series('mini'))
})