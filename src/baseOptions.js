

module.exports = {
  canvasWidth: 950,  //必填  单位px
  canvasHeight: 580, //必填  单位px
  passNum: 4,      //选填  构成多边形 
  rotateBallNum: 3,  //选填  原有的旋转小球数
  insertBallNum: 5, //选填  要插入的小球数
  rotateGap: Math.PI/15,  //选填  旋转幅度
  rotateBallColor: "white",  ////选填  旋转小球的背景色
  //rotateLineLength: 150,
  //rotateBallRange: 20,
  rotateCanvasDirection: true  //true  向下翻转; false  反之
}