import { useGameStore } from "../../store/gameStore";

export const Inventory = () => {
  const { isInventoryOpen, toggleInventory, inventory, equippedWeapon } =
    useGameStore();

  if (!isInventoryOpen) return null;

  return (
    <div className="absolute inset-0 bg-stone-950/95 flex items-center justify-center z-50 p-2 md:p-8 backdrop-blur-md">
      <div className="bg-stone-900 border-[3px] border-stone-800 rounded-2xl w-full max-w-5xl h-full max-h-[85vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-amber-900/40 relative pointer-events-auto">
        {/* Ornaments */}
        <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-amber-600/50 rounded-tl-2xl pointer-events-none" />
        <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-amber-600/50 rounded-tr-2xl pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-amber-600/50 rounded-bl-2xl pointer-events-none" />
        <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-amber-600/50 rounded-br-2xl pointer-events-none" />

        {/* Header */}
        <div className="bg-gradient-to-b from-stone-800 to-stone-900 p-3 md:p-5 md:px-6 border-b border-white/5 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2 md:gap-3">
             <span className="text-xl md:text-3xl filter grayscale contrast-125">🎒</span>
             <h2 className="text-lg md:text-2xl font-black text-white font-serif tracking-[0.05em] md:tracking-[0.1em] uppercase">
                Arsenal
             </h2>
          </div>
          <button
            onClick={toggleInventory}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-800/80 hover:bg-red-900/50 border border-white/10 text-stone-400 hover:text-white transition-all flex items-center justify-center font-bold shadow-lg group"
          >
            <span className="group-hover:rotate-90 transition-transform">✕</span>
          </button>
        </div>
 
        {/* Content */}
        <div className="flex-1 p-3 md:p-8 flex flex-row gap-3 md:gap-8 overflow-hidden">
          {/* Left: Equipped & Stats */}
          <div className="w-[30%] flex flex-col gap-3 md:gap-6 overflow-y-auto pr-1 custom-scrollbar">
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-5 shadow-inner">
              <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                Mão Principal
              </h3>
              {equippedWeapon ? (
                <div className="flex flex-row md:flex-col items-center gap-3 md:gap-4 p-2 md:p-4 bg-stone-900/80 rounded-lg border border-amber-900/30 shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
                  <div className="text-3xl md:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10 group-hover:scale-110 transition-transform duration-500">{equippedWeapon.icon}</div>
                  <div className="text-center z-10">
                    <div className="text-amber-100 font-bold text-sm tracking-wide">
                      {equippedWeapon.name}
                    </div>
                    <div className="text-stone-500 text-[10px] uppercase font-black tracking-tighter mt-0.5">
                      {equippedWeapon.type}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-32 rounded-lg border-2 border-stone-800 border-dashed flex items-center justify-center text-stone-700 text-xs text-center p-4 italic">
                  Pronto para empunhar o aço
                </div>
              )}
            </div>
 
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3 md:p-5 shadow-inner">
              <h3 className="text-stone-400 font-black text-[8px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-4">Poder de Combate</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                   <div className="flex justify-between text-[10px] uppercase font-black text-stone-500">
                      <span>Dano</span>
                      <span className="text-red-400 font-mono tracking-normal">{useGameStore.getState().damage}</span>
                   </div>
                   <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-red-600/60 h-full" style={{ width: '45%' }} />
                   </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <div className="flex justify-between text-[10px] uppercase font-black text-stone-500">
                      <span>Defesa</span>
                      <span className="text-blue-400 font-mono tracking-normal">{useGameStore.getState().defense}</span>
                   </div>
                   <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-blue-600/60 h-full" style={{ width: '30%' }} />
                   </div>
                </div>

                <div className="flex flex-col gap-1.5">
                   <div className="flex justify-between text-[10px] uppercase font-black text-stone-500">
                      <span>Velocidade</span>
                      <span className="text-green-400 font-mono tracking-normal">{useGameStore.getState().speed}</span>
                   </div>
                   <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-green-600/60 h-full" style={{ width: '60%' }} />
                   </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Right: Grid */}
          <div className="w-[70%] bg-stone-950/40 border border-stone-800 rounded-xl p-3 md:p-6 shadow-inner relative flex flex-col h-full">
            <h3 className="text-stone-400 font-black text-[10px] uppercase tracking-widest mb-4">Mochila</h3>
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-16">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl aspect-square flex flex-col items-center justify-center relative hover:border-amber-600/50 hover:bg-stone-800/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="text-2xl md:text-4xl drop-shadow-md z-10">{item.icon}</div>
                  <div className="absolute bottom-1 right-1 md:bottom-1.5 md:right-2 bg-stone-950/80 px-1 md:px-1.5 py-0.5 rounded border border-white/5 text-[8px] md:text-[10px] font-mono text-amber-500 font-black">
                    {item.quantity}
                  </div>
 
                  {/* Tooltip (Fixed overlap) */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 md:w-48 bg-stone-950 border border-amber-900/30 rounded-lg p-2 md:p-3 text-[10px] md:text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 z-[100] shadow-2xl">
                    <div className="text-amber-400 font-black uppercase text-[8px] md:text-[10px] mb-1 tracking-widest border-b border-amber-900/20 pb-1">
                      {item.name}
                    </div>
                    <div className="text-stone-400 leading-snug italic mt-1 md:mt-2">
                       "{item.description}"
                    </div>
                  </div>
                </div>
              ))}
 
              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, 16 - inventory.length) }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="bg-stone-900/20 border-2 border-stone-900 border-dashed rounded-xl aspect-square opacity-40 hover:opacity-100 transition-opacity"
                  />
                ),
              )}
            </div>
            
            <div className="absolute bottom-4 right-4">
               <div className="text-[10px] text-stone-600 uppercase font-black tracking-widest leading-none">
                 Peso: {inventory.length}/16
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
