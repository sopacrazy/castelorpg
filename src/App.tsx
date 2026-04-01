/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GameComponent } from "./components/GameComponent";
import { HUD } from "./components/ui/HUD";
import { Inventory } from "./components/ui/Inventory";
import { Dialog } from "./components/ui/Dialog";
import { Quests } from "./components/ui/Quests";
import { MobileControls } from "./components/ui/MobileControls";

export default function App() {
  const [started, setStarted] = useState(() => {
    // Check if we just refreshed to fix mobile layout
    const needsStart = sessionStorage.getItem("game_auto_started");
    if (needsStart === "true") {
      sessionStorage.removeItem("game_auto_started");
      return true;
    }
    return false;
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleStartGame = () => {
    // Temporary fix for mobile viewport bugs: 
    // Reload once when entering the game for the first time in this session
    const hasReloaded = sessionStorage.getItem("game_initial_reload");
    if (!hasReloaded && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      sessionStorage.setItem("game_initial_reload", "true");
      sessionStorage.setItem("game_auto_started", "true");
      window.location.reload();
      return;
    }

    setStarted(true);
    if (window.innerWidth < 1024) toggleFullscreen();
  };

  if (!started) {
    return (
      <div className="w-screen h-screen bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden font-serif">
        {/* Cinematic Background Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#f59e0b 1.5px, transparent 1.5px)",
            backgroundSize: "48px 48px",
          }}
        />
        
        {/* Animated Mist Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950 opacity-80" />

        <div className="z-10 flex flex-col items-center gap-6 px-4 max-w-lg w-full">
          {/* Main Title Section */}
          <div className="relative mb-2">
             <div className="absolute -inset-8 blur-3xl bg-amber-600/10 pointer-events-none rounded-full" />
             <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-amber-500 tracking-[0.15em] uppercase text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[0.9] select-none">
               Fortaleza
               <br />
               <span className="text-amber-600">do Rosário</span>
             </h1>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mb-2" />

          {/* Menu Actions */}
          <div className="flex flex-col gap-3 w-full max-w-[280px] z-20">
            <button
              onClick={handleStartGame}
              className="group relative bg-amber-700 hover:bg-amber-600 text-white font-black py-3 px-4 rounded-xl transition-all active:scale-95 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(180,83,9,0.3)] border-2 border-amber-900/50 hover:border-amber-500/50 text-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span>Iniciar Jogo</span>
            </button>
            
            <button 
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-500 hover:text-stone-300 font-bold py-3 px-4 rounded-xl transition-all uppercase tracking-[0.15em] border border-stone-800 text-xs flex items-center justify-center gap-2 opacity-60 cursor-not-allowed group"
            >
              <span>Continuar</span>
              <span className="text-[8px] bg-stone-950 px-1.5 py-0.5 rounded text-stone-700 group-hover:text-amber-900">Em Breve</span>
            </button>

            <button 
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-400 font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-[0.1em] border border-stone-800 text-[10px] opacity-80"
            >
              Configurações
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="mt-2 text-stone-600 hover:text-stone-400 text-[9px] uppercase tracking-widest transition-colors font-sans hover:underline"
            >
              Ativar Tela Cheia
            </button>
          </div>
        </div>

        {/* Cinematic Footer Info */}
        <div className="absolute bottom-6 flex flex-col items-center gap-1">
          <div className="w-12 h-0.5 bg-amber-900/50 rounded-full mb-1" />
          <div className="text-stone-700 text-[9px] font-mono tracking-[0.3em] uppercase">
            MVP v0.1.0 - 476 D.C.
          </div>
          <div className="text-stone-800 text-[8px] italic font-sans mt-1">
            Produzido por sopacrazy/castelorpg
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-950 font-sans overflow-hidden touch-none select-none">
      {/* Portrait Warning */}
      <div className="fixed inset-0 bg-stone-950 z-[100] flex flex-col items-center justify-center p-8 md:hidden portrait:flex hidden">
        <span className="text-6xl mb-4 animate-bounce">🔄</span>
        <h2 className="text-white text-xl font-bold text-center font-serif uppercase tracking-widest">Rotacione o aparelho</h2>
        <p className="text-stone-500 text-center mt-2 text-sm italic">O reino aguarda em modo paisagem...</p>
      </div>

      <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
        <GameComponent />
        <HUD />
        <Quests />
        <Inventory />
        <Dialog />
        <MobileControls />
      </div>
    </div>
  );
}
