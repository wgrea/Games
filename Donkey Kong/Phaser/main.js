// main.js
import Phaser from "phaser";
import DonkeyKongScene from "./DonkeyKongScene.js";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 256,
  backgroundColor: "#222",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: false
    }
  },
  scene: [DonkeyKongScene]
};

const game = new Phaser.Game(config);
export default game;