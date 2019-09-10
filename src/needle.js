const baseOptions = require("./baseOptions.js");


export default class Needle 
{
  constructor(gameWrap, options) {
    this._options = { ...options, ...baseOptions};

    this.rotateBallGaps = [];
    
    this.currentLevel = 1;

    let elementWrap;
    let canvasWidth = this._options.canvasWidth;
    let canvasHeight = this._options.canvasHeight;
    try
    {
      elementWrap  = document.querySelector(gameWrap);
    }
    catch (err)
    {
      return new TypeError("couldn`t find the DOM element");
    }
    elementWrap.style.cssText = `
                height: ${canvasHeight}px;
				width: ${canvasWidth}px;
				margin:60px auto;
				position:relative;
				transform-style:preserve-3d;
				perspective:3000px; 
                /*transform: rotateX(45deg) rotateY(45deg);*/
    `;
    //所有canvas元素背景色
    let bgColors = [];

    //共有多少关， 就有多少canvas 元素
    let elementContentFragment = document.createDocumentFragment(); 
    for (let i=0, len = this._options.passNum;i < len;i++) {
       let newBgColor = this.randomBgColor(bgColors);
       let elementEachPass = document.createElement("canvas");
       elementEachPass.className = 'each-pass';
       
       let innerAnglePolygons =  360 / this._options.passNum; //多边形内角 每一个面与其下一个面旋转过的角度
       let tanValueInnerAngle = Math.tan(innerAnglePolygons * Math.PI / 360)  //转化为弧度的 一半多边形内角 的 正切值
      elementEachPass.width = canvasWidth ;
      elementEachPass.height = canvasHeight ;
       elementEachPass.style.cssText = `
          background-color: ${newBgColor};  
          transform: rotateX( ${i * innerAnglePolygons}deg) translateZ(${canvasHeight /( 2 * tanValueInnerAngle)}px);
       `;
       elementContentFragment.appendChild(elementEachPass);
    } 
    
    //console.log(elementContentFragment, this._options.passNum);

    elementWrap.appendChild(elementContentFragment);

    //console.log(elementWrap);
  }

  //canvas dom元素的背景色
  randomBgColor(allBgColor) {
    let newBgColor;
    do
    {
      let r = Math.random() * 255;
      let g = Math.random() * 255;
      let b = Math.random() * 255;

      newBgColor = `rgb(${r}, ${g}, ${b})`;
    }
    while (allBgColor.includes(newBgColor));
   
    allBgColor.push(newBgColor);
    
    return newBgColor;
  }
  init() {

    this.rotateBallNum = this._options.rotateBallNum;
    this.insertBallNum = this._options.insertBallNum;
    this.rotateGap = this._options.rotateGap;
    
    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;

    //旋转小球会撞击的最大角度
    this.rotateBallCrashRad = Math.acos((Math.pow(rotateLineLength, 2)*2-Math.pow(rotateBallRange*2, 2))/(2*Math.pow(rotateLineLength, 2)));
 
    this.currentCvs = document.querySelectorAll('canvas.each-pass')[this.currentLevel-1];

    this.createRotateBallData();
    this.drawRotateBall();
    this.drawCenterBall();
    
    this.drawAnimtion();
    
  }
  createRotateBallData() {
    let crashRad = this.rotateBallCrashRad;
    let ballGaps = this.rotateBallGaps;
    let rotateBallNum = this.rotateBallNum;
    let rotateLineLength = this._options.rotateLineLength;

    let currentcurrentCvs = this.currentCvs;
    let currentcurrentCtx = currentcurrentCvs.getContext('2d');
    let randEachGap;
    for(let i = 0, len = rotateBallNum;i < len; i++) {
      do{
          randEachGap = Math.random() * Math.PI * 2;

        } while(ballGaps.some(item => Math.abs(item.ballGap-randEachGap) < crashRad));

      //console.log(currentcurrentCvs,currentcurrentCtx);

       let x = currentcurrentCvs.width/2+Math.cos(randEachGap)*rotateLineLength;
	   let y = currentcurrentCvs.height/2+Math.sin(randEachGap)*rotateLineLength;
       ballGaps.push({
         "xNum": x,
         "yNum": y,
         "ballGap": randEachGap,
         "originRotateBall": true
       });
    }
    
    
  }
  
  drawCenterBall() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext('2d');
    
    let centerBallRange = this.currentCvs.height/12;

    currentCtx.beginPath();
	currentCtx.lineWidth = 2;
	currentCtx.fillStyle = 'white';
	currentCtx.strokeStyle = "brown";
    currentCtx.arc(currentCvs.width/2,currentCvs.height/2,centerBallRange,0,Math.PI*2);
    currentCtx.closePath();
    currentCtx.fill();
    currentCtx.stroke();
    
    currentCtx.font = '30px impact';
    currentCtx.fillStyle = 'black';
    currentCtx.textAlign = 'center';
    currentCtx.textBaseline = "middle";
    currentCtx.fillText(this.currentLevel,currentCvs.width/2,currentCvs.height/2);
  }

  drawRotateBall() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext('2d');

    let ballGaps = this.rotateBallGaps;
    let rotateGap = this.rotateGap;
    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;

    let rotateBallColor = this._options.rotateBallColor;
    for(let i = 0, len = ballGaps.length;i < len;i++){
        
        ballGaps[i].ballGap += rotateGap;
        currentCtx.beginPath();
        currentCtx.lineWidth = 2;
        currentCtx.strokeStyle = rotateBallColor;
        currentCtx.fillStyle = rotateBallColor;
        let x = currentCvs.width/2+Math.cos(ballGaps[i].ballGap)*rotateLineLength;
        let y = currentCvs.height/2+Math.sin(ballGaps[i].ballGap)*rotateLineLength;
        
        ballGaps[i].xNum = x;
        ballGaps[i].yNum = y;
    
        currentCtx.moveTo(currentCvs.width/2, currentCvs.height/2);
        currentCtx.lineTo(x,y);
        currentCtx.closePath();
        currentCtx.stroke();
        currentCtx.arc(x,y,rotateBallRange,0,Math.PI*2);
        currentCtx.fill();
        if(!ballGaps[i].originRotateBall){
            currentCtx.font = fontSize+'px impact';
            currentCtx.fillStyle = 'black';
            currentCtx.textAlign = 'center';
            currentCtx.textBaseline = "middle";
            currentCtx.fillText(ballGaps[i].num,x,y);
        }
    }

    //console.log(this.rotateBallGaps);

  }
  drawAnimtion() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext('2d');

    let animateFun = (function(){
       return  window.requestAnimationFrame       ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame    ||
               function( callback ){
                 window.setTimeout(callback, 1000 / 60);
               };
    })();

    let animateCallBack = () => {
       currentCtx.clearRect(0,0,currentCvs.width,currentCvs.height);
       this.drawRotateBall();
       this.drawCenterBall();
       setTimeout(animateCallBack, 100);
    };

    setTimeout(animateCallBack, 100);
  
  }

}


