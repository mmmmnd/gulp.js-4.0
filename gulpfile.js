const gulp = require('gulp'),                       // gulp
  postcss = require("gulp-postcss"),                // css扩展
  sass = require('gulp-sass'),                      // sass 转 css
  cleanCss = require('gulp-clean-css'),             // css压缩
  autoprefixer = require("autoprefixer"),           // css前缀浏览器
  concat = require('gulp-concat'),                  // 合并文件
  gulpif = require('gulp-if'),                      // if语句
  uglify = require('gulp-uglify'),                  // js 压缩
  eslint = require('gulp-eslint'),                  // js语法检查
  del = require('del'),                             // 清除文件
  imagemin = require('gulp-imagemin'),              // 图片压缩
  rev = require('gulp-rev'),                        // 添加版本号
  revReplace = require('gulp-rev-replace'),         // 版本号替换
  useref = require('gulp-useref'),                  // 解析html资源定位
  connect = require('gulp-connect'),                // 创建web服务器
  babel = require('gulp-babel'),                    // es6转为es5语法
  htmlmin = require('gulp-htmlmin'),                // html压缩
  pxtoviewport = require('postcss-px-to-viewport'), // vw响应尺寸
  watch = require('gulp-watch'),                    // 监听
  viewportUnits = require('postcss-viewport-units');// css添加content


const CSS = 'style.min.css';                        // 生成总css
const JS = 'main.min.js';                           // 生成总js
const PATH = {
  "DIST": "./dist",                                 // 输出文件夹
  "HTML": "./*.html",                               // 查找根下所有html
  "CSS": "./css/*.{css,scss}",                      // 查找根下css
  "JS": "./js/*.js",                                // 查找根下js
  "IMG": "./img/*.{png,jpg,jpeg,gif,bmp,ico}",      // 查找根下img
  "DISTCSS": "./dist/css/",                         // 输出css文件
  "DISTJS": "./dist/js/",                           // 输出js文件
  "DISTIMG": "./dist/img",                          // 输出img文件
  "CSSIMPORT": "!./css/a/.*.scss",                  // 不引入scss文件夹
  "ISCSS": "!./css/" + CSS,                         // 不加载css
  "ISJS": "!./js/" + JS,                            // 不加载js
};


const AUTOPREFIXER = autoprefixer({
  overrideBrowserslist: [
    "> 1%", "last 2 versions", "not ie <= 8"
  ],                                                // 浏览器兼容
  cascade: false                                    // 是否美化属性值
});
const PXTOVIEWPORT = pxtoviewport({
  viewportWidth: 1920,                              // 设计稿宽度
  // viewportHeight: 1080,                          // 设计稿高度
  viewportUnit: 'vw',                               // px转vw
  unitPrecision: 3,                                 // 指定`px`转换为视窗单位值的小数位数
  minPixelValue: 1,                                 // 小于或等于`1px`不转换为视窗单位
  selectorBlackList: ['.ignore', '.hairlines'],     // 指定不转换为视窗单位的类，可以自定义
  mediaQuery: false                                 // 是否在媒体查询转换
});
const HTML = {
  removeComments: true,                             //清除HTML注释
  collapseWhitespace: true,                         //压缩HTML
  collapseBooleanAttributes: true,                  //省略布尔属性的值 <input checked="true"/> ==> <input />
  removeEmptyAttributes: true,                      //删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true,                 //删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true,              //删除<style>和<link>的type="text/css"
  minifyJS: true,                                   //压缩页面JS
  minifyCSS: true                                   //压缩页面CSS
};
const PROCESSORS = [PXTOVIEWPORT, AUTOPREFIXER, viewportUnits];


//图片压缩
const imageMin = () => {
  return gulp.src(PATH.IMG)
    .pipe(imagemin())
    .pipe(gulp.dest(PATH.DISTIMG));
};
//css压缩
const cssMin = () => {
  return gulp.src([PATH.CSS, PATH.CSSIMPORT, PATH.ISCSS])
    .pipe(sass())
    .pipe(concat(CSS))
    .pipe(postcss(PROCESSORS))
    .pipe(cleanCss())
};
// js 检测、转换、合并、压缩公共函数
const jsMin = () => {
  return gulp.src([PATH.JS, PATH.ISJS])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat(JS))
    .pipe(uglify())
};
// html压缩公共函数
const htmlMin = () => {
  return gulp.src(PATH.HTML)
    .pipe(htmlmin(HTML))
    .pipe(gulp.dest(PATH.DIST));
};


//dev任务，用于开发环境
gulp.task('image:dev', async () => {
  await imageMin().pipe(connect.reload());
});
gulp.task('css:dev', async () => {
  await cssMin().pipe(connect.reload())
    .pipe(gulp.dest('./css/'));
});
gulp.task('js:dev', async () => {
  await jsMin().pipe(connect.reload())
    .pipe(gulp.dest('./js/'));
});
gulp.task('html:dev', async () => {
  await htmlMin().pipe(connect.reload());
});


//build任务，用于生产环境
gulp.task('image:build', async () => {
  await imageMin();
});
gulp.task('css:build', async () => {
  await cssMin()
    .pipe(gulp.dest(PATH.DISTCSS));
});
gulp.task('js:build', async () => {
  await jsMin()
    .pipe(gulp.dest(PATH.DISTJS));
});
gulp.task('html:build', async () => {
  await htmlMin();
});

// 清空dist目录
gulp.task('clean', async () => {
  await del([PATH.DIST]);
});
//添加版本号
gulp.task('addVersion', async () => {
  await gulp.src([PATH.DISTCSS + "/*.css", PATH.DISTJS + "/*.js"])
    .pipe(rev())
    .pipe(gulpif('*.css', gulp.dest(PATH.DISTCSS), gulp.dest(PATH.DISTJS)))
    .pipe(rev.manifest())
    .pipe(gulp.dest(PATH.DIST))
})
//替换版本号
gulp.task('upVersion', async () => {
  var manifest = gulp.src(PATH.DIST + '/rev-manifest.json');
  await gulp.src(PATH.HTML)
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(useref())
    .pipe(gulp.dest(PATH.DIST))
});
// server任务
gulp.task('server', async () => {
  await connect.server(
    {
      root: './',
      port: 8080,
      livereload: true
    }
  )
});

// watch任务，监听源文件变化，执行对应开发任务
gulp.task('watch', () => {
  watch([PATH.CSS, PATH.ISCSS], gulp.series('css:dev'));
  watch([PATH.JS, PATH.ISJS], gulp.series('js:dev'));
  watch([PATH.IMG], gulp.series('image:dev'));
  watch([PATH.HTML], gulp.series('html:dev'));
});
// dev任务，启动开发环境
gulp.task('dev', gulp.series(gulp.parallel('watch', 'server')));
// build任务，用于生产环境下打包压缩源代码
gulp.task('build', gulp.series('clean', gulp.parallel('image:build', 'css:build', 'js:build')))
