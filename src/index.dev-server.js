import Needle from "./needle.js";

import './css/needle.css';

let needle_game = new Needle("#needleGame", {
 canvasWidth: 600,
 canvasHeight: 400,
 passNum: 20    //一共有六关
// polygonEdgeNum: 6 //六边形
});


needle_game.init();
//console.log(needle_game);
