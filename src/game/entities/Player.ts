import Phaser from "phaser";
import { useGameStore } from "../../store/gameStore";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: any;
  private attackKey: Phaser.Input.Keyboard.Key;
  private isAttacking: boolean = false;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 400; // ms
  private hitbox: Phaser.Physics.Arcade.Sprite;
  public facing: "up" | "down" | "left" | "right" = "down";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(10);

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = scene.input.keyboard.addKeys("W,A,S,D");
      this.attackKey = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );
    }

    // Create attack hitbox
    this.hitbox = scene.physics.add.sprite(0, 0, "hitbox");
    this.hitbox.setVisible(false);
    this.hitbox.setActive(false);
    this.hitbox.setDepth(11);
  }

  update(time: number, delta: number) {
    if (!this.active) return;

    this.handleMovement();
    this.handleAttack(time);
  }

  private handleMovement() {
    if (this.isAttacking) {
      this.setVelocity(0, 0);
      return;
    }

    const state = useGameStore.getState();
    const speed = state.speed;
    const { x: vx_v, y: vy_v } = state.virtualJoystick;

    let vx = 0;
    let vy = 0;

    // Keyboard move
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      vx = -speed;
      this.facing = "left";
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      vx = speed;
      this.facing = "right";
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      vy = -speed;
      this.facing = "up";
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      vy = speed;
      this.facing = "down";
    }

    // Virtual Joystick Move (if no keyboard activity)
    if (vx === 0 && vy === 0 && (vx_v !== 0 || vy_v !== 0)) {
        vx = vx_v * speed;
        vy = vy_v * speed;
        
        // Update facing based on major vector component
        if (Math.abs(vx_v) > Math.abs(vy_v)) {
            this.facing = vx_v > 0 ? "right" : "left";
        } else {
            this.facing = vy_v > 0 ? "down" : "up";
        }
    }

    // Normalize diagonal movement for keyboard
    if (vx !== 0 && vy !== 0 && vx_v === 0 && vy_v === 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.setVelocity(vx, vy);
  }

  private handleAttack(time: number) {
    const state = useGameStore.getState();
    const isVirtualAttack = state.virtualActions.attack;

    if (
      (Phaser.Input.Keyboard.JustDown(this.attackKey) || isVirtualAttack) &&
      time > this.lastAttackTime + this.attackCooldown
    ) {
      if (isVirtualAttack) state.clearVirtualActions();

      this.isAttacking = true;
      this.lastAttackTime = time;
      this.setVelocity(0, 0);

      // Position hitbox based on facing direction
      const offset = 32;
      let hx = this.x;
      let hy = this.y;

      if (this.facing === "up") hy -= offset;
      else if (this.facing === "down") hy += offset;
      else if (this.facing === "left") hx -= offset;
      else if (this.facing === "right") hx += offset;

      this.hitbox.setPosition(hx, hy);
      this.hitbox.setActive(true);
      this.hitbox.setVisible(true);

      // Emit attack event for collision detection
      this.scene.events.emit("player-attack", this.hitbox);

      // Hide hitbox after short duration
      this.scene.time.delayedCall(150, () => {
        this.hitbox.setActive(false);
        this.hitbox.setVisible(false);
        this.isAttacking = false;
      });
    }
  }

  takeDamage(amount: number) {
    const state = useGameStore.getState();
    const actualDamage = Math.max(1, amount - state.defense);
    state.setHealth(state.health - actualDamage);

    // Flash red
    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });

    if (state.health <= 0) {
      this.die();
    }
  }

  private die() {
    this.setActive(false);
    this.setVisible(false);
    this.scene.events.emit("player-died");
  }
}
