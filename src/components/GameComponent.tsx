import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { BootScene } from "../game/scenes/BootScene";
import { MainMenuScene } from "../game/scenes/MainMenuScene";
import { GameScene } from "../game/scenes/GameScene";
import { UIScene } from "../game/scenes/UIScene";

export const GameComponent = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-game-container",
      width: "100%",
      height: "100%",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 },
        },
      },
      scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: true,
      scene: [BootScene, MainMenuScene, GameScene, UIScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      id="phaser-game-container"
      className="w-full h-full flex items-center justify-center bg-black"
    />
  );
};
