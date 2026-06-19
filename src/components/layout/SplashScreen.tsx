"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
import {
  SPLASH_FADE_IN_MS,
  SPLASH_EXIT_MS,
  SPLASH_HOLD_MS,
  SPLASH_STORAGE_KEY,
} from "@/lib/splash";
import { cn } from "@/lib/utils";

const REDUCED_HOLD_MS = 500;
const REDUCED_EXIT_MS = 200;
const LOGO_LOAD_TIMEOUT_MS = 2500;

type SplashPhase = "initial" | "visible" | "exit" | "done";

function clearSplashLock() {
  document.documentElement.classList.remove("splash-active");
}

export function SplashScreen() {
  const settings = useSettings();
  const [phase, setPhase] = useState<SplashPhase>("initial");
  const [shouldRun, setShouldRun] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const logoReadyRef = useRef(false);

  const markLogoReady = useCallback(() => {
    if (logoReadyRef.current) return;
    logoReadyRef.current = true;
    setLogoReady(true);
  }, []);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) {
        clearSplashLock();
        setPhase("done");
        return;
      }
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
      setShouldRun(true);
    } catch {
      clearSplashLock();
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (!shouldRun || logoReady) return;

    const fallback = window.setTimeout(markLogoReady, LOGO_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(fallback);
  }, [shouldRun, logoReady, markLogoReady]);

  useEffect(() => {
    if (!shouldRun || !logoReady || phase !== "initial") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fadeIn = reducedMotion ? 0 : SPLASH_FADE_IN_MS;
    const hold = reducedMotion ? REDUCED_HOLD_MS : SPLASH_HOLD_MS;
    const exit = reducedMotion ? REDUCED_EXIT_MS : SPLASH_EXIT_MS;

    setPhase("visible");

    const exitTimer = window.setTimeout(() => setPhase("exit"), fadeIn + hold);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      clearSplashLock();
    }, fadeIn + hold + exit);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [shouldRun, logoReady, phase]);

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
        <div
          className="splash-glow pointer-events-none absolute z-0 h-44 w-44 rounded-full bg-accent/70 sm:h-52 sm:w-52"
          aria-hidden
        />
        <div
          className="relative z-10 h-[120px] w-[120px] overflow-hidden rounded-2xl shadow-[0_0_32px_rgba(255,92,0,0.25)] sm:h-36 sm:w-36"
        >
          <Image
            src={settings.branding.logo}
            alt={settings.name}
            fill
            priority
            className="splash-logo object-cover"
            sizes="(max-width: 640px) 120px, 144px"
            onLoadingComplete={markLogoReady}
            onLoad={markLogoReady}
          />
        </div>
      </div>

      <div className="splash-dots mt-10 flex items-center gap-2.5">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </div>
    </div>
  );
}
