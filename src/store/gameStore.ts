import { create } from "zustand";

export type ResourceType =
  | "gold"
  | "wood"
  | "stone"
  | "essence"
  | "herb"
  | "scrap"
  | "water"
  | "food";

export interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "consumable" | "material" | "special";
  description: string;
  quantity: number;
  icon: string;
}

export interface GameState {
  // Player Stats
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  level: number;
  xp: number;
  damage: number;
  defense: number;
  speed: number;

  // Resources
  resources: Record<ResourceType, number>;

  // Inventory
  inventory: InventoryItem[];
  equippedWeapon: InventoryItem | null;

  // Game State
  day: number;
  isNight: boolean;
  enemiesRemaining: number;

  // UI State
  isInventoryOpen: boolean;
  isDialogActive: boolean;
  currentDialog: { name: string; text: string } | null;
  toast: string | null;
  isQuestsOpen: boolean;

  // Castle Upgrades
  castleUpgrades: {
    walls: number;
    gate: number;
    garden: number;
    throneRoom: number;
    warehouse: number;
    watchtower: number;
  };

  // Quests
  quests: {
    id: string;
    description: string;
    completed: boolean;
  }[];

  // Camera Settings
  zoom: number;
  setZoom: (z: number) => void;
  cameraSyncCounter: number;
  triggerCameraSync: () => void;

  // Mobile Controls
  setHealth: (h: number) => void;
  addResource: (type: ResourceType, amount: number) => void;
  toggleInventory: () => void;
  toggleQuests: () => void;
  setDialog: (dialog: { name: string; text: string } | null) => void;
  setToast: (text: string | null) => void;
  setDayTime: (isNight: boolean, day: number) => void;
  setEnemiesRemaining: (count: number) => void;
  addItem: (item: InventoryItem) => void;
  upgradeCastle: (part: keyof GameState["castleUpgrades"]) => void;
  completeQuest: (id: string) => void;
  
  // Mobile Controls
  virtualJoystick: { x: number; y: number };
  setVirtualJoystick: (vector: { x: number; y: number }) => void;
  virtualActions: { interact: boolean; attack: boolean };
  triggerVirtualAction: (action: "interact" | "attack") => void;
  clearVirtualActions: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  level: 1,
  xp: 0,
  damage: 10,
  defense: 5,
  speed: 150,

  resources: {
    gold: 0,
    wood: 0,
    stone: 0,
    essence: 0,
    herb: 0,
    scrap: 0,
    water: 0,
    food: 0,
  },

  inventory: [
    {
      id: "rusty_sword",
      name: "Espada Enferrujada",
      type: "weapon",
      description: "Uma espada velha e gasta, mas ainda corta.",
      quantity: 1,
      icon: "🗡️",
    },
    {
      id: "small_potion",
      name: "Poção Pequena",
      type: "consumable",
      description: "Restaura 25 de vida.",
      quantity: 3,
      icon: "🧪",
    },
  ],
  equippedWeapon: {
    id: "rusty_sword",
    name: "Espada Enferrujada",
    type: "weapon",
    description: "Uma espada velha e gasta, mas ainda corta.",
    quantity: 1,
    icon: "🗡️",
  },

  day: 1,
  isNight: false,
  enemiesRemaining: 0,

  isInventoryOpen: false,
  isDialogActive: false,
  currentDialog: null,
  toast: null,
  isQuestsOpen: false,

  castleUpgrades: {
    walls: 0,
    gate: 0,
    garden: 0,
    throneRoom: 0,
    warehouse: 0,
    watchtower: 0,
  },

  quests: [
    { id: "q1", description: "Sobreviva à primeira noite", completed: false },
    { id: "q2", description: "Colete 10 madeiras", completed: false },
    { id: "q3", description: "Fale com o Duque", completed: false },
  ],

  zoom: 0.6,
  setZoom: (z) => set({ zoom: Math.max(0.3, Math.min(z, 2.0)) }),
  cameraSyncCounter: 0,
  triggerCameraSync: () => set((state) => ({ cameraSyncCounter: state.cameraSyncCounter + 1 })),

  virtualJoystick: { x: 0, y: 0 },
  virtualActions: { interact: false, attack: false },

  setHealth: (h) =>
    set((state) => ({ health: Math.max(0, Math.min(h, state.maxHealth)) })),
  addResource: (type, amount) =>
    set((state) => {
      const newAmount = state.resources[type] + amount;
      const newState = {
        resources: { ...state.resources, [type]: newAmount },
        quests: [...state.quests],
      };

      // Complete wood quest if collecting enough wood
      if (type === "wood" && newAmount >= 10) {
        newState.quests = newState.quests.map((q) =>
          q.id === "q2" ? { ...q, completed: true } : q,
        );
      }

      return newState;
    }),
  toggleInventory: () =>
    set((state) => ({ isInventoryOpen: !state.isInventoryOpen })),
  toggleQuests: () =>
    set((state) => ({ isQuestsOpen: !state.isQuestsOpen })),
  setDialog: (dialog) =>
    set({ currentDialog: dialog, isDialogActive: !!dialog }),
  setToast: (text) => set({ toast: text }),
  setDayTime: (isNight, day) => set({ isNight, day }),
  setEnemiesRemaining: (count) => set({ enemiesRemaining: count }),
  addItem: (item) =>
    set((state) => {
      const existing = state.inventory.find((i) => i.id === item.id);
      if (existing) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { inventory: [...state.inventory, item] };
    }),
  upgradeCastle: (part) =>
    set((state) => ({
      castleUpgrades: {
        ...state.castleUpgrades,
        [part]: state.castleUpgrades[part] + 1,
      },
    })),
  completeQuest: (id) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === id ? { ...q, completed: true } : q,
      ),
    })),

  // Mobile Control setters
  setVirtualJoystick: (vector) => set({ virtualJoystick: vector }),
  triggerVirtualAction: (action) => 
    set((state) => ({ 
      virtualActions: { ...state.virtualActions, [action]: true } 
    })),
  clearVirtualActions: () => 
    set({ virtualActions: { interact: false, attack: false } }),
}));
