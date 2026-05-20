"use client";

import { useEffect } from "react";

type Props = { type: "up" | "down"; active: boolean; onDone: () => void };

export default function VoteEffect({ type, active, onDone }: Props) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div className="vote-fx-wrap">
      {type === "up" ? (
        <>
          <span className="vfx-star-c">⭐</span>
          <span className="vfx-star-l">✨</span>
          <span className="vfx-star-r">✨</span>
          <span className="vfx-aplus">A+</span>
        </>
      ) : (
        <>
          <span className="vfx-sad">😢</span>
          <span className="vfx-heart">💔</span>
        </>
      )}
    </div>
  );
}
