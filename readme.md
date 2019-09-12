# Usage

## Demo

![needle_game](/src/img/needle_game.png)

设置的配置options:

```javascript
let needle_game = new Needle("#needl_game", {
   canvasWidth: 600,
   canvasHeight: 400,
   passNum: 6,    // 六边形
});

needle_game.init();
```

## Base

html:

~~~html
<html>
  ---
<body>
    <div id="needle_game"></div>
</body>
</html>
~~~



js:

~~~javascript

  let needle_game = new Needle("#needl_game");
  
  needle_game.init();
~~~



```node
//本地模拟借用 webpack devServer  服务器

yarn   or   npm install          //安装依赖包

yarn start  or npm start   //在浏览器 打开 http://localhost:4000/ 
```



带上一些简单的配置

js :

~~~javascript
let needle_game = new Needle("#needl_game", {
  canvasWidth: 400,  //必填  单位px  盒子的大小
  canvasHeight: 200, //必填  单位px
  passNum: 6,      //选填  构成多边形 
  rotateBallNum: 3,  //选填  原有的旋转小球数
  insertBallNum: 5, //选填  要插入的小球数
  rotateGap: Math.PI/15,  //选填  旋转幅度
  rotateBallColor: "white",  ////选填  旋转小球的背景色
  //rotateLineLength: 150,  //选填  旋转线的长度 不填时根据盒子的大小缩放
  //rotateBallRange: 20,   //选填  旋转小球的半径 不填时根据盒子的大小缩放
  rotateCanvasDirection: true  //选填    true  切换关卡时画布是向下翻转; false  反之
});
  
needle_game.init();
~~~

这个项目还可以对baseOptions.js文件增添默认配置项，

old_files 文件夹中 存放着 重构以前的项目文件 (js css 均是内联形式 在html文件中)

关卡难度的增加可以通过增加 原有的小球数、要插入的小球数、旋转速度来实现