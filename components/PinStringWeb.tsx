"use client";

const PINS = [
  { x: 8,  y: 12 }, { x: 22, y: 6  }, { x: 38, y: 18 }, { x: 55, y: 7  },
  { x: 70, y: 14 }, { x: 85, y: 9  }, { x: 93, y: 24 }, { x: 88, y: 40 },
  { x: 75, y: 50 }, { x: 60, y: 39 }, { x: 42, y: 46 }, { x: 25, y: 41 },
  { x: 10, y: 53 }, { x: 5,  y: 70 }, { x: 18, y: 80 }, { x: 33, y: 66 },
  { x: 49, y: 76 }, { x: 65, y: 63 }, { x: 80, y: 73 }, { x: 92, y: 59 },
  { x: 95, y: 83 }, { x: 72, y: 89 }, { x: 50, y: 93 }, { x: 30, y: 86 },
  { x: 14, y: 93 },
];

const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],
  [0,12],[2,9],[3,8],[4,7],[1,10],[0,11],[5,8],[6,9],
  [12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[12,19],
  [8,17],[9,16],[10,15],[7,18],[11,14],
  [13,24],[14,23],[15,22],[16,21],[17,20],[19,20],
  [20,21],[21,22],[22,23],[23,24],[20,22],[21,23],
];

const PIN_COLORS = ["#e53e3e","#f59e0b","#3b82f6","#10b981","#8b5cf6","#ec4899","#ef4444","#06b6d4"];

export default function PinStringWeb() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.55,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* strings */}
        {CONNECTIONS.map(([a, b], i) => (
          <line
            key={i}
            x1={PINS[a].x} y1={PINS[a].y}
            x2={PINS[b].x} y2={PINS[b].y}
            stroke="var(--pin-string)"
            strokeWidth="0.18"
            opacity="0.65"
          />
        ))}

        {/* pins */}
        {PINS.map((pin, i) => (
          <g key={i}>
            {/* pin shadow */}
            <circle cx={pin.x + 0.3} cy={pin.y + 0.5} r="0.9" fill="rgba(0,0,0,0.18)" />
            {/* pin body */}
            <circle cx={pin.x} cy={pin.y} r="0.85" fill={PIN_COLORS[i % PIN_COLORS.length]} />
            {/* pin highlight */}
            <circle cx={pin.x - 0.25} cy={pin.y - 0.25} r="0.28" fill="rgba(255,255,255,0.65)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
