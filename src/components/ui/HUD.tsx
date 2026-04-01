import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { CastleUpgrades } from "./CastleUpgrades";

export const HUD = () => {
  const {
    health,
    maxHealth,
    stamina,
    maxStamina,
    level,
    resources,
    day,
    isNight,
    enemiesRemaining,
    toast,
  } = useGameStore();
  const [isUpgradesOpen, setIsUpgradesOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-0 p-2 md:p-4 pointer-events-none flex flex-col justify-between z-40">
        
        {/* Top Section */}
        <div className="flex justify-between items-start w-full">
          {/* Top Left: Stats (Vitality & Experience) - Now here as requested */}
          <div className="bg-stone-900/90 border-2 border-stone-700 p-2 rounded-xl shadow-2xl flex flex-col pointer-events-auto min-w-[150px] md:min-w-[200px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-500 font-black text-xs md:text-sm">Lv {level}</span>
              <span className="text-white text-[8px] md:text-[10px] font-mono">{health} / {maxHealth}</span>
            </div>
            <div className="w-full bg-stone-950 h-2 md:h-3 rounded-full overflow-hidden border border-stone-800 mb-1">
              <div className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-500" style={{ width: `${(health / maxHealth) * 100}%` }} />
            </div>
            <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden border border-stone-800">
                <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${(stamina / maxStamina) * 100}%` }} />
            </div>
          </div>

          {/* Top Right: Status */}
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-stone-900/90 border-2 border-stone-700 p-1.5 md:p-2 rounded-lg flex flex-col items-center pointer-events-auto min-w-[100px]">
               <div className="text-stone-400 text-[8px] uppercase font-black">
                {isNight ? "Noite" : "Dia"} {day}
              </div>
              <div className={`text-xs font-serif italic font-bold ${isNight ? "text-indigo-400" : "text-amber-500"}`}>
                {isNight ? "Horda!" : "Trégua"}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 items-end">
              <div className="flex gap-1">
                <button onClick={() => setIsUpgradesOpen(true)} className="bg-amber-900/60 p-2 rounded-lg border border-amber-700 pointer-events-auto text-lg shadow-xl" title="Upgrades">🏰</button>
                <button onClick={() => useGameStore.getState().toggleInventory()} className="bg-stone-800/80 p-2 rounded-lg border border-stone-600 pointer-events-auto text-lg shadow-xl" title="Mochila">🎒</button>
              </div>
              <button onClick={() => useGameStore.getState().toggleQuests()} className="bg-stone-800/80 p-2 rounded-lg border border-stone-600 pointer-events-auto text-lg shadow-xl" title="Objetivos">📜</button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-center items-end w-full pb-2">
          {/* Central Resource Bar - Single line as requested */}
          <div className="bg-stone-900/95 border-2 border-stone-700 p-2 px-4 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="text-sm">💰</span> 
              <span className="font-mono text-amber-500 text-xs font-bold">{resources.gold}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-stone-800 pl-4">
              <span className="text-sm">🪵</span> 
              <span className="font-mono text-stone-300 text-xs font-bold">{resources.wood}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-stone-800 pl-4">
              <span className="text-sm">🪨</span> 
              <span className="font-mono text-stone-400 text-xs font-bold">{resources.stone}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-stone-800 pl-4">
              <span className="text-sm">🌿</span> 
              <span className="font-mono text-green-400 text-xs font-bold">{resources.herb}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-stone-800 pl-4">
              <span className="text-sm">💧</span> 
              <span className="font-mono text-blue-400 text-xs font-bold">{resources.water}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-stone-800 pl-4">
              <span className="text-sm">🍞</span> 
              <span className="font-mono text-orange-400 text-xs font-bold">{resources.food}</span>
            </div>
          </div>
        </div>
      </div>

      <CastleUpgrades
        isOpen={isUpgradesOpen}
        onClose={() => setIsUpgradesOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-1/2 right-10 -translate-y-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-right-10">
          <div className="bg-stone-900 border-2 border-amber-700/80 p-3 px-6 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md ring-1 ring-amber-500/20">
            <span className="text-amber-400 font-black text-sm tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {toast}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
