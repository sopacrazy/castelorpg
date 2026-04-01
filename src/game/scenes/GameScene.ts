import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { useGameStore } from "../../store/gameStore";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private crops!: Phaser.Physics.Arcade.StaticGroup;
  private trees!: Phaser.Physics.Arcade.StaticGroup;
  private stones!: Phaser.Physics.Arcade.StaticGroup;
  private herbs!: Phaser.Physics.Arcade.StaticGroup;
  private gates!: Phaser.Physics.Arcade.StaticGroup;
  private well!: Phaser.Physics.Arcade.Sprite;
  private loot!: Phaser.Physics.Arcade.Group;
  private npcs!: Phaser.Physics.Arcade.StaticGroup;
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;

  private isGateOpen: boolean = false;
  private gateInteractKey!: Phaser.Input.Keyboard.Key;

  private waveActive: boolean = false;
  private waveTimer: Phaser.Time.TimerEvent | null = null;
  private enemiesToSpawn: number = 0;
  private spawnInterval: number = 2000;
  private lastSpawnTime: number = 0;
  private lastCameraSync: number = 0;

  constructor() {
    super("GameScene");
  }

  create() {
    const worldWidth = 10000;
    const worldHeight = 10000;

    // Physics Groups
    this.walls = this.physics.add.staticGroup();
    this.crops = this.physics.add.staticGroup();
    this.trees = this.physics.add.staticGroup();
    this.stones = this.physics.add.staticGroup();
    this.herbs = this.physics.add.staticGroup();
    this.gates = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.loot = this.physics.add.group();
    this.npcs = this.physics.add.staticGroup();

    // Background
    this.add.tileSprite(0, 0, worldWidth, worldHeight, "grass").setOrigin(0).setDepth(0);

    // Create Map Elements
    this.createMap(worldWidth, worldHeight);

    // Player (Spawn in center of world)
    this.player = new Player(this, worldWidth / 2, worldHeight / 2);
    this.player.setDepth(1000); 

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    
    // Snap camera to target immediately
    this.cameras.main.centerOn(this.player.x, this.player.y);
    
    // Initial zoom set from store
    this.cameras.main.setZoom(useGameStore.getState().zoom);

    // Day/Night Overlay
    this.dayNightOverlay = this.add
      .rectangle(0, 0, worldWidth, worldHeight, 0x000033, 0)
      .setOrigin(0);
    this.dayNightOverlay.setDepth(100);

    // Collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.crops);
    this.physics.add.collider(this.player, this.trees);
    this.physics.add.collider(this.player, this.gates);
    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.gates);
    this.physics.add.collider(this.enemies, this.crops);
    this.physics.add.collider(this.enemies, this.enemies);

    // Loot collection
    this.physics.add.overlap(
      this.player,
      this.loot,
      this.collectLoot,
      undefined,
      this,
    );

    // NPC Interaction
    this.physics.add.overlap(
      this.player,
      this.npcs,
      this.interactNPC,
      undefined,
      this,
    );

    // Events
    this.events.on("player-attack", this.handlePlayerAttack, this);
    this.events.on("enemy-died", this.handleEnemyDeath, this);
    this.events.on(
      "enemy-attack-structure",
      this.handleEnemyAttackStructure,
      this,
    );
    this.events.on("player-died", this.handlePlayerDeath, this);

    // Controls
    if (this.input.keyboard) {
        this.gateInteractKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    // Launch UI Scene
    this.scene.launch("UIScene");

    // Start Day Cycle
    this.startDay();
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);

    const state = useGameStore.getState();
    
    // Update camera zoom from store
    this.cameras.main.setZoom(state.zoom);

    // Manual camera sync/center request from React UI
    if (state.cameraSyncCounter > this.lastCameraSync) {
        this.lastCameraSync = state.cameraSyncCounter;
        this.cameras.main.centerOn(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.player, true, 1.0, 1.0); // Snap hard
        console.log("Camera centered manually to:", this.player.x, this.player.y);
    }

    if (Phaser.Input.Keyboard.JustDown(this.gateInteractKey) || state.virtualActions.interact) {
        if (state.virtualActions.interact) state.clearVirtualActions();
        this.handleInteract();
    }

    if (
      this.waveActive &&
      this.enemiesToSpawn > 0 &&
      time > this.lastSpawnTime + this.spawnInterval
    ) {
      this.spawnEnemy();
      this.lastSpawnTime = time;
    }

    // Check wave end
    if (
      this.waveActive &&
      this.enemiesToSpawn <= 0 &&
      this.enemies.countActive() === 0
    ) {
      this.endNight();
    }
  }

  private createMap(worldWidth: number, worldHeight: number) {
    const offsetX = worldWidth / 2 - 320;
    const offsetY = worldHeight / 2 - 300;

    // Simple castle walls
    for (let i = 0; i < 20; i++) {
        const topWall = this.walls.create(i * 32 + 16 + offsetX, 100 + offsetY, "wall");
        topWall.setData("health", 100);
        topWall.setData("maxHealth", 100);

        // Bottom wall with a gap in the middle (acting as a gate area)
        if (i < 9 || i > 11) {
            const botWall = this.walls.create(i * 32 + 16 + offsetX, 500 + offsetY, "wall");
            botWall.setData("health", 100);
            botWall.setData("maxHealth", 100);
        } else {
            // Place gates in the gap
            const gate = this.gates.create(i * 32 + 16 + offsetX, 500 + offsetY, "gate");
            gate.setData("health", 150);
            gate.setData("maxHealth", 150);
            gate.setDepth(5);
        }
    }
    for (let i = 0; i < 12; i++) {
        const leftWall = this.walls.create(16 + offsetX, i * 32 + 100 + 16 + offsetY, "wall"); // Left wall
        leftWall.setData("health", 100);
        leftWall.setData("maxHealth", 100);

        const rightWall = this.walls.create(624 + offsetX, i * 32 + 100 + 16 + offsetY, "wall"); // Right wall
        rightWall.setData("health", 100);
        rightWall.setData("maxHealth", 100);
    }

    // Well
    this.well = this.physics.add.sprite(220 + offsetX, 180 + offsetY, "well");
    this.well.setImmovable(true);

    // Crops (Soil state)
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            const crop = this.crops.create(200 + i * 40 + offsetX, 310 + j * 40 + offsetY, "crop_soil");
            crop.setData("health", 50);
            crop.setData("maxHealth", 50);
            crop.setData("stage", 0); // 0: soil, 1: seeded, 2: growing, 3: ready
        }
    }

    // NPCs
    const duke = this.npcs.create(300 + offsetX, 150 + offsetY, "npc");
    duke.setData("name", "Duque Mariom Rosário");
    duke.setData(
        "text",
        "Precisamos de comida! Pegue água no poço, plante sementes e cuide da plantação (E).",
    );

    // Random Trees, Stones and Herbs around the map
    const spawnPoints: { x: number; y: number }[] = [];

    const isDistOk = (x: number, y: number) => {
        for (const p of spawnPoints) {
            if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < 50) return false;
        }
        return true;
    };

    // Spawn Area exclusions (around base)
    const isInBase = (x: number, y: number) => {
        return x > offsetX - 50 && x < offsetX + 700 && y > offsetY - 50 && y < offsetY + 600;
    };

    for (let i = 0; i < 60; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = Phaser.Math.Between(50, worldWidth - 50);
            y = Phaser.Math.Between(50, worldHeight - 50);
            attempts++;
        } while ((isInBase(x, y) || !isDistOk(x, y)) && attempts < 100);
        
        if (attempts < 100) {
            const tree = this.trees.create(x, y, "tree");
            tree.setData("health", 3);
            spawnPoints.push({ x, y });
        }
    }
    
    for (let i = 0; i < 40; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = Phaser.Math.Between(50, worldWidth - 50);
            y = Phaser.Math.Between(50, worldHeight - 50);
            attempts++;
        } while ((isInBase(x, y) || !isDistOk(x, y)) && attempts < 100);
        
        if (attempts < 100) {
            const stone = this.stones.create(x, y, "stone");
            stone.setData("health", 5);
            spawnPoints.push({ x, y });
        }
    }

    for (let i = 0; i < 50; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = Phaser.Math.Between(50, worldWidth - 50);
            y = Phaser.Math.Between(50, worldHeight - 50);
            attempts++;
        } while ((isInBase(x, y) || !isDistOk(x, y)) && attempts < 100);

        if (attempts < 100) {
            const herb = this.herbs.create(x, y, "sprout");
            herb.setData("health", 1);
            spawnPoints.push({ x, y });
        }
    }
  }

  private handlePlayerAttack(hitbox: Phaser.Physics.Arcade.Sprite) {
    const state = useGameStore.getState();
    const damage = state.damage;

    this.physics.overlap(hitbox, this.enemies, (box, enemyObj) => {
      const enemy = enemyObj as Enemy;
      const dir = new Phaser.Math.Vector2(
        enemy.x - this.player.x,
        enemy.y - this.player.y,
      ).normalize();
      enemy.takeDamage(damage, dir);
    });

    // Harvest trees
    this.physics.overlap(hitbox, this.trees, (box, treeObj) => {
        const tree = treeObj as Phaser.Physics.Arcade.Sprite;
        let health = tree.getData("health") - 1;
        tree.setData("health", health);
        
        // Shake the tree when hit
        this.tweens.add({
            targets: tree,
            x: tree.x + Phaser.Math.Between(-2, 2),
            duration: 50,
            yoyo: true,
            repeat: 2
        });

        if (health <= 0) {
            // Spawn wood loot
            const wood = this.loot.create(tree.x, tree.y, "loot_wood");
            wood.setData("type", "wood");
            wood.setData("amount", Phaser.Math.Between(2, 5));
            tree.destroy();
        }
    });

    // Harvest stones
    this.physics.overlap(hitbox, this.stones, (box, stoneObj) => {
        const stone = stoneObj as Phaser.Physics.Arcade.Sprite;
        let health = stone.getData("health") - 1;
        stone.setData("health", health);
        
        if (health <= 0) {
            const stoneLoot = this.loot.create(stone.x, stone.y, "loot_stone");
            stoneLoot.setData("type", "stone");
            stoneLoot.setData("amount", Phaser.Math.Between(1, 4));
            stone.destroy();
        }
    });

    // Harvest herbs
    this.physics.overlap(hitbox, this.herbs, (box, herbObj) => {
        const herb = herbObj as Phaser.Physics.Arcade.Sprite;
        const herbLoot = this.loot.create(herb.x, herb.y, "loot_gold").setTint(0x00ff00);
        herbLoot.setData("type", "herb");
        herbLoot.setData("amount", 2);
        herb.destroy();
    });
  }

  private handleEnemyDeath(x: number, y: number) {
    const state = useGameStore.getState();
    state.setEnemiesRemaining(Math.max(0, state.enemiesRemaining - 1));

    // Drop loot (50% chance)
    if (Math.random() > 0.5) {
      const drop = this.loot.create(x, y, "loot_gold");
      drop.setData("type", Math.random() > 0.7 ? "essence" : "gold");
      drop.setData("amount", Math.floor(Math.random() * 5) + 1);
    }
  }

  private handleEnemyAttackStructure(structure: any, damage: number) {
    const s = structure as Phaser.Physics.Arcade.Sprite;
    let health = s.getData("health") - damage;
    s.setData("health", health);

    // Flash red
    s.setTint(0xff0000);
    this.time.delayedCall(200, () => s.clearTint());

    if (health <= 0) {
        // Mark as broken instead of destroying
        s.setData("health", 0);
        s.setAlpha(0.1);
        if (s.body) s.body.enable = false;
        
        // Visual debris
        const debris = this.add.rectangle(s.x, s.y, 32, 32, 0x555555, 0.5);
        this.time.delayedCall(5000, () => debris.destroy());
    }
  }

  private collectLoot(player: any, lootObj: any) {
    const loot = lootObj as Phaser.Physics.Arcade.Sprite;
    const type = loot.getData("type");
    const amount = loot.getData("amount");

    useGameStore.getState().addResource(type, amount);
    loot.destroy();
  }

  private interactNPC(player: any, npcObj: any) {
    // Only interact if pressing space/interact key, for now just overlap
    const npc = npcObj as Phaser.Physics.Arcade.Sprite;
    const name = npc.getData("name");
    const text = npc.getData("text");

    // Debounce dialog
    const state = useGameStore.getState();
    if (!state.isDialogActive) {
      state.setDialog({ name, text });

      // Complete quest if talking to Duke
      if (name === "Duque Mariom Rosário") {
        state.completeQuest("q3");
      }
    }
  }

  private handlePlayerDeath() {
    this.scene.pause();
    useGameStore
      .getState()
      .setDialog({
        name: "Fim de Jogo",
        text: "Você caiu em batalha. O castelo está perdido. Recarregue a página para tentar novamente.",
      });
  }

  private startDay() {
    const state = useGameStore.getState();
    state.setDayTime(false, state.day);
    this.waveActive = false;

    // Transition to day
    this.tweens.add({
      targets: this.dayNightOverlay,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        // Start night after 30 seconds
        this.time.delayedCall(30000, this.startNight, [], this);
      },
    });
  }

  private startNight() {
    const state = useGameStore.getState();
    state.setDayTime(true, state.day);

    // Transition to night
    this.tweens.add({
      targets: this.dayNightOverlay,
      alpha: 0.6,
      duration: 2000,
      onComplete: () => {
        this.waveActive = true;
        this.enemiesToSpawn = 5 + state.day * 2;
        state.setEnemiesRemaining(this.enemiesToSpawn);
      },
    });
  }

  private endNight() {
    const state = useGameStore.getState();
    state.completeQuest("q1");
    state.setDayTime(false, state.day + 1);
    this.startDay();
  }

  private spawnEnemy() {
    this.enemiesToSpawn--;

    // Spawn at random edge of the 4000x4000 world
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    const w = 4000;
    const h = 4000;

    if (edge === 0) {
      x = Math.random() * w;
      y = -50;
    } // Top
    else if (edge === 1) {
      x = w + 50;
      y = Math.random() * h;
    } // Right
    else if (edge === 2) {
      x = Math.random() * w;
      y = h + 50;
    } // Bottom
    else {
      x = -50;
      y = Math.random() * h;
    } // Left

    // Target a random crop, player, wall, or gate
    const structures = [
        ...this.crops.getChildren(),
        ...this.walls.getChildren(),
        ...this.gates.getChildren()
    ];
    
    const target =
      Math.random() > 0.4
                ? this.player
                : structures[Math.floor(Math.random() * structures.length)];

    const type = Math.random() > 0.8 ? "medium" : "small";
    const enemy = new Enemy(this, x, y, target as any, type);
    this.enemies.add(enemy);
  }

  private handleInteract() {
    const state = useGameStore.getState();

    // 1. Check for repair first
    if (this.tryRepair()) {
        state.setToast("Reparo realizado! -1 Pedra");
        this.time.delayedCall(2000, () => state.setToast(null));
        return;
    }

    // 2. Check for Well interaction
    const distToWell = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.well.x, this.well.y);
    if (distToWell < 60) {
        state.addResource("water", 1);
        state.setToast("Você pegou um balde de água! 💧");
        this.time.delayedCall(2000, () => state.setToast(null));
        return;
    }

    // 3. Check for Crop interaction
    this.crops.getChildren().forEach((cObj: any) => {
        const crop = cObj as Phaser.Physics.Arcade.Sprite;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, crop.x, crop.y);
        
        if (dist < 50) {
            const stage = crop.getData("stage");
            
            if (stage === 0) { // Soil -> Plant
                if (state.resources.herb >= 1) {
                    state.addResource("herb", -1);
                    crop.setData("stage", 1);
                    crop.setTexture("crop_sprout");
                    state.setToast("Sementes plantadas! 🌿");
                } else {
                    state.setToast("Precisa de 1 semente (Herb)!");
                }
                this.time.delayedCall(2000, () => state.setToast(null));
            } 
            else if (stage === 1) { // Seeded -> Water
                if (state.resources.water >= 1) {
                    state.addResource("water", -1);
                    crop.setData("stage", 2);
                    crop.setTint(0x90caf9); // Watered tint
                    state.setToast("Planta regada! 💧");
                    
                    this.time.delayedCall(10000, () => {
                        if (crop.active) {
                            crop.setData("stage", 3);
                            crop.setTexture("crop_ready");
                            crop.clearTint();
                        }
                    });
                } else {
                    state.setToast("Precisa de 1 balde de água!");
                }
                this.time.delayedCall(2000, () => state.setToast(null));
            }
            else if (stage === 3) { // Ready -> Harvest
                state.addResource("food", 5);
                state.addResource("gold", 10);
                crop.setData("stage", 0);
                crop.setTexture("crop_soil");
                state.setToast("Colheita realizada! +5 Comida 🍞");
                this.time.delayedCall(2000, () => state.setToast(null));
            }
        }
    });

    // 4. Check for gate interaction
    let nearGate = false;
    let gateObj: any = null;
    this.gates.getChildren().forEach((gate: any) => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, gate.x, gate.y);
        if (dist < 80) {
            nearGate = true;
            gateObj = gate;
        }
    });

    if (nearGate) {
        this.isGateOpen = !this.isGateOpen;
        this.gates.getChildren().forEach((gate: any) => {
            const g = gate as Phaser.Physics.Arcade.Sprite;
            if (this.isGateOpen) {
                g.body.enable = false;
                g.setAlpha(0.3);
            } else {
                g.body.enable = true;
                g.setAlpha(1);
            }
        });

        state.setToast(this.isGateOpen ? "Portão Aberto 🔓" : "Portão Trancado 🔒");
        this.time.delayedCall(2000, () => state.setToast(null));
    }
  }

  private toggleGate() {
    // Deprecated for handleInteract
  }

  private tryRepair(): boolean {
    const state = useGameStore.getState();
    const stoneCount = state.resources.stone;
    
    if (stoneCount <= 0) return false;

    const structures = [
        ...this.walls.getChildren(),
        ...this.gates.getChildren(),
        ...this.crops.getChildren()
    ];

    let repaired = false;
    structures.forEach((sObj: any) => {
        const s = sObj as Phaser.Physics.Arcade.Sprite;
        // Increase detection range slightly
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
        
        if (dist < 80) {
            const health = s.getData("health");
            const maxHealth = s.getData("maxHealth");
            
            if (health < maxHealth) {
                // Consume stone and repair
                state.addResource("stone", -1);
                
                const newHealth = Math.min(maxHealth, health + 25);
                s.setData("health", newHealth);
                
                // If it was broken, restore it
                if (health <= 0 && newHealth > 0) {
                    s.setAlpha(1);
                    if (s.body) s.body.enable = true;
                }
                
                // Visual feedback (Green flash)
                s.setTint(0x00ff00);
                this.time.delayedCall(200, () => s.clearTint());
                
                repaired = true;
                return;
            }
        }
    });

    return repaired;
  }
}
