import { useState } from "react";
import { useGameStore } from "../../store/gameStore";

export const Quests = () => {
  const { quests } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
        className={`absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-stone-900/90 border-2 border-stone-800 rounded-lg p-2 md:p-4 pointer-events-auto shadow-2xl ring-1 ring-amber-900/20 transition-all duration-300 ${isOpen ? "w-48 md:w-64" : "w-10 h-10 md:w-12 md:h-12 overflow-hidden flex items-center justify-center pointer-events-auto cursor-pointer"}`}
        onClick={() => !isOpen && setIsOpen(true)}
    >
      <div 
        className={`flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3 border-b border-stone-800 pb-1.5 md:pb-2 ${!isOpen ? "border-none mb-0 pb-0" : ""}`}
        onClick={(e) => { if(isOpen) { e.stopPropagation(); setIsOpen(false); } }}
      >
        <span className="text-amber-500 text-sm md:text-lg">📜</span>
        {isOpen && (
            <>
                <h3 className="text-stone-300 font-serif font-black text-[8px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] flex-1">
                Objetivos
                </h3>
                <span className="text-stone-500 text-[8px]">▼</span>
            </>
        )}
      </div>
      
      {isOpen && (
        <ul className="space-y-1.5 md:space-y-3">
            {quests.map((quest) => (
            <li key={quest.id} className="flex items-start gap-2 md:gap-3 group">
                <div
                className={`mt-0.5 md:mt-1 w-2 md:w-3 h-2 md:h-3 rounded-sm border flex items-center justify-center transition-all ${quest.completed ? "bg-green-600/20 border-green-500/50" : "bg-stone-950 border-stone-700"}`}
                >
                {quest.completed && <span className="text-[6px] md:text-[10px] text-green-400 font-bold">✓</span>}
                </div>
                <span
                className={`text-[8px] md:text-xs leading-tight transition-all ${quest.completed ? "text-stone-600 line-through italic" : "text-stone-300 font-medium group-hover:text-amber-200"}`}
                >
                {quest.description}
                </span>
            </li>
            ))}
        </ul>
      )}
      
      {/* Decorative element */}
      {isOpen && <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-amber-900/30 rounded-br-lg" />}
    </div>
  );
};
