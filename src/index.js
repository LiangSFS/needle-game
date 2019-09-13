
import Needle from "./needle.js";

import "./css/needle.css";

//export default Needle;
let needleGame = new Needle("#needle-game", {
 canvasWidth: 600,
 canvasHeight: 400,
 passNum: 20,    //一共有二十关
 polygonEdgeNum: 6 //六边形
});


needleGame.init();
////console.log(needle_game);