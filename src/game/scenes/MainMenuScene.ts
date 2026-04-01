import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title
    this.add
      .text(width / 2, height / 3, "Fortaleza do Rosário", {
        fontSize: "48px",
        color: "#ffffff",
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Start Button
    const startBtn = this.add
      .text(width / 2, height / 2 + 50, "Iniciar Jogo", {
        fontSize: "32px",
        color: "#f27d26",
        fontFamily: "Inter, sans-serif",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on("pointerover", () => startBtn.setColor("#ffffff"));
    startBtn.on("pointerout", () => startBtn.setColor("#f27d26"));
    startBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
      this.scene.start("UIScene");
    });
  }
}
