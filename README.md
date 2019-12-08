# Gulp.js4.0 构造脚手架

### 1.常用API
> * gulp.src(globs[, options])
> 读取目录下的文件
> * gulp.dest(path[, options])
> 向目录写入文件
> * gulp.task(name[, deps], fn)
> 定义一个gulp任务
> * gulp.pipe()
> 将目标文件通过插件处理
> * gulp.watch(glob [, opts], tasks) 或 gulp.watch(glob [, opts, cb])
> 监视文件系统，并且可以在文件发生改动时候执行操作
> * gulp.series(task1, task2, task3) (gulp4新增) 
> 串行执行任务
> * gulp.parallel(task1, task2, task3) (gulp4新增) 
> 并行执行任务

> [具体可以参考gulp官网api](https://www.gulpjs.com.cn/docs/api/concepts/)

### 2.插件
> [gulp插件地址](https://gulpjs.com/plugins/)

| 插件       |  插件作用|
| --------    | ----------: |
|gulp        |      gulp   |
|gulp-postcss|css扩展|
|gulp-sass|sass 转 css|
|gulp-clean-css |css压缩|
|autoprefixer|css前缀浏览器|
|gulp-concat|合并文件|
|gulp-if|if语句|
|gulp-uglify|js 压缩|
|gulp-eslint|js语法检查|
|del|清除文件|
|gulp-imagemin|图片压缩|
|gulp-rev|添加版本号|
|gulp-rev-replace|版本号替换|
|gulp-useref|解析html资源定位|
|gulp-connect|创建web服务器|
|gulp-babel|es6转为es5语法|
|gulp-htmlmin|html压缩|
|postcss-px-to-viewport|vw响应尺寸|
|gulp-watch|监听|
|postcss-viewport-units|css添加content|



### 3.安装&&测试

> 全局安装 gulp
` npm install gulp -g`

> 查看版本号
`gulp -v`
> CLI version: 2.2.0
> Local version: 4.0.2

> 创建项目
`mkdir gulp && cd gulp `

> 初始化项目
`npm init -y`

> 配置本地环境
`npm install gulp --save-dev`

> 创建 gulpfile.js文件

>```
//本地引入
const gulp = require('gulp');
//gulp任务
>gulp.task('default', async () => {
  await console.log('hello gulp');
});
// hello gulp
>```

### 4.项目配置
* ####1.引入插件

    npm i  @babel/core gulp-watch autoprefixer del gulp gulp-babel gulp-clean-css gulp-concat gulp-connect gulp-eslint gulp-htmlmin gulp-if gulp-imagemin gulp-postcss gulp-rev gulp-rev-replace gulp-sass gulp-uglify gulp-useref postcss-px-to-viewport postcss-viewport-units --save-dev

* ####2.新增.eslintrc.js文件
```
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "no-cond-assign": 0,
    "no-empty": 0,
    "no-prototype-builtins": 0,
    "no-useless-escape": 0,
    "no-inner-declarations": 0,
    "no-undef": 0,
    "no-unused-vars": 0
  }
};
```
* ####3.设置文件路径
```
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
```

* #### 4. 新增常量配置
```
const AUTOPREFIXER = autoprefixer({
  overrideBrowserslist: [
    "> 1%", "last 2 versions", "not ie <= 8"
  ],                                                               // 浏览器兼容
  cascade: false                                           // 是否美化属性值
});
const PXTOVIEWPORT = pxtoviewport({
  viewportWidth: 1920,                                // 设计稿宽度
  // viewportHeight: 1080,                          // 设计稿高度
  viewportUnit: 'vw',                                    // px转vw
  unitPrecision: 3,                                       // 指定`px`转换为视窗单位值的小数位数
  minPixelValue: 1,                                     // 小于或等于`1px`不转换为视窗单位
  selectorBlackList: ['.ignore', '.hairlines'],   // 指定不转换为视窗单位的类，可以自定义
  mediaQuery: false                                   // 是否在媒体查询转换
});
const HTML = {
  removeComments: true,                           //清除HTML注释
  collapseWhitespace: true,                        //压缩HTML
  collapseBooleanAttributes: true,              //省略布尔属性的值 <input checked="true"/> ==> <input />
  removeEmptyAttributes: true,                 //删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true,           //删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true,      //删除<style>和<link>的type="text/css"
  minifyJS: true,                                        //压缩页面JS
  minifyCSS: true                                       //压缩页面CSS
};
const PROCESSORS = [PXTOVIEWPORT, AUTOPREFIXER, viewportUnits];
```

###  5.gulp
* ####1. gulp方法
```
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
```

* ####2. gulp dev开发方法
```
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
```
* ####3. gulp build压缩方法
```
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
// build任务，用于生产环境下打包压缩源代码
gulp.task('build', gulp.series('clean', gulp.parallel('image:build', 'css:build', 'js:build')))
```
* ####4. package.json 配置
```
 "scripts": {
    "dev": "gulp dev",
    "build": "gulp build && gulp addVersion && gulp upVersion && gulp html:build"
  },
```
###  6. 运行
`npm run dev`
运行开发环境
`npm run build`
 运行压缩环境