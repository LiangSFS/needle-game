"use strict";
const baseOptions = require("./baseOptions.js");

export default class Needle 
{
  constructor(gameWrap, options) {
    const sizeRatioMinLengthToRotateLineLength = 3.86;
    const sizeRatioRotateLineLengthToRotateBallRange = 7.5;
    this._options = {...baseOptions, ...options}; //_options 作为Needle构造器的内置属性

    const minLength = Math.min(this._options.canvasWidth, this._options.canvasHeight);

    this._options.rotateLineLength = this._options.rotateLineLength || minLength/sizeRatioMinLengthToRotateLineLength;
    this._options.rotateBallRange = this._options.rotateBallRange || this._options.rotateLineLength/sizeRatioRotateLineLengthToRotateBallRange;

    this.rotateBallGaps = [];  //与x轴正方向的夹角(在线长度已知时位置), 所有小球位置属性的集合[{ xNum: ,yNum }, ...]

    this.resetStart = false; //是重新开始在该canvas元素上的游戏还是第一次渲染
                //标志判断目的：如果是第一次已经在该canvas 元素上绑定点击事件 后面不用重复绑定
    
    this.currentLevel = 1;
    let canvasWidth = this._options.canvasWidth;
    let canvasHeight = this._options.canvasHeight;
 
    let elementWrap  = document.querySelector(gameWrap);
   
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

    ////共有多少关， 就有多少canvas 元素
    //   passNum      polygonEdgeNum    两者配置已分离
    let elementContentFragment = document.createDocumentFragment(); 

    let innerAnglePolygons =  360 / this._options.polygonEdgeNum; //多边形内角 每一个面与其下一个面旋转过的角度
    let tanValueInnerAngle = Math.tan(innerAnglePolygons * Math.PI / 360);  //转化为弧度的 一半多边形内角 的 正切值
      
    for (let i=0, len = this._options.polygonEdgeNum;i < len;i++) {
       let newBgColor = this.randomBgColor(bgColors);
       let elementEachPass = document.createElement("canvas");
       elementEachPass.className = "each-pass";
       
       elementEachPass.width = canvasWidth ;
       elementEachPass.height = canvasHeight ;
       elementEachPass.style.cssText = `
          background-color: ${newBgColor};  
          transform: rotateX( ${i * innerAnglePolygons}deg) translateZ(${canvasHeight /( 2 * tanValueInnerAngle)}px);
          transition: transform 1s;
       `;
       elementContentFragment.appendChild(elementEachPass);
    } 
    
    let elementModal = document.createElement("div");
       //elementModal.className = "needle-modal";

    elementModal.setAttribute("id", "needle-modal");

    elementModal.style.cssText = `
      padding-top: ${canvasHeight/2}px;
      transform:rotateX( ${(this.currentLevel - 1) * innerAnglePolygons}deg) translateZ( ${canvasHeight /( 2 * tanValueInnerAngle)}px);
    `;
    
    elementContentFragment.appendChild(elementModal);
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
    this.initOptions();

    this.bootLevelDifficulty();

    this.initGame();
   
  }
  bootLevelDifficulty() {
    let firstLevel = {
      rotateBallNum: this._options.rotateBallNum,
      insertBallNum: this._options.insertBallNum
    };
    let passGameNum = this._options.passNum;
    let rotateBallRange = this._options.rotateBallRange;
    let rotateLineLength = this._options.rotateLineLength;

    let eachRotateBallRad = 2 * Math.asin(rotateBallRange/rotateLineLength); //每一个旋转小球占用的整个圆的弧度
    let rotateBallCrashRad = this.rotateBallCrashRad;

    //剩余空间
    let restSpaceRad = Math.PI * 2 - (eachRotateBallRad * firstLevel.rotateBallNum + rotateBallCrashRad *  + firstLevel.rotateBallNum);

    let extraMaxInsertBallNum = Math.floor(restSpaceRad/(eachRotateBallRad + rotateBallCrashRad * 2));


    let allLevels = this.allLevels = [];
    
    let bootFrequerncy = this._options.bootFrequerncy; //每隔bootFrequerncy  关 难度增加一点
    
    let halfMaxInsertBallNum = Math.floor(extraMaxInsertBallNum/2);

    allLevels.push(firstLevel);
    for(let i = 0, len = passGameNum;i<len;i++) {
      if(!extraMaxInsertBallNum) { 
         console.log("已经是最高难度");
         break;
      }
      

      let isBootFreq = !((i + 1)%bootFrequerncy);
      //console.log(i, halfMaxInsertBallNum);
      let isChangeBootStyle = !!(i > halfMaxInsertBallNum); 

      //console.log(isBootFreq, isChangeBootStyle);
      let nextLevel = { 
        rotateBallNum:(isBootFreq && isChangeBootStyle)? allLevels[i].rotateBallNum + 1: allLevels[i].rotateBallNum,
        insertBallNum: (isBootFreq && !isChangeBootStyle)? allLevels[i].insertBallNum + 1: allLevels[i].insertBallNum
      }
      !isBootFreq && halfMaxInsertBallNum++;  //难度没有增加 随i值递增
      isBootFreq && extraMaxInsertBallNum--; //当难度增加时 才是增加了小球的时候
      
      allLevels.push(nextLevel);
      
    }
    //console.log(allLevels);
  }
  initGame() {

    //关卡难度增加
    //this.allLevels = [
//      {
//       rotateBallNum: 3,
//       insertBallNum: 6
//      },
//      {
//       rotateBallNum: 3,
//       insertBallNum：7
//       }
//       ....
//    ];
    // this.currentLevel  确定当前关卡难度
    let allLevels = this.allLevels;
    let maxLevelLength = allLevels.length;
    let currentLevel = this.currentLevel;

    this.rotateBallNum = currentLevel > maxLevelLength?allLevels[maxLevelLength - 1].rotateBallNum : allLevels[currentLevel - 1].rotateBallNum;
    this.insertBallNum = currentLevel > maxLevelLength?allLevels[maxLevelLength - 1].insertBallNum : allLevels[currentLevel - 1].insertBallNum;

    this.currentCvs = document.querySelectorAll("canvas.each-pass")[(this.currentLevel-1)%this._options.polygonEdgeNum];
    
    ( this.currentLevel <= this._options.polygonEdgeNum) && !this.resetStart && this.currentCvs.addEventListener("click", this.clickInsertBall.bind(this), false);

    this.createRotateBallData();
    this.drawRotateBall();
    this.drawCenterBall();
    this.drawUnderInsertBall();
    this.currentLevelMonitor();
    this.drawAnimtion();
  }
  //初始设置，不再发生变化
  initOptions() {  
    this.rotateGap = this._options.rotateGap;
    
    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;

    //旋转小球会撞击的最大角度
    this.rotateBallCrashRad = Math.acos((Math.pow(rotateLineLength, 2)*2-Math.pow(rotateBallRange*2, 2))/(2*Math.pow(rotateLineLength, 2)));
 
    
  }
  resetPublicInitOptions() {
     let elementModal = document.querySelector("#needle-modal");
     
     this.rotateBallGaps = [];
     elementModal.innerHTML = "";
     elementModal.className = "";
     clearTimeout(this.stopTimer);
  }
  nextPassGame () {
    let currentCvs = this.currentCvs;
    
    let currentCtx = currentCvs.getContext("2d");
   
    currentCtx.clearRect(0,0,currentCvs.width,currentCvs.height);

    this.resetStart = false;
    this.currentLevel++;


    this.resetPublicInitOptions();
     
    this.rotateCanvas();
    
    this.initGame();

  }
  resetGame () {

    this.resetPublicInitOptions();

    this.resetStart = true;

    this.initGame();
  }
  rotateCanvas() {
     let innerAnglePolygons =  360 / this._options.polygonEdgeNum; //多边形内角 每一个面与其下一个面旋转过的角度
     let tanValueInnerAngle = Math.tan(innerAnglePolygons * Math.PI / 360);  //转化为弧度的 一半多边形内角 的 正切值
 
     
     let canvasHeight = this._options.canvasHeight;

     let elementCanvasCollection = document.querySelectorAll("canvas.each-pass");
  
     let rotateCanvasDirection = this._options.rotateCanvasDirection;
     let  currentLevel = this.currentLevel;

     Array.from(elementCanvasCollection).forEach( (elm, i) => {
       let rotateDeg = (i - currentLevel + 1) * innerAnglePolygons;
       rotateDeg = rotateCanvasDirection?rotateDeg: rotateDeg*-1;
       
      
       elm.style.transform = `
         rotateX(${rotateDeg}deg) translateZ(${canvasHeight /( 2 * tanValueInnerAngle)}px)
       `;

       //console.log(currentLevel, rotateDeg, elm.style.transform);
     } );


  }

  stopAnimation(insertBallNum) {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext("2d");

    
    if(insertBallNum >= 0) {
      clearTimeout(this.stopTimer);
      currentCtx.clearRect(0,0,currentCvs.width,currentCvs.height);
      this.drawRotateBall("red");
      this.drawCenterBall();
      this.drawUnderInsertBall();
    }

  }
  createNextBtn () {
     let elementNextBtn = document.createElement("span");

     elementNextBtn.className = "next-btn";
     elementNextBtn.innerText = "下一关";

     elementNextBtn.addEventListener("click", this.nextPassGame.bind(this), false);

     return elementNextBtn;
  }
  createResetBtn() {
    let elementResetBtn = document.createElement("span");
    
    elementResetBtn.className = "reset-btn";
    elementResetBtn.innerText = "重新开始";

    elementResetBtn.addEventListener("click", this.resetGame.bind(this), false);
    

    return elementResetBtn;
  }
  createModalBtns(insertBallNum, isCrashed) {

    let elementModal = document.querySelector("#needle-modal");
    elementModal.className = "needle-modal";

    let currentLevel = this.currentLevel;
    let passGameNum = this._options.passNum;

    let elementResetBtn = this.createResetBtn();
     
    elementModal.appendChild(elementResetBtn);
    //  没有发生撞击  要插入的小球数量变为零  当前不是最后一关   
    if (!isCrashed && ( insertBallNum === 0 ) && ( currentLevel < passGameNum )) {
      let elementNextBtn = this.createNextBtn();
      elementModal.appendChild(elementNextBtn);
    }

  }

  currentLevelMonitor() {
    let monitorFun = (function(){
       return  window.requestAnimationFrame       ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame;    
    }());

    let monitorStop = (function() {
       return window.cancelAnimationFrame ||          
              window.mozCancelAnimationFrame;
    }());
    
    let CrashRad = this.rotateBallCrashRad;
    let stop;

    let isCrashFun = () => {
      let ballGaps = this.rotateBallGaps;
      for(let i = 0, len = ballGaps.length;i < len;i++) {
        for(let j=i+1;j<len;j++){
           let isCrashed = CrashRad >= Math.abs(ballGaps[i].ballGap%(Math.PI*2) - ballGaps[j].ballGap%(Math.PI*2));
             if(isCrashed) { return true };
           }
        }
    };
    let monitorCallBack = () => {
      //console.log(1);
          
          let insertBallNum = this.insertBallNum;
          let isCrashed = isCrashFun(); 
          if(isCrashed || !insertBallNum) {
            //console.log("error", insertBallNum, isCrashed);
            monitorStop(stop);
            isCrashed && this.stopAnimation(insertBallNum);
            this.createModalBtns(insertBallNum, isCrashed);
            
            return false;

        
        //console.log(CrashRad,ballGaps, insertBallNum);    
      }
      
      stop = monitorFun(monitorCallBack);
    };
    
    stop = monitorFun(monitorCallBack);
  }

  clickInsertBall() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext("2d");
  
    let ballGaps = this.rotateBallGaps;
    let insertBallNum = this.insertBallNum;

    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;
    let insertBallColor = this._options.rotateBallColor;

    let fontSize = rotateBallRange * .8;
    currentCtx.beginPath();
    currentCtx.strokeStyle = insertBallColor;
    currentCtx.fillStyle = insertBallColor;
    let x = currentCvs.width/2;
    let y = currentCvs.height/2+rotateLineLength;
    ballGaps.push({
         "xNum": x,
         "yNum": y,
         "ballGap": Math.PI/2,
         "insertBallNO": insertBallNum
       });
    this.insertBallNum--;
    currentCtx.moveTo(x, y);
    currentCtx.lineTo(currentCvs.width/2,currentCvs.height/2);
    currentCtx.closePath();
    currentCtx.stroke();
    currentCtx.arc(currentCvs.width/2,currentCvs.height/2+rotateLineLength,rotateBallRange,0,Math.PI*2);
    currentCtx.fill();
    
    currentCtx.font = fontSize+"px impact";
    currentCtx.fillStyle = "black";
    currentCtx.textAlign = "center";
    currentCtx.textBaseline = "middle";
    currentCtx.fillText(insertBallNum, x, y);
   
    this.drawCenterBall();
  }

  createRotateBallData() {
    let currentCvs = this.currentCvs;
    let currentcurrentCtx = currentCvs.getContext("2d");

    let crashRad = this.rotateBallCrashRad;
    let ballGaps = this.rotateBallGaps;
    let rotateBallNum = this.rotateBallNum;
    let rotateLineLength = this._options.rotateLineLength;

    let randEachGap;
    let isCorrectGap;
    for(let i = 0, len = rotateBallNum;i < len; i++) {
      do{
          randEachGap = Math.random() * Math.PI * 2;
          isCorrectGap = ballGaps.some(item => Math.abs(item.ballGap-randEachGap) < crashRad);//产生的球的位置 不与已存在的球相撞

        } while(isCorrectGap);

      //console.log(currentcurrentCvs,currentcurrentCtx);

       let x = currentCvs.width/2+Math.cos(randEachGap)*rotateLineLength;
       let y = currentCvs.height/2+Math.sin(randEachGap)*rotateLineLength;
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
    let currentCtx = currentCvs.getContext("2d");
    
    let centerBallRange = this.currentCvs.height/12;

    currentCtx.beginPath();
	currentCtx.lineWidth = 2;
	currentCtx.fillStyle = "white";
	currentCtx.strokeStyle = "brown";
    currentCtx.arc(currentCvs.width/2,currentCvs.height/2,centerBallRange,0,Math.PI*2);
    currentCtx.closePath();
    currentCtx.fill();
    currentCtx.stroke();
    
    currentCtx.font = "30px impact";
    currentCtx.fillStyle = "black";
    currentCtx.textAlign = "center";
    currentCtx.textBaseline = "middle";
    currentCtx.fillText(this.currentLevel,currentCvs.width/2,currentCvs.height/2);
  }

  drawRotateBall(rotateBallColor) {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext("2d");

    let ballGaps = this.rotateBallGaps;
    let rotateGap = this.rotateGap;
    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;
    
    rotateBallColor = rotateBallColor || this._options.rotateBallColor;

    //console.log(ballGaps, this.insertBallNum);    
    let fontSize = rotateBallRange * .8;
    ballGaps.length && ballGaps.forEach((ball, i) => {
      ball.ballGap += rotateGap;
        currentCtx.beginPath();
        currentCtx.lineWidth = 2;
        currentCtx.strokeStyle = rotateBallColor;
        currentCtx.fillStyle = rotateBallColor;
        let x = currentCvs.width/2+Math.cos(ball.ballGap)*rotateLineLength;
        let y = currentCvs.height/2+Math.sin(ball.ballGap)*rotateLineLength;
        
        ball.xNum = x;
        ball.yNum = y;
    
        currentCtx.moveTo(currentCvs.width/2, currentCvs.height/2);
        currentCtx.lineTo(x, y);
        currentCtx.closePath();
        currentCtx.stroke();
        currentCtx.arc(x, y, rotateBallRange, 0, Math.PI*2);
        currentCtx.fill();
        if(!ball.originRotateBall){
            currentCtx.font = fontSize+"px impact";
            currentCtx.fillStyle = "black";
            currentCtx.textAlign = "center";
            currentCtx.textBaseline = "middle";
            currentCtx.fillText(ball.insertBallNO, x, y);
        }
    });
    //console.log(this.rotateBallGaps);

  }
  drawUnderInsertBall() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext("2d");

    let underInsertBallNum = this.insertBallNum;

    let rotateLineLength = this._options.rotateLineLength;
    let rotateBallRange = this._options.rotateBallRange;
    
    let fontSize = rotateBallRange * .8;
    //console.log(underInsertBallNum);
    for(let i = 0;i < underInsertBallNum;i++) {
      currentCtx.beginPath();
      currentCtx.lineWidth = 2;
      currentCtx.fillStyle = "white";
      currentCtx.arc(currentCvs.width/2, currentCvs.height/2+rotateLineLength+rotateBallRange*2.5*(i+1), rotateBallRange, 0, Math.PI*2);
      currentCtx.fill();
      currentCtx.closePath();
      
      currentCtx.font = fontSize+"px impact";
      currentCtx.fillStyle = "black";
      currentCtx.textAlign = "center";
      currentCtx.textBaseline = "middle";
      currentCtx.fillText(underInsertBallNum-i,currentCvs.width/2,currentCvs.height/2+rotateLineLength+rotateBallRange*2.5*(i+1));
    }

  }

  drawAnimtion() {
    let currentCvs = this.currentCvs;
    let currentCtx = currentCvs.getContext("2d");
   
    

    let animateCallBack = () => {
       currentCtx.clearRect(0,0,currentCvs.width,currentCvs.height);
       this.drawRotateBall();
       this.drawCenterBall();
       this.drawUnderInsertBall();
       this.stopTimer = setTimeout(animateCallBack, 100);
    };

    this.stopTimer = setTimeout(animateCallBack, 100);
  
  }

}


