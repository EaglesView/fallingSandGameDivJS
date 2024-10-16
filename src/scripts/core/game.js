import { UTILS } from "./utils.js";
export class Game {
    constructor(data) {
        this.resolution = { x: data.game.resolution.x, y: data.game.resolution.y };
        this.node = document.querySelector("#game");
        this.context = "none" //sera utile pour ajouter des contextes d'écran
        this.settings = data.game.settings;
    }

    setWindowFrameStatic(x = this.resolution.x, y = this.resolution.y) {
        this.node.style.width = y + "px";
        this.node.style.height = y + "px";
    }
    //Set la taille en temps réel selon la taille de fenêtre
    setWindowFrameFullscreen() {
        this.node.style.width = window.innerWidth + "px";
        this.node.style.height = window.innerHeight + "px";
    }

    // fonctions de contexte
    setContext(newContext) {
        this.context = newContext;
    }

    getContext() {
        return this.context;
    }

    //tick du jeu
    tick(now) {
        if (this.settings.video.isFullscreen == true) {
            this.setWindowFrameFullscreen();
        }
        if (this.settings.game.isDebug == true) {
            UTILS.debug.activateDebug(this.settings.debug, now);
        }
    }

    init() {
        let data = UTILS.assets.fetchJson('/src/scripts/core/game.json', true);
        return data;
    }

    startGame(game) {
        game.startGame(this);
    }

}