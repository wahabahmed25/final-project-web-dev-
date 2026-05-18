"use client";

export default function CorkboardDeco() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none hidden lg:block"
      aria-hidden="true"
    >
      {/* Emoji doodles — scattered along left/right edges */}
      <span style={{ position: "absolute", top: "4%",  left: "0.8%",  fontSize: "2rem",  opacity: 0.22, transform: "rotate(-18deg)" }}>📚</span>
      <span style={{ position: "absolute", top: "16%", right: "0.8%", fontSize: "1.8rem", opacity: 0.20, transform: "rotate(12deg)"  }}>☕</span>
      <span style={{ position: "absolute", top: "30%", left: "0.6%",  fontSize: "1.9rem", opacity: 0.20, transform: "rotate(7deg)"   }}>💡</span>
      <span style={{ position: "absolute", top: "44%", right: "0.6%", fontSize: "1.8rem", opacity: 0.18, transform: "rotate(-9deg)"  }}>😴</span>
      <span style={{ position: "absolute", top: "58%", left: "0.7%",  fontSize: "1.7rem", opacity: 0.20, transform: "rotate(-22deg)" }}>✏️</span>
      <span style={{ position: "absolute", top: "72%", right: "0.7%", fontSize: "1.7rem", opacity: 0.18, transform: "rotate(16deg)"  }}>📖</span>
      <span style={{ position: "absolute", top: "84%", left: "0.8%",  fontSize: "1.8rem", opacity: 0.19, transform: "rotate(-12deg)" }}>🎒</span>
      <span style={{ position: "absolute", top: "92%", right: "0.9%", fontSize: "1.6rem", opacity: 0.20, transform: "rotate(6deg)"   }}>⭐</span>
      <span style={{ position: "absolute", top: "8%",  right: "0.5%", fontSize: "1.6rem", opacity: 0.18, transform: "rotate(-7deg)"  }}>🔖</span>
      <span style={{ position: "absolute", top: "64%", left: "0.5%",  fontSize: "1.5rem", opacity: 0.18, transform: "rotate(14deg)"  }}>🖇️</span>

      {/* Red dashed circles */}
      <svg style={{ position: "absolute", top: "9%",  left: "2.5%",  opacity: 0.18 }} width="68" height="60" fill="none">
        <ellipse cx="34" cy="30" rx="30" ry="26" stroke="#dc2626" strokeWidth="2.2" strokeDasharray="6 3" transform="rotate(-6 34 30)" />
      </svg>
      <svg style={{ position: "absolute", top: "50%", right: "2%",   opacity: 0.16 }} width="56" height="56" fill="none">
        <circle cx="28" cy="28" r="24" stroke="#dc2626" strokeWidth="2" strokeDasharray="5 4" />
      </svg>
      <svg style={{ position: "absolute", top: "78%", left: "2.8%",  opacity: 0.17 }} width="52" height="48" fill="none">
        <ellipse cx="26" cy="24" rx="23" ry="20" stroke="#dc2626" strokeWidth="2" transform="rotate(10 26 24)" />
      </svg>
      <svg style={{ position: "absolute", top: "22%", right: "2.5%", opacity: 0.15 }} width="44" height="44" fill="none">
        <circle cx="22" cy="22" r="19" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="4 3" />
      </svg>

      {/* Red squiggle underlines */}
      <svg style={{ position: "absolute", top: "24%", left: "0.8%",  opacity: 0.20 }} width="82" height="22" fill="none">
        <path d="M4 14 Q21 5 38 14 Q55 23 72 14" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <svg style={{ position: "absolute", top: "62%", right: "0.8%", opacity: 0.18 }} width="72" height="18" fill="none">
        <path d="M4 10 Q18 3 33 10 Q48 17 63 10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg style={{ position: "absolute", top: "38%", left: "0.6%",  opacity: 0.16 }} width="62" height="10" fill="none">
        <line x1="4" y1="5" x2="56" y2="5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg style={{ position: "absolute", top: "88%", right: "1.2%", opacity: 0.17 }} width="76" height="20" fill="none">
        <path d="M4 12 Q20 4 36 12 Q52 20 68 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
