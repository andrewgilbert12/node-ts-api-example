const gulp = require('gulp');
const ts = require('gulp-typescript');
const OTHER_FILES = ['src/*.json', 'src/**/*.json', 'src/**/*.csv'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(OTHER_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts', 'assets']);
