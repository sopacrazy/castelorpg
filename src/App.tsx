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
  const [started, setStarted] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  if (!started) {
    return (
      <div className="w-screen h-screen bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#f27d26 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Title */}
        <div className="z-10 flex flex-col items-center gap-4 md:gap-8 px-4">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-amber-500 tracking-widest uppercase text-center drop-shadow-2xl leading-none">
            Fortaleza
            <br />
            do Rosário
          </h1>
          <p className="text-stone-400 text-sm md:text-xl italic font-serif max-w-md text-center opacity-80">
            Defenda as terras do Duque Mariom Rosário contra as hordas da noite.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4 md:mt-8 w-56 md:w-64 z-20">
            <button
              onClick={() => {
                  setStarted(true);
                  if (window.innerWidth < 1024) toggleFullscreen();
              }}
              className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 md:py-4 px-8 rounded-lg transition-all transform active:scale-95 uppercase tracking-widest shadow-lg border-2 border-amber-900 text-sm md:text-base"
            >
              Iniciar Jogo
            </button>
            <button 
              onClick={toggleFullscreen}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2 md:py-3 px-8 rounded-lg transition-colors uppercase tracking-widest border-2 border-stone-700 text-xs md:text-sm"
            >
              Ativar Tela Cheia
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-stone-600 text-sm font-mono">
          MVP v0.1.0 - 476 D.C.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-950 font-sans overflow-hidden touch-none select-none">
      {/* Portrait Warning */}
      <div className="fixed inset-0 bg-stone-950 z-[100] flex flex-col items-center justify-center p-8 md:hidden portrait:flex hidden">
        <span className="text-6xl mb-4">🔄</span>
        <h2 className="text-white text-xl font-bold text-center">Por favor, rotacione seu aparelho</h2>
        <p className="text-stone-500 text-center mt-2">Este jogo foi feito para ser jogado em modo paisagem.</p>
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
