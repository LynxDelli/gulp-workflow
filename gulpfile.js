var gulp = require('gulp'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  gulpif = require('gulp-if'),
  notify = require('gulp-notify'),
  pkg = require('./package.json'),
  codePath = pkg.codePath,
  buildPath = pkg.developmentBuildPath,
  browserSync = require('browser-sync'),
  jsDdependencies = pkg.jsDependencies,
  cssDependencies = pkg.cssDependencies,
  bowerPath = "./bower/",
  nodePath = "./node_modules/";

var vendorTask = function (options) {
  var  browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    start = new Date(),
    vendorsBundler = browserify({
      debug: true,
      require: jsDdependencies
    });

  // Run the vendor bundle
  console.log('Building VENDORS bundle');
  vendorsBundler.bundle()
    .pipe(source('vendors.js'))
    .pipe(gulp.dest(buildPath + 'js'))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      startBuild(options);
    }));
};

var scriptTask = function (options) {
  var  gulpBrowserify = require('gulp-browserify'),
    browserify = require('browserify'),
    watchify = require('gulp-watchify'),
    reactify = require('reactify'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    browserifyOptions = {
      transform: 'reactify',
      debug: options.devBuild
    },
    run,
    url = codePath + 'js/main.js';

  if (options.watch) {
    browserifyOptions['cache'] = {};
    browserifyOptions['packageCache'] = {};
    browserifyOptions['fullPaths'] = true;
    browserifyOptions.entries = url;

    var runTask = browserify(browserifyOptions);
    runTask.external(jsDdependencies);

    run = function () {
      var start = Date.now();
      console.log('Building APP bundle');
      runTask.bundle()
        .pipe(gulpif(options.devBuild, plumber({
          errorHandler: onError
        })))
        .pipe(source('main.js'))
        .pipe(gulp.dest(buildPath + 'js'))
        .pipe(gulpif(options.watch, browserSync.reload({stream:true})))
        .pipe(notify(function () {
          console.log('END JS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
  } else {
    run = function () {
      var start = Date.now();

      console.log('Start building JS bundle');

      gulp.src(url)
        .pipe(gulpif(options.devBuild, plumber({
          errorHandler: onError
        })))
        .pipe(gulpBrowserify(browserifyOptions))
        .pipe(concat('main.js'))
        .pipe(gulpif(options.minify, stripDebug()))
        .pipe(gulpif(options.minify, uglify()))
        .pipe(gulp.dest(buildPath + 'js'))
        .pipe(notify(function () {
          console.log('END JS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
  }

  run ();

  if (options.watch) {
    gulp.watch(codePath + '**/*/*.js', run);
  }
};

var cssTask = function (options) {
  var minifyCSS = require('gulp-minify-css'),
    less = require('gulp-less'),
    src = cssDependencies;

  src.push(codePath + '**/*.less');

  var run = function () {
    var start = Date.now();

    console.log('Start building CSS/LESS bundle');

    gulp.src(src)
      .pipe(gulpif(options.devBuild, plumber({
        errorHandler: onError
      })))
      .pipe(concat('main.css'))
      .pipe(less())
      .pipe(gulpif(options.minify, minifyCSS()))
      .pipe(gulp.dest(buildPath + 'css'))
      .pipe(gulpif(options.devBuild, browserSync.reload({stream:true})))
      .pipe(notify(function () {
        console.log('END CSS/LESS built in ' + (Date.now() - start) + 'ms');
      }));
  };

  run();

  if (options.watch) {
    gulp.watch(src, run);
  }
};

var htmlTask = function (options) {
  var minifyHTML = require('gulp-minify-html'),
    inject = require('gulp-inject'),
    src = codePath + 'index.html';

  var run = function () {
    var start = Date.now();

    console.log('Start building HTML');

    gulp.src(src)
      .pipe(gulpif(options.devBuild, plumber({
        errorHandler: onError
      })))
      .pipe(gulpif(options.minify, minifyHTML()))
      .pipe(gulp.dest(buildPath))
      .pipe(notify(function () {
        console.log('END HTML in ' + (Date.now() - start) + 'ms');
        if (options.watch) {
          gulp.src(buildPath + 'index.html')
            .pipe(inject(gulp.src(buildPath + 'js/vendors.js', {read: false}), {relative: true}))
            .pipe(gulp.dest(buildPath))
            .pipe(browserSync.reload({stream:true}));
        }
      }));
  };

  run();

  if (options.watch) {
    gulp.watch(src, run);
  }
};

var language = function (options, cb) {
  var src = codePath + 'language/*.json';

  var run = function () {
    var start = Date.now();

    console.log('Start building Language');
    gulp.src(src)
      .pipe(gulp.dest(buildPath + 'language'))
      .pipe(notify(function () {
        console.log('END building Language in ' + (Date.now() - start) + 'ms');
        //cb(options); // run as much language files you have looking for solution
      }));
  };

  run();

  if (options.watch) {
    gulp.watch(src, run);
  }
};

var copyFiles = function () {

  var run = function () {
    var start = Date.now();

    console.log('Start copy files');
    var task = gulp;
    gulp.src([nodePath + 'bootstrap/dist/fonts*/**/*', codePath + 'language/*.json', codePath + 'images*/**/*'])
      .pipe(gulp.dest(buildPath))
      .pipe(notify(function () {
        console.log('END copy files in ' + (Date.now() - start) + 'ms');
      }));
  };

  run();
};

gulp.task('copy', function () {
  copyFiles();
});

gulp.task('default', function () {
  var options = {
    devBuild: false,
    minify: true,
    watch: false
  };

  startBuild (options);
});

gulp.task('jshint', function() {
  var jshint = require('gulp-jshint');

  return gulp.src(codePath + 'js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('dev', function () {
  var options = {
    devBuild: true,
    minify: false,
    watch: false
  };

  startBuild (options);
});

gulp.task('watch', function () {
  var options = {
    devBuild: true,
    minify: false,
    watch: true
  };

  vendorTask (options);

  browserSync({
    server: {
      baseDir: "./build/ui"
    }
  });
});

gulp.task('vendorBuild', function () {
  vendorTask();
});

function startBuild (options) {
  //language(options, scriptTask); // looking for sync solution
  scriptTask(options);
  cssTask(options);
  htmlTask(options);
}

function onError (err) {
  console.log(err);
}