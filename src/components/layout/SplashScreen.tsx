"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
import { SPLASH_STORAGE_KEY } from "@/lib/splash";
import { cn } from "@/lib/utils";

const VISIBLE_MS = 1050;
const EXIT_MS = 300;
const REDUCED_VISIBLE_MS = 400;

type SplashPhase = "initial" | "visible" | "exit" | "done";

function clearSplashLock() {
  document.documentElement.classList.remove("splash-active");
}

export function SplashScreen() {
  const settings = useSettings();
  const [phase, setPhase] = useState<SplashPhase>("initial");

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    try {
      if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) {
        clearSplashLock();
        setPhase("done");
        return;
      }
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      clearSplashLock();
      setPhase("done");
      return;
    }

    setPhase("visible");

    const visibleDuration = reducedMotion ? REDUCED_VISIBLE_MS : VISIBLE_MS;
    const exitTimer = window.setTimeout(() => setPhase("exit"), visibleDuration);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      clearSplashLock();
    }, visibleDuration + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "splash-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black",
        phase === "visible" && "splash-screen--visible",
        phase === "exit" && "splash-screen--exit"
      )}
      aria-hidden="true"
    >
      <div className="splash-logo-wrap relative flex items-center justify-center">
        <div className="splash-glow pointer-events-none absolute h-32 w-32 rounded-full bg-accent/50 sm:h-40 sm:w-40" />
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
          <Image
            src={settings.branding.logo}
            alt={settings.name}
            fill
            priority
            className="splash-logo object-cover"
            sizes="112px"
          />
        </div>
      </div>

      <div className="splash-dots mt-8 flex items-center gap-2">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </div>
    </div>
  );
}
