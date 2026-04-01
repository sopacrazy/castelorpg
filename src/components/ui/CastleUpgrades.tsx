import { useGameStore } from "../../store/gameStore";

export const CastleUpgrades = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { castleUpgrades, upgradeCastle, resources } = useGameStore();

  if (!isOpen) return null;

  const upgrades = [
    {
      id: "walls",
      name: "Muralhas",
      cost: { stone: 10, wood: 5 },
      desc: "Aumenta a defesa base do castelo.",
    },
    {
      id: "gate",
      name: "Portão Principal",
      cost: { wood: 15, scrap: 5 },
      desc: "Retarda a entrada dos monstros.",
    },
    {
      id: "garden",
      name: "Jardim Real",
      cost: { herb: 10, essence: 2 },
      desc: "Gera ervas curativas diariamente.",
    },
    {
      id: "throneRoom",
      name: "Sala do Trono",
      cost: { gold: 50, stone: 20 },
      desc: "Aumenta o prestígio e atrai mercenários.",
    },
  ];

  return (
    <div className="absolute inset-0 bg-stone-950/98 flex items-center justify-center z-50 p-2 md:p-6 backdrop-blur-lg">
      <div className="bg-stone-900/90 border-2 border-stone-800 rounded-xl w-full h-full max-w-[98%] max-h-[98%] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="bg-gradient-to-b from-stone-800 to-stone-900 p-3 md:p-5 md:px-6 border-b border-white/5 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2 md:gap-3">
             <span className="text-xl md:text-3xl filter grayscale contrast-125">🏰</span>
             <h2 className="text-lg md:text-2xl font-black text-white font-serif tracking-[0.05em] md:tracking-[0.1em] uppercase">
                Fortificações
             </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-800/80 hover:bg-red-900/50 border border-white/10 text-stone-400 hover:text-white transition-all flex items-center justify-center font-bold shadow-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 md:p-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-2 md:gap-4 h-full content-start overflow-y-auto pr-1">
            {upgrades.map((upg) => {
              const currentLevel =
                castleUpgrades[upg.id as keyof typeof castleUpgrades] || 0;

              // Check if can afford
              const canAfford = Object.entries(upg.cost).every(
                ([res, amount]) => {
                  return (
                    resources[res as keyof typeof resources] >=
                    amount * (currentLevel + 1)
                  );
                },
              );

              return (
                <div
                  key={upg.id}
                  className="bg-stone-950/40 border border-stone-800 hover:border-amber-900/50 rounded-lg p-2 md:p-4 flex flex-col justify-between transition-all group hover:bg-stone-800/20 gap-2"
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                       <h3 className="text-white font-serif font-black text-xs md:text-lg uppercase tracking-wider">
                        {upg.name}
                       </h3>
                       <div className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-[8px] md:text-[10px] text-stone-500 font-bold uppercase">
                         Nv {currentLevel}
                       </div>
                    </div>
                     <p className="text-stone-500 text-[8px] md:text-xs italic leading-tight">"{upg.desc}"</p>

                    {/* Costs */}
                    <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
                      {Object.entries(upg.cost).map(([res, amount]) => {
                        const required = amount * (currentLevel + 1);
                        const hasEnough = resources[res as keyof typeof resources] >= required;
                        return (
                          <div
                            key={res}
                            className={`flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-stone-900/50 border ${hasEnough ? "border-stone-800" : "border-red-900/30"}`}
                          >
                            <span className="text-xs md:text-sm">
                              {res === "gold" ? "💰" : res === "wood" ? "🪵" : res === "stone" ? "🪨" : res === "essence" ? "🔮" : res === "herb" ? "🌿" : "⚙️"}
                            </span>
                            <span className={`text-[8px] md:text-[10px] font-mono font-black ${hasEnough ? "text-stone-300" : "text-red-500"}`}>
                              {required}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      // Deduct resources
                      Object.entries(upg.cost).forEach(([res, amount]) => {
                        useGameStore
                          .getState()
                          .addResource(
                            res as any,
                            -(amount * (currentLevel + 1)),
                          );
                      });
                      upgradeCastle(upg.id as any);
                    }}
                    className={`w-full py-1.5 md:py-2 rounded border font-black uppercase tracking-widest text-[8px] md:text-[9px] transition-all relative overflow-hidden group/btn ${
                      canAfford
                        ? "bg-amber-900/40 hover:bg-amber-800 text-amber-200 border-amber-700/50 shadow-lg cursor-pointer"
                        : "bg-stone-800/50 text-stone-600 border-stone-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span className="relative z-10">MELHORAR</span>
                    {canAfford && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-2 md:p-4 bg-stone-800/20 border-t border-white/5 rounded-b-2xl flex justify-between items-center px-4 md:px-8">
           <div className="text-[8px] md:text-[10px] text-stone-600 uppercase font-black tracking-widest leading-none">
             Gestão Territorial
           </div>
           <div className="flex gap-2 md:gap-4">
              <span className="text-[8px] md:text-[10px] text-stone-500 font-mono">🪨 {resources.stone}</span>
              <span className="text-[8px] md:text-[10px] text-stone-500 font-mono">🪵 {resources.wood}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
