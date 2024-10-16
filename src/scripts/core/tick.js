import { Game } from "./game.js";
import { UTILS } from "./utils.js";
import gameMgr from "../game/gameMgr.js";
document.addEventListener("DOMContentLoaded", async () => {
    const data = await UTILS.assets.fetchJson('/src/scripts/core/game.json', true)
    console.log("data:", data);
    if (data) {
        console.log("data is there and it is", data);
        const GAME = new Game(data);
        const fpsCounter = await UTILS.debug.compteurFps();
        const NEWGAME = new gameMgr.FallingSand(GAME);
        GAME.startGame(NEWGAME);
        NEWGAME.initPixelGrid();
        NEWGAME.startMove(GAME);
        const tick = now => {
            GAME.tick(now);
            NEWGAME.tick(now);
            requestAnimationFrame(tick);
            console.log("tick");
        }
        requestAnimationFrame(tick);
    } else { console.log("Cannot get Data") }
})