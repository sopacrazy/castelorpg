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
  const [started, setStarted] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

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
