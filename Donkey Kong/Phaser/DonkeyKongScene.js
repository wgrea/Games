// DonkeyKongScene.js

export default class DonkeyKongScene extends Phaser.Scene {
  constructor() {
    super("DonkeyKongScene");
  }

  preload() {
    // Load tileset, spritesheets, etc.
    this.load.tilemapTiledJSON("map", "assets/25m.json"); // Tiled map of 25m stage
    this.load.image("tiles", "assets/tileset.png");
    this.load.spritesheet("mario", "assets/mario.png", { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("barrel", "assets/barrel.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("pauline", "assets/pauline.png");
    this.load.image("ladder", "assets/ladder.png");
    // ...load other assets as needed
  }

  create() {
    // --- TILEMAP & LEVEL SETUP ---
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    this.platformLayer = map.createLayer("Platforms", tileset, 0, 0);
    this.ladderLayer = map.createLayer("Ladders", tileset, 0, 0);

    this.platformLayer.setCollisionByProperty({ collides: true });

    // --- PLAYER SETUP ---
    this.player = this.physics.add.sprite(32, 232, "mario");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(12, 16, true); // Adjust Mario's collision box

    // --- BARRELS GROUP ---
    this.barrels = this.physics.add.group({
      defaultKey: "barrel",
      bounceX: 1,
      bounceY: 0,
      collideWorldBounds: true
    });

    // --- DONKEY KONG BARREL THROW TIMER ---
    this.time.addEvent({
      delay: 2000,
      callback: this.throwBarrel,
      callbackScope: this,
      loop: true
    });

    // --- LADDER OVERLAP OBJECTS ---
    this.ladders = this.physics.add.staticGroup();
    map.getObjectLayer("LaddersObj").objects.forEach(obj => {
      const ladder = this.ladders.create(obj.x + obj.width / 2, obj.y + obj.height / 2, "ladder");
      ladder.setSize(obj.width, obj.height).setVisible(false);
    });

    // --- PAULINE (GOAL) ---
    const goalObj = map.findObject("Objects", obj => obj.name === "Pauline");
    this.pauline = this.physics.add.staticSprite(goalObj.x, goalObj.y, "pauline");

    // --- COLLECTIBLES ---
    this.collectibles = this.physics.add.staticGroup();
    map.getObjectLayer("Items").objects.forEach(obj => {
      this.collectibles.create(obj.x + 8, obj.y + 8, "item"); // Assuming 16x16
    });

    // --- PHYSICS COLLIDERS & OVERLAPS ---
    this.physics.add.collider(this.player, this.platformLayer);
    this.physics.add.collider(this.barrels, this.platformLayer, this.barrelPlatformCollide, null, this);
    this.physics.add.collider(this.barrels, this.barrels);
    this.physics.add.overlap(this.player, this.barrels, this.playerHit, null, this);
    this.physics.add.overlap(this.player, this.ladders, this.handleLadder, null, this);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.pauline, this.rescuePauline, null, this);

    // --- CONTROLS ---
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- ANIMATIONS ---
    this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("mario", { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "idle", frames: [{ key: "mario", frame: 0 }], frameRate: 1 });
    this.anims.create({ key: "jump", frames: [{ key: "mario", frame: 3 }], frameRate: 1 });
    this.anims.create({ key: "climb", frames: this.anims.generateFrameNumbers("mario", { start: 4, end: 5 }), frameRate: 6, repeat: -1 });

    // --- SCORE & LIVES ---
    this.score = 0;
    this.lives = 3;
    this.scoreText = this.add.text(4, 4, "SCORE: 0", { fontSize: "12px", fill: "#fff" }).setScrollFactor(0);
    this.livesText = this.add.text(4, 18, "LIVES: 3", { fontSize: "12px", fill: "#fff" }).setScrollFactor(0);

    // --- STATE ---
    this.onLadder = false;
    this.climbing = false;
  }

  // --- BARREL THROWING LOGIC ---
  throwBarrel() {
    // DK's position - hardcoded or from map
    const x = 32, y = 32;
    const barrel = this.barrels.create(x, y, "barrel");
    barrel.setVelocityX(60);
    barrel.setBounce(1, 0);
    barrel.setGravityY(400);
    barrel.setData("rollingLeft", true); // Roll left at start
    barrel.setData("onLadder", false);
  }

  // --- BARREL/PLATFORM COLLISION LOGIC ---
  barrelPlatformCollide(barrel, platform) {
    // If at edge, reverse direction
    // If overlapping with a ladder, 25% chance to drop down
    if (this.physics.overlap(barrel, this.ladders) && Phaser.Math.Between(0, 3) === 0 && !barrel.getData("onLadder")) {
      barrel.setVelocityX(0);
      barrel.setVelocityY(60);
      barrel.setData("onLadder", true);
    } else {
      // Change direction if at edge
      if (barrel.body.blocked.left) {
        barrel.setVelocityX(60);
        barrel.setData("rollingLeft", false);
      }
      if (barrel.body.blocked.right) {
        barrel.setVelocityX(-60);
        barrel.setData("rollingLeft", true);
      }
      barrel.setData("onLadder", false);
    }
  }

  // --- PLAYER/BARREL COLLISION LOGIC ---
  playerHit(player, barrel) {
    barrel.disableBody(true, true);
    this.lives--;
    this.livesText.setText(`LIVES: ${this.lives}`);
    if (this.lives <= 0) {
      this.scene.restart();
    } else {
      // Reset player to start
      player.setPosition(32, 232);
    }
  }

  // --- PLAYER/LADDER LOGIC ---
  handleLadder(player, ladder) {
    this.onLadder = true;
  }

  // --- PLAYER/ITEM LOGIC ---
  collectItem(player, item) {
    item.disableBody(true, true);
    this.score += 100;
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  // --- PLAYER/PAULINE LOGIC ---
  rescuePauline(player, pauline) {
    this.score += 5000;
    this.scoreText.setText(`SCORE: ${this.score}`);
    // Next level or win logic here
    this.scene.start("WinScene"); // Assume there's a win scene
  }

  update() {
    // --- LADDER STATE RESET ---
    this.onLadder = false;

    // --- UPDATE COLLISIONS ---
    this.physics.world.overlap(this.player, this.ladders, this.handleLadder, null, this);

    // --- PLAYER CONTROLS ---
    if (this.onLadder && (this.cursors.up.isDown || this.cursors.down.isDown)) {
      // Climb
      this.player.body.setAllowGravity(false);
      this.player.setVelocityY((this.cursors.down.isDown ? 1 : -1) * 60);
      this.player.setVelocityX(0);
      this.player.anims.play("climb", true);
      this.climbing = true;
    } else {
      this.player.body.setAllowGravity(true);
      this.climbing = false;
      // Left/Right
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-80);
        if (this.player.body.onFloor()) {
          this.player.anims.play("run", true);
        }
        this.player.setFlipX(true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(80);
        if (this.player.body.onFloor()) {
          this.player.anims.play("run", true);
        }
        this.player.setFlipX(false);
      } else {
        this.player.setVelocityX(0);
        if (this.player.body.onFloor() && !this.climbing) this.player.anims.play("idle", true);
      }
      // Jumping
      if (this.cursors.up.isDown && this.player.body.onFloor() && !this.climbing) {
        this.player.setVelocityY(-160);
        this.player.anims.play("jump", true);
      }
    }
    // Ladder exit logic
    if (!this.onLadder && this.climbing) {
      this.player.body.setAllowGravity(true);
      this.climbing = false;
    }
  }
}