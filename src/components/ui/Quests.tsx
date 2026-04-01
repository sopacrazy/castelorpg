import { useGameStore } from "../../store/gameStore";
 
 export const Quests = () => {
   const { quests, isQuestsOpen, toggleQuests } = useGameStore();
 
   if (!isQuestsOpen) return null;
 
   return (
     <div 
        className="absolute top-32 right-4 bg-stone-900/95 border-2 border-stone-800 rounded-lg p-4 pointer-events-auto shadow-2xl ring-1 ring-amber-900/20 transition-all duration-300 w-64 z-[70]"
     >
       <div 
         className="flex items-center gap-2 mb-3 border-b border-stone-800 pb-2 cursor-pointer"
         onClick={() => toggleQuests()}
       >
         <span className="text-amber-500 text-lg">📜</span>
         <h3 className="text-stone-300 font-serif font-black text-xs uppercase tracking-[0.2em] flex-1">
            Objetivos
         </h3>
         <span className="text-stone-500 text-[10px]">✕</span>
       </div>
       
       <ul className="space-y-3">
           {quests.map((quest) => (
           <li key={quest.id} className="flex items-start gap-3 group">
               <div
               className={`mt-1 w-3 h-3 rounded-sm border flex items-center justify-center transition-all ${quest.completed ? "bg-green-600/20 border-green-500/50" : "bg-stone-950 border-stone-700"}`}
               >
               {quest.completed && <span className="text-[10px] text-green-400 font-bold">✓</span>}
               </div>
               <span
               className={`text-xs leading-tight transition-all ${quest.completed ? "text-stone-600 line-through italic" : "text-stone-300 font-medium group-hover:text-amber-200"}`}
               >
               {quest.description}
               </span>
           </li>
           ))}
       </ul>
       
       <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-amber-900/30 rounded-br-lg" />
     </div>
   );
 };
