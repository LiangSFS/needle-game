import Needle from "./needle.js";

import './css/needle.css';

let needle_game = new Needle("#needle_game", {
 canvasWidth: 600,
 canvasHeight: 400,
 passNum: 6
});


needle_game.init();
//console.log(needle_game);
