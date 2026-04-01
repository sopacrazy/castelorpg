import Phaser from "phaser";
import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private target: Player | Phaser.Physics.Arcade.Sprite;
  private speed: number = 50;
  private health: number = 20;
  private damage: number = 5;
  private attackRange: number = 40;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1000;
  private isStunned: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Player | Phaser.Physics.Arcade.Sprite,
    type: "small" | "medium" | "large",
  ) {
    super(scene, x, y, "enemy");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.target = target;
    this.setCollideWorldBounds(true);
    this.setDepth(9);

    if (type === "small") {
      this.speed = 80;
      this.health = 10;
      this.damage = 3;
      this.setScale(0.8);
    } else if (type === "medium") {
      this.speed = 50;
      this.health = 30;
      this.damage = 8;
    } else if (type === "large") {
      this.speed = 30;
      this.health = 80;
      this.damage = 15;
      this.setScale(1.5);
    }
  }

  update(time: number, delta: number) {
    if (!this.active || this.isStunned) return;

    if (!this.target || !this.target.active) {
      // Find new target
      const player = this.scene.children.list.find(
        (c) => c.constructor.name === "Player",
      ) as any;
      if (player && player.active) {
        this.target = player;
      } else {
        this.setVelocity(0, 0);
        return;
      }
    }

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y,
    );

    if (distance > this.attackRange) {
      // Move towards target
      this.scene.physics.moveToObject(this, this.target, this.speed);
    } else {
      // Attack target
      this.setVelocity(0, 0);
      if (time > this.lastAttackTime + this.attackCooldown) {
        this.lastAttackTime = time;
        this.attackTarget();
      }
    }
  }

  private attackTarget() {
    if (this.target instanceof Player) {
      this.target.takeDamage(this.damage);
    } else {
      // Attack crop/barricade
      this.scene.events.emit(
        "enemy-attack-structure",
        this.target,
        this.damage,
      );
    }
  }

  takeDamage(amount: number, knockbackDir: Phaser.Math.Vector2) {
    this.health -= amount;
    this.isStunned = true;

    // Knockback
    this.setVelocity(knockbackDir.x * 200, knockbackDir.y * 200);

    // Flash white
    this.setTint(0xffffff);

    this.scene.time.delayedCall(200, () => {
      this.clearTint();
      this.isStunned = false;
      if (this.health <= 0) {
        this.die();
      }
    });
  }

  private die() {
    this.setActive(false);
    this.setVisible(false);
    this.scene.events.emit("enemy-died", this.x, this.y);
    this.destroy();
  }
}
