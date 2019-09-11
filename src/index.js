
import Needle from "./needle.js";

import './css/needle.css';

let needle_game = new Needle("#needle_game", {
 canvasWidth: 950,
 canvasHeight: 580,
 rotateLineLength: 150,
 rotateBallRange: 20,
});


needle_game.init();
//console.log(needle_game);