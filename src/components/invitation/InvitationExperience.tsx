"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Envelope } from "./Envelope";
import { InvitationPaper } from "./InvitationPaper";
import { MonogramScreen } from "./MonogramScreen";
import { ReplayButton } from "./ReplayButton";
import { Countdown } from "./Countdown";
import { weddingData } from "@/data/wedding";
import { asset } from "@/lib/assets";
import { MapLink } from "./MapLink";

const TEXTURES = [
  asset("/textures/envelope-closed.png"),
  asset("/textures/wax-seal.png"),
  asset("/textures/envelope-botanical.png"),
  asset("/textures/end-botanical.png"),
  asset("/textures/paper.png"),
  asset("/textures/paper-plain.png"),
  asset("/textures/pampas-a.png"),
  asset("/textures/pampas-b.png"),
  asset("/textures/pampas-c.png"),
  asset("/textures/pampas-d.png"),
  asset("/textures/pampas-e.png"),
  asset("/textures/pampas-full.png"),
  asset("/textures/burgundy.png"),
  asset("/textures/ra-crest.png"),
  asset("/textures/grain.png"),
];

const LUXE_EASE = "power2.inOut";
const TEXT_EASE = "power2.out";

function resetStamp(root: HTMLElement | null) {
  const stamp = root?.querySelector<HTMLElement>('[data-stamp="seal"]');
  if (!stamp) return;

  stamp.getAnimations().forEach((animation) => animation.cancel());
  stamp.style.removeProperty("transform");
  stamp.style.removeProperty("opacity");
  stamp.style.removeProperty("visibility");
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const done = () => resolve();
    image.onload = done;
    image.onerror = done;
    image.src = src;
  });
}

function useTexturesReady(urls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const timeout = window.setTimeout(() => {
      if (live) setReady(true);
    }, 1200);

    Promise.all(urls.map(loadImage)).finally(() => {
      window.clearTimeout(timeout);
      if (live) setReady(true);
    });

    return () => {
      live = false;
      window.clearTimeout(timeout);
    };
  }, [urls]);

  return ready;
}

export function InvitationExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [phase, setPhase] = useState<"sealed" | "unsealed" | "playing" | "ended">("sealed");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const openTimeoutRef = useRef<number | null>(null);
  const speedRef = useRef(1);
  const holdingRef = useRef(false);
  const restoreTimeoutRef = useRef<number | null>(null);
  const texturesReady = useTexturesReady(TEXTURES);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();
    let timeline: gsap.core.Timeline;

    try {
      timeline = gsap.timeline({
        paused: true,
        defaults: { ease: LUXE_EASE, immediateRender: false },
        onComplete: () => {
          holdingRef.current = false;
          speedRef.current = 1;
          timeline.timeScale(1);
          root.setAttribute("data-speed", "1");
          phaseRef.current = "ended";
          setPhase("ended");
        },
      });
    } catch {
      return;
    }

    const left = q('[data-flap="left"]');
    const right = q('[data-flap="right"]');
    const top = q('[data-flap="top"]');
    const bottom = q('[data-flap="bottom"]');
    const leftShadow = q('[data-shadow="left"]');
    const rightShadow = q('[data-shadow="right"]');
    const topShadow = q('[data-shadow="top"]');
    const bottomShadow = q('[data-shadow="bottom"]');
    const envelope = q('[data-layer="envelope"]');
    const paper = q('[data-layer="paper"]');
    const monogram = q('[data-layer="monogram"]');
    const crest = q("[data-crest='ra']");
    const replay = q("[data-layer='replay']");
    const grain = q(".grain");
    const cover = q('[data-cover="closed"]');
    const endSheet = q(".end-sheet");

    timeline.set(q(".scene"), { opacity: 0, visibility: "hidden", filter: "none" }, 0);
    timeline.set(
      q(".ch"),
      { opacity: 0, y: 8, filter: "blur(5px)" },
      0,
    );
    timeline.set(q(".countdown-wrap, .scene .countdown, .scene .map-link"), {
      opacity: 0,
      y: 8,
      filter: "blur(5px)",
    }, 0);
    timeline.set(monogram, { opacity: 0, visibility: "hidden" }, 0);
    timeline.set(crest, { opacity: 0, scale: 0.96 }, 0);
    timeline.set(replay, { opacity: 0, scale: 0.92, xPercent: -50, pointerEvents: "none" }, 0);
    timeline.set(endSheet, { opacity: 0 }, 0);
    timeline.set(paper, { opacity: 1 }, 0);
    timeline.set(
      q("[data-stem]"),
      { opacity: 0, scaleX: 0.22, scaleY: 0.05, filter: "contrast(0.82) brightness(1.04)" },
      0,
    );
    timeline.set(q('[data-stem="full"]'), { scaleX: 1, scaleY: 1, filter: "none" }, 0);
    timeline.set(envelope, { opacity: 1, visibility: "visible" }, 0);
    timeline.set(cover, { opacity: 1, visibility: "visible" }, 0);
    timeline.set(grain, { opacity: 0.07 }, 0);
    timeline.set(
      [left, right, top, bottom],
      {
        xPercent: 0,
        yPercent: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        transformPerspective: 1600,
      },
      0,
    );
    timeline.set(
      [leftShadow, rightShadow, topShadow, bottomShadow],
      { xPercent: 0, yPercent: 0, opacity: 0 },
      0,
    );

    if (reduced) {
      timeline.to(cover, { opacity: 0, duration: 0.6, ease: TEXT_EASE }, 0.1);
      timeline.to(envelope, { opacity: 0, duration: 0.9, ease: TEXT_EASE }, 0.15);
      timeline.set(envelope, { visibility: "hidden" });

      addScene(timeline, q, "intro", 1.0, 3.8);
      addScene(timeline, q, "families", 4.2, 8.2);
      addScene(timeline, q, "names", 8.6, 12.4);
      addScene(timeline, q, "invite", 12.8, 16.0);
      addScene(timeline, q, "date", 16.4, 19.8);
      addScene(timeline, q, "time", 20.2, 23.0);
      addScene(timeline, q, "rsvp", 23.4, 27.2);

      timeline.set(q("[data-stem]"), {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "contrast(1) brightness(1)",
      }, 1.0);

      timeline.to(paper, { opacity: 0, duration: 0.8, ease: TEXT_EASE }, 27.4);
      timeline.set(monogram, { visibility: "visible" }, 27.6);
      timeline.to(monogram, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 27.6);
      timeline.to(crest, { opacity: 1, scale: 1, duration: 1.0, ease: TEXT_EASE }, 27.75);
      timeline.to(endSheet, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 27.85);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, xPercent: -50, pointerEvents: "auto", duration: 0.5, ease: TEXT_EASE },
        28.3,
      );
    } else {
      timeline.to(cover, { opacity: 0, duration: 0.28, ease: "power2.out" }, 0.08);
      timeline.set(cover, { visibility: "hidden" }, 0.4);

      timeline.to(
        left,
        { xPercent: -118, rotateY: -8, duration: 2.45, ease: "power2.inOut" },
        0.22,
      );
      timeline.to(
        leftShadow,
        { xPercent: -118, opacity: 0.72, duration: 1.05, ease: "power2.out" },
        0.22,
      );
      timeline.to(leftShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.2);

      timeline.to(
        right,
        { xPercent: 118, rotateY: 8, duration: 2.45, ease: "power2.inOut" },
        0.42,
      );
      timeline.to(
        rightShadow,
        { xPercent: 118, opacity: 0.72, duration: 1.05, ease: "power2.out" },
        0.42,
      );
      timeline.to(rightShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.4);

      timeline.to(
        top,
        { yPercent: -118, rotateX: 8, duration: 2.5, ease: "power2.inOut" },
        0.68,
      );
      timeline.to(
        topShadow,
        { yPercent: -118, opacity: 0.65, duration: 1.1, ease: "power2.out" },
        0.68,
      );
      timeline.to(topShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.7);

      timeline.to(
        bottom,
        { yPercent: 118, rotateX: -8, duration: 2.5, ease: "power2.inOut" },
        0.92,
      );
      timeline.to(
        bottomShadow,
        { yPercent: 118, opacity: 0.65, duration: 1.1, ease: "power2.out" },
        0.92,
      );
      timeline.to(bottomShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.95);

      timeline.set(envelope, { visibility: "hidden" }, 3.2);
      // Let the envelope opening land before easing the rest of the
      // invitation into its slower ceremonial rhythm. Holding the page still
      // uses the existing fast-forward behavior and is not overridden here.
      timeline.call(() => {
        if (!holdingRef.current && speedRef.current === 1) {
          timeline.timeScale(0.6);
        }
      }, [], 3.2);

      addCinematicScene(timeline, q, "intro", {
        start: 3.2,
        fadeOut: 6.05,
        hidden: 7.45,
        fadeDuration: 1.35,
        groups: [
          { selector: '[data-part="bismillah"] .ch', at: 3.25, stagger: 0.03 },
          { selector: '[data-part="verse"] .ch', at: 3.55, stagger: 0.02 },
          { selector: '[data-part="source"] .ch', at: 4.25, stagger: 0.03 },
        ],
      });

      growStems(timeline, q);

      addCinematicScene(timeline, q, "families", {
        start: 6.85,
        fadeOut: 11.55,
        hidden: 12.2,
        groups: [
          { selector: '[data-part="families-feeling"] .ch, [data-part="families-title"] .ch', at: 6.9, stagger: 0.03 },
          { selector: '[data-part="father-one"] .ch, [data-part="families-and"] .ch, [data-part="father-two"] .ch', at: 7.35, stagger: 0.03 },
          { selector: '[data-part="families-invite"] .ch', at: 8.2, stagger: 0.03 },
        ],
      });

      addCinematicScene(timeline, q, "names", {
        start: 12.35,
        fadeOut: 16.35,
        hidden: 17.0,
        groups: [
          { selector: '[data-part="groom"] .couple-label .ch, [data-part="groom"] .couple-title .ch, [data-part="bride"] .couple-label .ch, [data-part="bride"] .couple-title .ch', at: 12.45, stagger: 0.04 },
          { selector: '[data-part="couple-and"] .ch', at: 13.15, stagger: 0.04 },
        ],
      });
      addNamesInkReveal(timeline, q, 12.95);

      addCinematicScene(timeline, q, "invite", {
        start: 16.95,
        fadeOut: 19.95,
        hidden: 20.55,
        groups: [
          { selector: '[data-part="invite-one"] .ch, [data-part="invite-two"] .ch', at: 17.05, stagger: 0.03 },
        ],
      });

      addCinematicScene(timeline, q, "date", {
        start: 20.5,
        fadeOut: 26.55,
        hidden: 27.2,
        groups: [
          { selector: '[data-part="save"] .ch, [data-part="date"] .ch', at: 20.6, stagger: 0.03 },
          { selector: '[data-part="time-title"] .ch, [data-part="time-start"] .ch, [data-part="time-end"] .ch', at: 22.0, stagger: 0.03 },
        ],
      });

      addCinematicScene(timeline, q, "rsvp", {
        start: 27.65,
        fadeOut: 32.5,
        hidden: 33.15,
        groups: [
          { selector: '[data-part="final-title"] .ch, [data-part="final-message"] .ch', at: 27.75, stagger: 0.03 },
          { selector: '[data-part="rsvp-name"] .ch, [data-part="call"] .ch, [data-part="city"] .ch', at: 28.7, stagger: 0.03 },
          { selector: ".scene-rsvp .map-link", at: 29.3, stagger: 0.03 },
        ],
      });

      timeline.to(paper, { opacity: 0, duration: 1.05, ease: "power2.inOut" }, 32.75);
      timeline.set(monogram, { visibility: "visible" }, 33.1);
      timeline.to(monogram, { opacity: 1, duration: 1.05, ease: "power2.inOut" }, 33.1);
      timeline.to(grain, { opacity: 0.045, duration: 0.8 }, 33.3);
      timeline.to(
        crest,
        { opacity: 1, scale: 1, duration: 1.25, ease: "power2.out" },
        33.45,
      );
      timeline.to(endSheet, { opacity: 1, duration: 1.1, ease: "power2.out" }, 33.75);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, xPercent: -50, pointerEvents: "auto", duration: 0.55, ease: TEXT_EASE },
        34.5,
      );
    }

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (phase !== "unsealed") return;
    const stamp = rootRef.current?.querySelector<HTMLElement>('[data-stamp="seal"]');
    if (!stamp) return;

    const fall = Math.round((rootRef.current?.querySelector(".stage")?.getBoundingClientRect().height ?? 720) * 1.15);
    const dropMs = 980;
    const animation = stamp.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg) scale(1)", opacity: 1, offset: 0 },
        { transform: "translate(-50%, -50%) rotate(-4deg) scale(0.94)", opacity: 1, offset: 0.1 },
        { transform: "translate(-50%, calc(-50% + 18px)) rotate(8deg) scale(1)", opacity: 1, offset: 0.18 },
        { transform: `translate(-50%, ${fall}px) rotate(26deg) scale(1)`, opacity: 0, offset: 1 },
      ],
      {
        duration: dropMs,
        easing: "cubic-bezier(0.55, 0.06, 0.85, 0.19)",
        fill: "forwards",
      },
    );

    openTimeoutRef.current = window.setTimeout(() => {
      openTimeoutRef.current = null;
      const timeline = timelineRef.current;
      if (!timeline || phaseRef.current !== "unsealed") return;
      phaseRef.current = "playing";
      speedRef.current = 1;
      setPhase("playing");
      timeline.timeScale(1);
      rootRef.current?.setAttribute("data-speed", "1");
      timeline.play(0);
      if (holdingRef.current) {
        speedRef.current = 2.55;
        timeline.timeScale(2.55);
        rootRef.current?.setAttribute("data-speed", "2.55");
      }
    }, dropMs + 220);

    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      if (phaseRef.current !== "playing") animation.cancel();
    };
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "sealed") return;
    resetStamp(rootRef.current);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (restoreTimeoutRef.current !== null) {
        window.clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, []);

  const begin = () => {
    if (phaseRef.current !== "sealed") return;
    phaseRef.current = "unsealed";
    setPhase("unsealed");
  };

  const replay = () => {
    const timeline = timelineRef.current;
    if (!timeline || phaseRef.current === "playing") return;
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    timeline.pause(0);
    timeline.timeScale(1);
    speedRef.current = 1;
    rootRef.current?.setAttribute("data-speed", "1");
    holdingRef.current = false;
    if (restoreTimeoutRef.current !== null) {
      window.clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
    resetStamp(rootRef.current);
    phaseRef.current = "sealed";
    setPhase("sealed");
  };

  const skipSealDelay = () => {
    const timeline = timelineRef.current;
    if (phaseRef.current !== "unsealed" || !timeline) return;
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    phaseRef.current = "playing";
    speedRef.current = 1;
    setPhase("playing");
    timeline.timeScale(1);
    timeline.play(0);
    if (holdingRef.current) setPlaybackSpeed(2.55, true);
  };

  const setPlaybackSpeed = (value: number, instant = false) => {
    const timeline = timelineRef.current;
    if (!timeline || phaseRef.current !== "playing") return;
    speedRef.current = value;
    rootRef.current?.setAttribute("data-speed", String(value));
    gsap.killTweensOf(timeline);
    if (instant) {
      timeline.timeScale(value);
      return;
    }
    gsap.to(timeline, { timeScale: value, duration: 0.18, ease: "power2.out", overwrite: true });
  };

  const startFast = () => {
    holdingRef.current = true;
    if (restoreTimeoutRef.current !== null) {
      window.clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
    if (phaseRef.current === "playing") setPlaybackSpeed(2.55, true);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    startFast();
    if (phaseRef.current === "sealed") {
      begin();
      return;
    }
    if (phaseRef.current === "unsealed") {
      skipSealDelay();
    }
  };

  const onPointerEnd = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    restoreTimeoutRef.current = window.setTimeout(() => {
      restoreTimeoutRef.current = null;
      if (holdingRef.current) return;
      setPlaybackSpeed(1);
    }, 220);
  };

  return (
    <div
      ref={rootRef}
      className={`invitation ${phase}`}
      data-ready={texturesReady}
    >
      <div className="stage-frame">
        <div
          className="stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerEnd}
          onKeyDown={(event) => {
            if (phase === "ended") return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            if (event.repeat) return;
            startFast();
            if (phaseRef.current === "sealed") begin();
            else if (phaseRef.current === "unsealed") skipSealDelay();
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ") onPointerEnd();
          }}
          role={phase === "ended" ? undefined : "button"}
          tabIndex={phase === "ended" ? -1 : 0}
          aria-label={
            phase === "sealed"
              ? "افتح دعوة الزفاف"
              : phase === "playing"
                ? "اضغط مطولًا لتسريع الدعوة"
                : undefined
          }
        >
          <InvitationPaper />
          <MonogramScreen />
          <Envelope />
          <div className="wax-seal" data-stamp="seal" aria-hidden="true">
            <img src={asset("/textures/wax-seal.png")} alt="" draggable={false} />
          </div>
          <div className="grain" />
          <p className="open-hint">
            {phase === "sealed" ? "اضغط لفتح الدعوة" : ""}
          </p>
          <div className="end-sheet">
            <Countdown />
            <div className="end-crest-wrap" aria-hidden="true">
              <img
                className="monogram-crest"
                data-crest="ra"
                src={asset("/textures/ra-crest.png")}
                alt=""
                draggable={false}
              />
            </div>
            <div className="end-details">
              <p className="end-date arabic-display">{weddingData.date}</p>
              <p className="end-time arabic-display">
                <span>{weddingData.time.starts}</span>
                <span className="end-time-separator" aria-hidden="true">•</span>
                <span>{weddingData.time.ends}</span>
              </p>
            </div>
            <div className="end-location">
              <p className="end-venue arabic-display">{weddingData.venue}</p>
              <p className="end-address arabic-display">{weddingData.address}</p>
              <MapLink className="end-map" />
            </div>
          </div>
          <ReplayButton onReplay={replay} />
        </div>
      </div>
    </div>
  );
}

function growStems(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
) {
  const stems = [
    { id: "a", at: 5.48, origin: "7% 100%", duration: 3.1, scaleX: 0.18 },
    { id: "b", at: 6.22, origin: "12% 100%", duration: 2.85, scaleX: 0.24 },
    { id: "c", at: 6.95, origin: "18% 100%", duration: 2.65, scaleX: 0.32 },
    { id: "d", at: 7.42, origin: "10% 100%", duration: 2.35, scaleX: 0.38 },
    { id: "e", at: 7.92, origin: "23% 100%", duration: 2.5, scaleX: 0.28 },
  ];

  for (const stem of stems) {
    const el = q(`[data-stem="${stem.id}"]`);
    timeline.set(
      el,
      {
        opacity: 0,
        scaleX: stem.scaleX,
        scaleY: 0.04,
        transformOrigin: stem.origin,
        filter: "contrast(0.8) brightness(1.05)",
      },
      0,
    );
    timeline.to(el, { opacity: 1, duration: 0.42, ease: "power1.out" }, stem.at);
    timeline.to(
      el,
      { scaleY: 1, duration: stem.duration, ease: "power2.out" },
      stem.at,
    );
    timeline.to(
      el,
      { scaleX: 1, duration: stem.duration * 0.82, ease: "power2.out" },
      stem.at + 0.32,
    );
    timeline.to(
      el,
      { filter: "contrast(1) brightness(1)", duration: stem.duration * 0.7, ease: "power1.out" },
      stem.at + 0.45,
    );
  }

  timeline.to(
    q('[data-stem="full"]'),
    { opacity: 1, duration: 1.85, ease: "power1.inOut" },
    8.7,
  );
}

type SceneOptions = {
  start: number;
  fadeOut: number;
  hidden: number;
  fadeDuration?: number;
  groups: Array<{
    selector: string;
    at: number;
    stagger: number | { amount?: number; from?: "start" | "center" | "random" | "end"; each?: number };
  }>;
};

function addCinematicScene(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
  name: string,
  options: SceneOptions,
) {
  const scene = q(`[data-scene="${name}"]`);

  timeline.set(scene, { visibility: "visible", opacity: 1 }, options.start);

  for (const group of options.groups) {
    timeline.to(
      q(group.selector),
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.45,
        stagger: group.stagger,
        ease: TEXT_EASE,
      },
      group.at,
    );
  }

  timeline.to(
    scene,
    {
      opacity: 0,
      filter: "blur(4px)",
      duration: options.fadeDuration ?? 0.95,
      ease: "power2.inOut",
    },
    options.fadeOut,
  );
  timeline.set(q(`[data-scene="${name}"] .ch`), {
    opacity: 0,
    y: 8,
    filter: "blur(5px)",
  }, options.hidden);
  timeline.set(scene, { visibility: "hidden", filter: "blur(0px)" }, options.hidden);
}

function addScene(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
  name: string,
  start: number,
  end: number,
) {
  const scene = q(`[data-scene="${name}"]`);
  timeline.set(scene, { visibility: "visible" }, start);
  timeline.fromTo(
    scene,
    { opacity: 0 },
    { opacity: 1, duration: 0.9, ease: TEXT_EASE },
    start,
  );
  timeline.to(q(`[data-scene="${name}"] .ch`), {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.01,
  }, start);
  timeline.to(scene, { opacity: 0, duration: 0.8, ease: TEXT_EASE }, end);
  timeline.set(scene, { visibility: "hidden" }, end + 0.6);
}

function addNamesInkReveal(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
  start: number,
) {
  const scene = q('[data-scene="names"]')[0] as HTMLElement | undefined;
  const pen = q('[data-writing-pen]')[0];
  const words = [
    q('[data-part="groom"] .script-name .ch-connected')[0],
    q('[data-part="bride"] .script-name .ch-connected')[0],
  ].filter((element): element is HTMLElement => element instanceof HTMLElement);

  if (!scene || !pen || words.length !== 2) return;

  const sceneRect = scene.getBoundingClientRect();
  const penRect = pen.getBoundingClientRect();
  const nibX = penRect.width * 0.91;
  const nibY = penRect.height * 0.91;
  const writingPoint = (word: HTMLElement, side: "right" | "left") => {
    const rect = word.getBoundingClientRect();
    return {
      x: (side === "right" ? rect.right : rect.left) - sceneRect.left - nibX,
      y: rect.top - sceneRect.top + rect.height * 0.68 - nibY,
    };
  };
  const firstStart = writingPoint(words[0], "right");
  const firstEnd = writingPoint(words[0], "left");
  const secondStart = writingPoint(words[1], "right");
  const secondEnd = writingPoint(words[1], "left");

  const writeWord = (
    word: HTMLElement,
    from: { x: number; y: number },
    to: { x: number; y: number },
    duration: number,
    at: number,
  ) => {
    const driver = { progress: 0 };
    timeline.set(word, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      clipPath: "inset(0 0 0 100%)",
    }, at);

    timeline.to(driver, {
      progress: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const progress = driver.progress;
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress + Math.sin(progress * Math.PI) * sceneRect.height * 0.018;
        const revealInset = `${Math.max(0, (1 - progress) * 100)}%`;

        gsap.set(pen, { x, y });
        gsap.set(word, { clipPath: `inset(0 0 0 ${revealInset})` });
      },
    }, at);
    timeline.set(word, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      clipPath: "inset(0 0 0 0%)",
    }, at + duration + 0.01);
  };

  timeline.set(pen, {
    opacity: 0,
    x: firstStart.x + sceneRect.width * 0.1,
    y: firstStart.y - sceneRect.height * 0.12,
    rotation: -20,
    transformOrigin: "92% 80%",
  }, start - 0.38);
  timeline.to(pen, {
    opacity: 1,
    x: firstStart.x,
    y: firstStart.y,
    rotation: -12,
    duration: 0.58,
    ease: "power2.out",
  }, start - 0.38);
  writeWord(words[0], firstStart, firstEnd, 1.45, start);
  timeline.to(pen, {
    x: secondStart.x,
    y: secondStart.y - sceneRect.height * 0.03,
    rotation: -17,
    duration: 0.52,
    ease: "power2.inOut",
  }, start + 1.65);
  writeWord(words[1], secondStart, secondEnd, 1.35, start + 1.85);
  timeline.to(pen, {
    opacity: 0,
    x: sceneRect.width * 1.12,
    y: sceneRect.height * 0.12,
    rotation: -20,
    duration: 0.72,
    ease: "power2.in",
  }, start + 3.45);
}
