"use strict";

var gulp      = require("gulp"),
    eslint    = require("gulp-eslint"),
    config    = require("./config/config.js"),
    postcss   = require("gulp-postcss"),
    stylelint = require("stylelint"),
    reporter  = require("postcss-reporter"),
    scss      = require("postcss-scss"),
    htmlhint  = require("gulp-htmlhint");


gulp.task("lint:js", function () {
  return gulp.src(config.lint.JS_FILES)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

gulp.task("lint:styles", function () {
  var processors = [
    stylelint(config.lint.options.STYLE),
    reporter({
      clearMessages: true,
      console: true
    })
  ];
  return gulp.src(config.lint.STYLE_FILES)
             .pipe(postcss(processors, {syntax: scss}))

});

gulp.task("lint:html", function () {
  return gulp.src(config.lint.HTML_FILES)
             .pipe(htmlhint(config.lint.options.HTML))
             .pipe(htmlhint.reporter("htmlhint-stylish"))
             .pipe(htmlhint.failReporter({suppress: false}));
});

gulp.task("lint:all", gulp.parallel("lint:js", "lint:html", "lint:styles", function(done) {
  console.log("lint all files OK!");
  done();
}));


gulp.task("default", gulp.series("lint:all"));
