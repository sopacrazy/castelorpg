import React, { useState, useRef, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";

export const MobileControls = () => {
  const setVirtualJoystick = useGameStore((state) => state.setVirtualJoystick);
  const triggerVirtualAction = useGameStore((state) => state.triggerVirtualAction);
  
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setJoystickActive(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!joystickActive || !joystickBaseRef.current) return;

    const base = joystickBaseRef.current.getBoundingClientRect();
    const centerX = base.left + base.width / 2;
    const centerY = base.top + base.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 40;

    const angle = Math.atan2(dy, dx);
    const cappedDist = Math.min(distance, maxRadius);

    const x = Math.cos(angle) * cappedDist;
    const y = Math.sin(angle) * cappedDist;

    setJoystickPos({ x, y });
    
    // Normalize vector for game engine (-1 to 1)
    setVirtualJoystick({ 
      x: x / maxRadius, 
      y: y / maxRadius 
    });
  };

  const handlePointerUp = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    setVirtualJoystick({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (joystickActive) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [joystickActive]);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none lg:hidden select-none touch-none">
      {/* Left Side: Joystick Area */}
      <div 
        className="absolute bottom-10 left-10 w-40 h-40 flex items-center justify-center pointer-events-auto"
        onPointerDown={handlePointerDown}
      >
        <div 
            ref={joystickBaseRef}
            className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-full flex items-center justify-center relative backdrop-blur-[2px]"
        >
            <div 
                className="w-12 h-12 bg-white/20 border-2 border-white/30 rounded-full shadow-xl transition-transform duration-75"
                style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
            />
            {/* Center dot */}
            <div className="absolute w-1 h-1 bg-white/10 rounded-full" />
        </div>
      </div>


      {/* Right Side: Action Buttons */}
      <div className="absolute bottom-10 right-10 flex gap-6 pointer-events-auto">
        {/* INTERACT (E) */}
        <button
          className="w-16 h-16 bg-amber-600/20 active:bg-amber-600/40 border-4 border-amber-600/40 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all border-dashed"
          onPointerDown={() => triggerVirtualAction("interact")}
        >
          <span className="text-amber-400 font-bold text-xl uppercase">E</span>
          <span className="text-[8px] text-amber-500/50 uppercase font-black">Ação</span>
        </button>

        {/* ATTACK (Space) */}
        <button
          className="w-20 h-20 bg-red-600/20 active:bg-red-600/40 border-4 border-red-600/40 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all"
          onPointerDown={() => triggerVirtualAction("attack")}
        >
          <span className="text-red-400 font-bold text-2xl uppercase">⚔️</span>
          <span className="text-[8px] text-red-500/50 uppercase font-black">Atacar</span>
        </button>
      </div>

      {/* Hint for mobile users */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-white text-[10px] uppercase font-bold tracking-widest">
        Controles Virtuais Ativos
      </div>
    </div>
  );
};
