import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Generate placeholder textures
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Player (Blue square)
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("player", 32, 32);
    graphics.clear();

    // Enemy (Red square)
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("enemy", 32, 32);
    graphics.clear();

    // Wall (Gray square)
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("wall", 32, 32);
    graphics.clear();

    // Grass (Green square)
    graphics.fillStyle(0x228b22, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("grass", 32, 32);
    graphics.clear();

    // Field/Crop (Yellow square)
    graphics.fillStyle(0xdaa520, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("crop", 32, 32);
    graphics.clear();

    // Barricade (Brown square)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("barricade", 32, 32);
    graphics.clear();

    // Sword Hitbox (White transparent)
    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("hitbox", 32, 32);
    graphics.clear();

    // Loot (Gold coin)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture("loot_gold", 16, 16);
    graphics.clear();

    // Stone (Textured rugger rock)
    graphics.fillStyle(0x757575, 1);
    graphics.fillCircle(16, 16, 14);
    graphics.fillStyle(0x9e9e9e, 1);
    graphics.fillCircle(10, 10, 6); // Highlight
    graphics.fillStyle(0x424242, 1);
    graphics.fillCircle(20, 22, 5); // Shadow
    graphics.generateTexture("stone", 32, 32);
    graphics.clear();

    // Loot Stone (Small gray rectangle)
    graphics.fillStyle(0x757575, 1);
    graphics.fillRect(2, 2, 12, 12);
    graphics.generateTexture("loot_stone", 16, 16);
    graphics.clear();

    // Gate (Dark Brown rectangle)
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRect(14, 0, 4, 32); // Vertical bar
    graphics.generateTexture("gate", 32, 32);
    graphics.clear();

    // Wood (Brown rectangle)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(0, 4, 16, 8);
    graphics.generateTexture("loot_wood", 16, 16);
    graphics.clear();

    // Tree (Green circle on brown rectangle)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(12, 20, 8, 12); // Trunk
    graphics.fillStyle(0x006400, 1);
    graphics.fillCircle(16, 12, 12); // Leaves
    graphics.generateTexture("tree", 32, 32);
    graphics.clear();

    // Well (Blue-gray stone circle)
    graphics.fillStyle(0x546e7a, 1);
    graphics.fillCircle(16, 16, 14);
    graphics.fillStyle(0x0288d1, 1);
    graphics.fillCircle(16, 16, 8); // Water center
    graphics.generateTexture("well", 32, 32);
    graphics.clear();

    // Growing states for crops
    // Stage 0: Soil
    graphics.fillStyle(0x5d4037, 1);
    graphics.fillRect(2, 2, 28, 28);
    graphics.generateTexture("crop_soil", 32, 32);
    graphics.clear();

    // Stage 1: Sprout (Crop)
    graphics.fillStyle(0x5d4037, 1);
    graphics.fillRect(2, 2, 28, 28);
    graphics.fillStyle(0x7cfc00, 1);
    graphics.fillCircle(16, 18, 4); // Center leaf
    graphics.fillCircle(12, 20, 3); // Left leaf
    graphics.fillCircle(20, 20, 3); // Right leaf
    graphics.generateTexture("crop_sprout", 32, 32);
    graphics.clear();

    // Wild Herb (sprout used for herbs in world)
    graphics.fillStyle(0x00ff00, 1); // Bright neon green base
    graphics.fillCircle(16, 16, 8);
    graphics.fillStyle(0x006400, 1);
    graphics.fillCircle(12, 12, 4); // Depth
    graphics.fillCircle(20, 20, 4); // Depth
    graphics.generateTexture("sprout", 32, 32);
    graphics.clear();

    // Stage 2: Ready
    graphics.fillStyle(0x5d4037, 1);
    graphics.fillRect(2, 2, 28, 28);
    graphics.fillStyle(0xffeb3b, 1);
    graphics.fillCircle(16, 16, 10); // Golden harvest
    graphics.generateTexture("crop_ready", 32, 32);
    graphics.clear();
  }

  create() {
    this.scene.start("GameScene");
  }
}
