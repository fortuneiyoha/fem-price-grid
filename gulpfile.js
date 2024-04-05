// Initialize modules
const { src, dest, watch, task, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const purgecss = require("gulp-purgecss");

// Define file paths for SCSS source files and CSS output files
const paths = {
  scssSource: "assets/scss/**/*.scss",
  cssOutput: "dist/**/*.css",
};

// Sass task: compiles the style.scss file into style.min.css
function scssTask() {
  return src(paths.scssSource, { sourcemaps: true })
    .pipe(sass({ outputStyle: "compressed" })) // compile SCSS to CSS
    .pipe(postcss([autoprefixer()])) // PostCSS plugins
    .pipe(rename({ extname: ".min.css" })) // Adds the ".min.css" extension suffix
    .pipe(dest("dist", { sourcemaps: "." })); // put final CSS in dist folder with sourcemap
}

// Clean CSS Task: Removes unused CSS from bootstraps source files
function cleanCSS() {
  return src(paths.cssOutput)
    .pipe(purgecss({ content: ["*.html"] }))
    .pipe(dest("dist"));
}

// Cache Busting Task: Updates the version of the stylesheet
function cacheBustTask() {
  var cbString = new Date().getTime();
  return src(["*.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

// Watch task: watch SCSS files for changes
function watchTask() {
  watch(paths.scssSource, series(scssTask, cleanCSS, cacheBustTask));
}

// Define the default task with series of tasks to run
exports.default = series(scssTask, cleanCSS, cacheBustTask, watchTask);
