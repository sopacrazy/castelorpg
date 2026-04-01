import Phaser from "phaser";
import { useGameStore } from "../../store/gameStore";

export class UIScene extends Phaser.Scene {
  private inventoryKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("UIScene");
  }

  create() {
    if (this.input.keyboard) {
      this.inventoryKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.I,
      );
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
      useGameStore.getState().toggleInventory();
    }
  }
}
