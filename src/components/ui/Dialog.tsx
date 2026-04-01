import { useGameStore } from "../../store/gameStore";

export const Dialog = () => {
  const { isDialogActive, currentDialog, setDialog } = useGameStore();

  if (!isDialogActive || !currentDialog) return null;

  return (
    <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-2xl z-[60] px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-stone-900 border-[2px] md:border-[3px] border-stone-800 rounded-xl md:rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative ring-1 ring-amber-900/30">
        {/* Subtle texture or pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b08_1px,transparent_1px)] bg-[size:10px_10px] md:bg-[size:20px_20px] pointer-events-none opacity-20" />

        {/* Header */}
        <div className="bg-stone-800/50 p-2 md:p-4 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
             <h3 className="text-xs md:text-lg font-black text-white font-serif tracking-[0.1em] md:tracking-[0.2em] uppercase">
              {currentDialog.name}
             </h3>
          </div>
          <button
            onClick={() => setDialog(null)}
            className="text-stone-500 hover:text-white transition-colors text-sm md:text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 text-stone-200 text-sm md:text-xl leading-relaxed font-serif italic text-center relative z-10">
          <span className="text-amber-500/30 text-3xl md:text-6xl absolute -top-1 md:-top-2 left-2 md:left-4 font-serif">"</span>
          {currentDialog.text}
          <span className="text-amber-500/30 text-3xl md:text-6xl absolute -bottom-6 md:-bottom-10 right-2 md:right-4 font-serif">"</span>
        </div>

        {/* Footer */}
        <div className="bg-stone-800/30 p-2 md:p-4 border-t border-white/5 flex justify-center relative z-10">
          <button
            onClick={() => setDialog(null)}
            className="bg-amber-900/40 hover:bg-amber-800 text-amber-200 font-black py-1.5 md:py-2.5 px-6 md:px-10 rounded-lg transition-all uppercase tracking-[0.1em] md:tracking-[0.25em] text-[8px] md:text-[10px] border border-amber-700/50 hover:shadow-[0_0_20px_#78350f44] active:scale-95"
          >
            Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
};
