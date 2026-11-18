"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Watch, WatchArtConfig } from "@/data/watches";

interface WatchImageProps {
  watch: Watch;
  uid: string;
  live?: boolean;
  className?: string;
}

export default function WatchImage({ watch, uid, live = false, className = "" }: WatchImageProps) {
  const [missing, setMissing] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(watch.image);
  }, [watch.image]);

  if (watch.image && missing !== watch.image) {
    return (
      <Image
        ref={imgRef}
        src={watch.image}
        alt={`${watch.brand} ${watch.model}`}
        fill
        unoptimized
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
        onError={() => setMissing(watch.image)}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`watch-float h-full w-full ${className}`}>
      <WatchArt art={watch.art} caseSize={watch.caseSize} uid={`${uid}-${watch.id}`} live={live} />
    </div>
  );
}

const METALS = {
  steel: { hi: "#F4F5F6", mid: "#B4B8BD", lo: "#63676C", edge: "#2A2C2F" },
  gold: { hi: "#F7E9B0", mid: "#D4AF37", lo: "#8C6B1D", edge: "#4A380F" },
  black: { hi: "#707070", mid: "#2F2F2F", lo: "#141414", edge: "#050505" },
} as const;

const CX = 150;
const CY = 210;
const STRAP_TOP = "M110 6 H190 L198 130 H102 Z";
const STRAP_BOTTOM = "M102 290 H198 L190 414 H110 Z";
const HOURS = Array.from({ length: 12 }, (_, i) => i);

function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
}

function WatchArt({
  art,
  caseSize,
  uid,
  live,
}: {
  art: WatchArtConfig;
  caseSize: number;
  uid: string;
  live: boolean;
}) {
  const body = art.metal === "twoTone" ? METALS.steel : METALS[art.metal];
  const accent = art.metal === "twoTone" ? METALS.gold : body;
  const warm = art.metal === "gold" || art.metal === "twoTone";
  const lightDial = isLight(art.dial);

  const marker = lightDial ? "#17181A" : warm ? "#E9CF7A" : "#F5F5F5";
  const hands = art.shape === "rect" && lightDial ? "#1F3A7A" : marker;
  const seconds = lightDial ? "#B3261E" : "#D4AF37";
  const strapBase = art.strap === "bracelet" ? body.mid : (art.strapColor ?? "#161616");

  const scale = 0.88 + ((Math.min(Math.max(caseSize, 22), 44) - 31) / 10) * 0.12;

  const id = (name: string) => `${uid}-${name}`;
  const fill = (name: string) => `url(#${uid}-${name})`;
  const around = (deg: number) => `rotate(${deg} ${CX} ${CY})`;

  const hasDate = art.complication === "date" || art.complication === "gmt";

  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={body.hi} />
          <stop offset="0.4" stopColor={body.mid} />
          <stop offset="0.75" stopColor={body.lo} />
          <stop offset="1" stopColor={body.mid} />
        </linearGradient>
        <linearGradient id={id("accent")} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={accent.hi} />
          <stop offset="0.4" stopColor={accent.mid} />
          <stop offset="0.75" stopColor={accent.lo} />
          <stop offset="1" stopColor={accent.mid} />
        </linearGradient>
        <linearGradient id={id("strap")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.78" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={id("sheen")} cx="0.5" cy="0.36" r="0.72">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("strapclip")}>
          <path d={STRAP_TOP} />
          <path d={STRAP_BOTTOM} />
        </clipPath>
        <clipPath id={id("rectmarkers")}>
          <path clipRule="evenodd" d="M106 135h88v150h-88z M121 153h58v114h-58z" />
        </clipPath>
      </defs>

      <g transform={`translate(${CX} ${CY}) scale(${scale}) translate(${-CX} ${-CY})`}>
        {art.shape === "round" && (
          <rect x="88" y="100" width="124" height="220" rx="12" fill={fill("body")} />
        )}

        <path d={STRAP_TOP} fill={strapBase} />
        <path d={STRAP_BOTTOM} fill={strapBase} />
        <g clipPath={fill("strapclip")}>
          {art.strap === "bracelet" && (
            <>
              {art.metal === "twoTone" && (
                <rect x="131" y="0" width="38" height="420" fill={fill("accent")} />
              )}
              {Array.from({ length: 9 }, (_, i) => [16 + i * 13, 300 + i * 13])
                .flat()
                .map((y) => (
                  <line
                    key={y}
                    x1="100"
                    x2="200"
                    y1={y}
                    y2={y}
                    stroke={body.edge}
                    strokeOpacity="0.6"
                    strokeWidth="1.4"
                  />
                ))}
              <line x1="131" x2="131" y1="0" y2="420" stroke={body.edge} strokeOpacity="0.45" />
              <line x1="169" x2="169" y1="0" y2="420" stroke={body.edge} strokeOpacity="0.45" />
            </>
          )}
          {art.strap === "leather" && (
            <g stroke="#fff" strokeOpacity="0.28" strokeDasharray="5 4" strokeWidth="1">
              <line x1="115" y1="10" x2="108" y2="128" />
              <line x1="185" y1="10" x2="192" y2="128" />
              <line x1="108" y1="292" x2="115" y2="410" />
              <line x1="192" y1="292" x2="185" y2="410" />
            </g>
          )}
          {art.strap === "rubber" && (
            <g stroke="#000" strokeOpacity="0.55" strokeWidth="2.5">
              {[66, 76, 86, 334, 344, 354].map((y) => (
                <line key={y} x1="100" x2="200" y1={y} y2={y} />
              ))}
            </g>
          )}
        </g>
        <path d={STRAP_TOP} fill={fill("strap")} />
        <path d={STRAP_BOTTOM} fill={fill("strap")} />

        {art.shape === "round" ? (
          <g>
            <rect x="252" y="198" width="17" height="24" rx="4" fill={fill("body")} />
            <g stroke={body.edge} strokeOpacity="0.5">
              <line x1="257" x2="268" y1="204" y2="204" />
              <line x1="257" x2="268" y1="210" y2="210" />
              <line x1="257" x2="268" y1="216" y2="216" />
            </g>
            {art.complication === "chrono" && (
              <>
                <rect x="250" y="203" width="15" height="14" rx="2" fill={fill("body")} transform={around(-32)} />
                <rect x="250" y="203" width="15" height="14" rx="2" fill={fill("body")} transform={around(32)} />
              </>
            )}

            <circle cx={CX} cy={CY} r="106" fill={fill("body")} stroke={body.edge} strokeOpacity="0.4" />
            <circle cx={CX} cy={CY} r="101" fill={fill("accent")} />
            {art.bezel && (
              <>
                <circle cx={CX} cy={CY} r="97" fill={art.bezel} />
                <circle cx={CX} cy={CY} r="97" fill={fill("sheen")} />
                {HOURS.filter((i) => i !== 0).map((i) => (
                  <rect
                    key={i}
                    x={CX - 1.2}
                    y={CY - 95}
                    width="2.4"
                    height="7"
                    fill="#F5F5F5"
                    fillOpacity="0.85"
                    transform={around(i * 30)}
                  />
                ))}
                <path d="M145 115 H155 L150 124 Z" fill="#F5F5F5" fillOpacity="0.9" />
              </>
            )}
            <circle cx={CX} cy={CY} r="86" fill={body.edge} />

            <circle cx={CX} cy={CY} r="82" fill={art.dial} />
            <circle cx={CX} cy={CY} r="82" fill={fill("sheen")} />
            <circle
              cx={CX}
              cy={CY}
              r="78"
              fill="none"
              stroke={marker}
              strokeOpacity="0.55"
              strokeWidth="3"
              strokeDasharray="0.9 7.268"
              strokeDashoffset="0.45"
            />
            {HOURS.filter((i) => !(hasDate && i === 3)).map((i) => {
              const w = i % 3 === 0 ? 5 : 3;
              return (
                <rect
                  key={i}
                  x={CX - w / 2}
                  y={CY - 74}
                  width={w}
                  height="13"
                  rx="0.8"
                  fill={marker}
                  transform={around(i * 30)}
                />
              );
            })}

            {hasDate && (
              <>
                <rect x="206" y="202" width="18" height="16" rx="1.5" fill="#F7F7F5" stroke={marker} strokeOpacity="0.4" />
                <text x="215" y="214" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111" fontFamily="system-ui, sans-serif">
                  28
                </text>
              </>
            )}

            {art.complication === "chrono" &&
              (
                [
                  [114, 210, 40],
                  [186, 210, 250],
                  [150, 246, 130],
                ] as const
              ).map(([x, y, deg]) => (
                <g key={`${x}-${y}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="17"
                    fill={lightDial ? "#151515" : "#1D1D1D"}
                    stroke={marker}
                    strokeOpacity="0.35"
                  />
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y - 12}
                    stroke="#F5F5F5"
                    strokeWidth="1.4"
                    transform={`rotate(${deg} ${x} ${y})`}
                  />
                  <circle cx={x} cy={y} r="1.8" fill="#F5F5F5" />
                </g>
              ))}

            {art.complication === "gmt" && (
              <g transform={around(140)}>
                <line x1={CX} y1={CY} x2={CX} y2="148" stroke="#C2372E" strokeWidth="1.6" />
                <path d="M150 134 L145 148 H155 Z" fill="#C2372E" />
              </g>
            )}

            <g stroke="#000" strokeOpacity="0.25" strokeWidth="0.5">
              <rect x="147.2" y="164" width="5.6" height="52" rx="2.4" fill={hands} transform={around(305)} />
              <rect x="148.2" y="140" width="3.6" height="78" rx="1.8" fill={hands} transform={around(60)} />
            </g>
            <g className={live ? "seconds-sweep" : undefined} transform={around(212)}>
              <line x1={CX} y1="232" x2={CX} y2="134" stroke={seconds} strokeWidth="1.3" />
              <circle cx={CX} cy="228" r="3" fill={seconds} />
            </g>
            <circle cx={CX} cy={CY} r="4.2" fill={hands} />
            <circle cx={CX} cy={CY} r="1.5" fill={body.edge} />

            <circle cx={CX} cy={CY} r="82" fill={fill("glass")} />
          </g>
        ) : (
          <g>
            <rect x="84" y="104" width="15" height="212" rx="5" fill={fill("body")} />
            <rect x="201" y="104" width="15" height="212" rx="5" fill={fill("body")} />
            <rect x="214" y="200" width="12" height="20" rx="3" fill={fill("body")} />
            <circle cx="228" cy="210" r="5" fill="#1F3A7A" />

            <rect x="92" y="118" width="116" height="184" rx="8" fill={fill("accent")} />
            <rect x="99" y="127" width="102" height="166" rx="4" fill={body.edge} />

            <rect x="101" y="129" width="98" height="162" rx="3" fill={art.dial} />
            <rect x="101" y="129" width="98" height="162" rx="3" fill={fill("sheen")} />
            <g clipPath={fill("rectmarkers")}>
              {HOURS.map((i) => (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={CX}
                  y2="90"
                  stroke={marker}
                  strokeWidth={i % 3 === 0 ? 5 : 3}
                  transform={around(i * 30)}
                />
              ))}
            </g>
            <rect x="125" y="157" width="50" height="106" fill="none" stroke={marker} strokeOpacity="0.6" />
            <rect x="129" y="161" width="42" height="98" fill="none" stroke={marker} strokeOpacity="0.6" />

            <rect x="147.6" y="178" width="4.8" height="38" rx="2" fill={hands} transform={around(305)} />
            <rect x="148.4" y="162" width="3.2" height="54" rx="1.6" fill={hands} transform={around(60)} />
            <circle cx={CX} cy={CY} r="3.6" fill={hands} />

            <rect x="101" y="129" width="98" height="162" rx="3" fill={fill("glass")} />
          </g>
        )}
      </g>
    </svg>
  );
}
