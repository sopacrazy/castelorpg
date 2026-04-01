import { useGameStore } from "../../store/gameStore";

export const Inventory = () => {
  const { isInventoryOpen, toggleInventory, inventory, equippedWeapon, damage, defense, speed } =
    useGameStore();

  if (!isInventoryOpen) return null;

  return (
    <div className="absolute inset-0 bg-stone-950/98 flex items-center justify-center z-50 p-2 md:p-6 backdrop-blur-lg">
      <div className="bg-stone-900/90 border-2 border-stone-800 rounded-xl w-full h-full max-w-[98%] max-h-[98%] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden ring-1 ring-white/5">
        
        {/* Header - Super Compact */}
        <div className="flex justify-between items-center px-4 py-2 bg-stone-950/40 border-b border-white/5">
          <div className="flex items-center gap-3">
             <span className="text-xl">🎒</span>
             <h2 className="text-sm md:text-lg font-black text-white font-serif uppercase tracking-widest">Arsenal</h2>
          </div>
          <button
            onClick={toggleInventory}
            className="w-8 h-8 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 text-red-500 transition-all flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>
 
        {/* Main Content Area - Horizontal Split */}
        <div className="flex-1 flex flex-row gap-2 md:gap-4 p-2 md:p-4 overflow-hidden">
          
          {/* LEFT COLUMN: Status & Equipped (30%) */}
          <div className="w-[30%] flex flex-col gap-2 overflow-hidden">
            
            {/* Equipped Box */}
            <div className="bg-stone-950/60 p-2 md:p-3 rounded-lg border border-stone-800 shadow-inner flex-1 flex flex-col justify-center">
              <span className="text-[7px] md:text-[9px] text-amber-500/80 font-black uppercase mb-1 md:mb-2 block">Mão Principal</span>
              {equippedWeapon ? (
                <div className="flex items-center gap-3 bg-stone-900/50 p-2 rounded border border-amber-900/20">
                  <span className="text-2xl md:text-4xl">{equippedWeapon.icon}</span>
                  <div>
                    <div className="text-[10px] md:text-sm font-bold text-amber-100 leading-none">{equippedWeapon.name}</div>
                    <div className="text-[7px] md:text-[8px] text-stone-500 uppercase font-black mt-1">{equippedWeapon.type}</div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border border-stone-800 border-dashed rounded flex items-center justify-center text-[9px] text-stone-600 italic">Espaço Vazio</div>
              )}
            </div>

            {/* Stats Box */}
            <div className="bg-stone-950/60 p-2 md:p-3 rounded-lg border border-stone-800 shadow-inner flex-1 flex flex-col justify-center">
              <span className="text-[7px] md:text-[9px] text-stone-400/80 font-black uppercase mb-2 block tracking-tighter">Atributos</span>
              <div className="space-y-1 md:space-y-2">
                {[
                  { label: "Dano", val: damage, color: "bg-red-600", current: 45 },
                  { label: "Defesa", val: defense, color: "bg-blue-600", current: 30 },
                  { label: "Veloc.", val: speed, color: "bg-green-600", current: 60 }
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col">
                    <div className="flex justify-between text-[7px] md:text-[9px] uppercase font-black mb-0.5">
                      <span className="text-stone-500">{stat.label}</span>
                      <span className="text-white font-mono">{stat.val}</span>
                    </div>
                    <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden border border-white/5">
                      <div className={`${stat.color} h-full opacity-60`} style={{ width: `${stat.current}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Grid (70%) */}
          <div className="w-[70%] flex flex-col gap-2 relative h-full">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[7px] md:text-[9px] text-stone-400 font-black uppercase tracking-widest pl-1">Mochila</span>
              <span className="text-[7px] md:text-[9px] text-stone-600 uppercase font-black">Peso: {inventory.length}/16</span>
            </div>
            
            {/* Super Grid for Landscape - 8 columns x 2 rows = 16 slots */}
            <div className="grid grid-cols-8 grid-rows-2 gap-1 md:gap-2 flex-1 overflow-hidden">
              {/* Actual Items */}
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-800/80 border border-stone-700/50 rounded flex items-center justify-center relative hover:border-amber-500/40 group overflow-hidden"
                >
                  <span className="text-xl md:text-3xl drop-shadow-lg z-10 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="absolute bottom-0 right-0 bg-stone-950/80 px-0.5 rounded-tl border-l border-t border-white/5 text-[7px] md:text-[8px] font-mono text-amber-500 font-black z-20">
                    {item.quantity}
                  </div>
                  
                  {/* Micro Tooltip */}
                  <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center p-1 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none text-center">
                    <div className="text-[7px] md:text-[9px] text-amber-400 font-black uppercase leading-tight">{item.name}</div>
                    <div className="text-[6px] md:text-[8px] text-stone-500 mt-1 line-clamp-2 italic">"{item.description}"</div>
                  </div>
                </div>
              ))}

              {/* Empty Slots to reach 16 */}
              {Array.from({ length: Math.max(0, 16 - inventory.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-stone-950/40 border border-stone-800 border-dashed rounded flex items-center justify-center opacity-30"
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar/Decoration */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
      </div>
    </div>
  );
};
