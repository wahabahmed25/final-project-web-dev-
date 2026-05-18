"use client";

const pins: [number, number][] = [
  [6, 8],  [26, 4],  [50, 6],  [74, 3],  [93, 7],
  [13, 30],[36, 24], [62, 27], [84, 31],
  [4, 52], [28, 47], [53, 54], [76, 49], [95, 53],
  [18, 76],[44, 80], [68, 74], [90, 78],
];

const connections = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[1,5],[1,6],[2,6],[2,7],[3,7],[3,8],[4,8],
  [5,9],[5,10],[6,10],[6,11],[7,11],[7,12],[8,12],[8,13],
  [9,14],[10,14],[10,15],[11,15],[11,16],[12,16],[13,17],[12,17],
  [14,15],[15,16],[16,17],
  [0,9],[4,13],[6,11],[2,10],
];

function stringPath(i: number, j: number) {
  const [x1, y1] = pins[i];
  const [x2, y2] = pins[j];
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const sag = dist * 0.07;
  return `M ${x1} ${y1} Q ${mx} ${my + sag} ${x2} ${y2}`;
}

export default function PinStringWeb() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ opacity: 0.28 }}
      >
        {connections.map(([i, j], idx) => (
          <path
            key={idx}
            d={stringPath(i, j)}
            stroke="#991b1b"
            strokeWidth="0.22"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {pins.map(([x, y], idx) => (
          <g key={idx}>
            <circle cx={x} cy={y} r="1.0" fill="#cc2020"/>
            <circle cx={x + 0.3} cy={y - 0.3} r="0.38" fill="rgba(255,180,180,0.75)"/>
          </g>
        ))}
      </svg>
    </div>
  );
}
