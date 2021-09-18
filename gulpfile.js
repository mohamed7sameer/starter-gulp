const   {gulp,src,dest,watch,series} = require('gulp');
const   sass = require('gulp-sass');
const   pug = require('gulp-pug');
const   livereload = require('gulp-livereload');
const   childProcess = require("child_process");
const   autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
const htmlreplace = require('gulp-html-replace');


function xSassMini(){
    console.log("***********xSassMini*************")
    return src('src/assets/sass/*.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(dest(`dist/assets/css`))
        .pipe(livereload());
}


function xPugMini(){
    console.log("***********xPugMini*************")
    return src('src/pug/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(htmlreplace({
            'css': 'css/style.css?nocach=' + (Math.floor(Math.random() * 10000000000) + 1),
            'js': 'js/script.js?nocach=' + (Math.floor(Math.random() * 10000000000) + 1)
        }))
        .pipe(dest('dist'))
        .pipe(livereload())

}




function cssLibs(){
    console.log("************cssLibs************")
    return src('src/assets/css/*.css')
        .pipe(dest('dist/assets/css/libs'))
        .pipe(livereload());
}



function fonts(){
    console.log("************fonts************")
    return src('src/assets/css/fonts/*')
    .pipe(dest('dist/assets/css/libs/fonts'))
}

function fonts2(){
    console.log("************fonts************")
    return src('src/assets/css/webfonts/*')
    .pipe(dest('dist/assets/css/webfonts'))
}

function javascriptMini(){
    console.log("***********javascript*************")
    return src('src/assets/js/*.js')
        .pipe(babel({
            presets: ['@babel/env'],
            comments: false,
            minified: true
        }))
        .pipe(dest(`dist/assets/js/`))
        .pipe(livereload());
}


function javaScriptLibs(){
    console.log("************javaScriptLibs************")
    return src('src/assets/js/libs/*.js')
    .pipe(dest('dist/assets/js/libs'))
    .pipe(livereload());
}


function imgs(){
    console.log("************imgs************")
    return src('src/assets/assets/imgs/**')
        .pipe(dest('dist/assets/assets/imgs'))
        .pipe(livereload());
}


function server(){
    console.log("***********server*************")
    require('./server.js')
}






function exAll(){
    console.log("***********exports.default*************")
    childProcess.exec('rmdir dist /S /Q')
    setTimeout(function(){
        xSassMini()
        cssLibs()
        fonts()
        xPugMini()
        javascriptMini()
        javaScriptLibs()
        imgs()
        server()
        fonts2()
        livereload.listen();
        watch('src/sass/*.sass',series(xSassMini,xPugMini));
        watch(['src/pug/*.pug','src/pug/**/*.pug'], series(xPugMini));
        watch('src/js/*.js', series(javascriptMini,xPugMini));
        watch('src/js/libs/*.js', series(javaScriptLibs));
    },3000)
}




exports.default = series(exAll)

