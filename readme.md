# Usage

## Demo

![needle_game](/src/img/needle_game.png)

设置的配置options:

https://liangsfs.github.io/needle-game/ (使用Webpack已打包的静态资源以及HTML文件)

```javascript
//   该资源设置的配置 --- src/index.js
let needleGame = new Needle("#needl-game", {
   canvasWidth: 600,
   canvasHeight: 400,
   passNum: 20,    //一共有二十关
   polygonEdgeNum: 6 //六边形
});

needleGame.init();
```

## Base

HTML文件(在给定的一个DOM元素盒子中渲染游戏画布):

~~~html
<html>
  ---
<body>
    <div id="needle-game"></div> 
  <!--  该容器可以加样式 例如 overflow:hidden; 超出容器范围的部分隐藏，且根据BFC概念不会对该容器的兄弟元素或父元素造成影响   -->
</body>
</html>
~~~

JavaScript文件(调用该对象，初始化游戏)：

~~~javascript
  let needleGame = new Needle("#needl-game");
  
  needleGame.init();
~~~

本地模拟借用 Webpack中 devServer服务器

```node
//对应文件路径下 打开命令行工具

yarn   or   npm install          //安装依赖包

yarn start  or npm start   //在浏览器 打开 http://localhost:4000/ 
```

```javascript
// devServer服务器 设置的配置 --- src/index.dev-server.js

let needleGame = new Needle("#needl-game", {
  canvasWidth: 600,
  canvasHeight: 400,
  passNum: 20    //一共有六关
  // polygonEdgeNum: 6 //六边形  
});
  
needleGame.init();
```

JavaScript文件 (带上所有（暂定）的配置(默认值))：

~~~javascript
let needleGame = new Needle("#needl-game", {
  canvasWidth: 950,  //必填  单位px
  canvasHeight: 580, //必填  单位px
  bootFrequerncy: 3, //选填  每隔 bootFrequerncy  关 难度增加一点
  passNum: 6,        //选填 一共有多少关卡
  polygonEdgeNum: 4,   ////选填  构成多边形 
  rotateBallNum: 3,  //选填  原有的旋转小球数
  insertBallNum: 5, //选填  要插入的小球数
  rotateGap: Math.PI/15,  //选填  旋转幅度
  rotateBallColor: "white",  ////选填  旋转小球的背景色
  //rotateLineLength: 150,  //选填  旋转线的长度  不填时根据容器尺寸缩放
  //rotateBallRange: 20,   //选填  旋转小球的半径  不填时根据旋转线的长度缩放
  rotateCanvasDirection: true  //true  向下翻转; false  反之
});
  
needleGame.init();
~~~

这个项目还可以对baseOptions.js文件增添默认配置项，

old_files 文件夹中 存放着 重构以前的项目文件 (js css 均是内联形式 在html文件中)

- 19.9.10  项目开始  实现一个画布的小球转动 （项目初次提交时间Commits on Sep 10, 2019      19.9.10）

- 19.9.11  实现立体画布， 同时加上用户交互（点击）功能

- 19.9.12  关卡难度递增 方法bootLevelDifficulty() (在Needle 对象中 方法) 已实现增加配置项 bootFrequerncy ： 难度增加的频率

  （ 根据已给的数据计算小球极限数量值  ，增加原有小球或插入小球数）

- 19.9.13 一、将打包好的静态页面放入 gitHub pages 上

  ​              二、添加 postcss-loader    在加上 process.env.NODE_ENV 脚本设置

  ​              三、将画布的颜色css3 从 rgb() 转化为 十六进制  兼容  UC（brower）浏览器  

  （实测以上的UC 浏览器 以及  QQ浏览器、chrome 浏览器、firefox 浏览器均可运行）