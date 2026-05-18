"use client";

import { useEffect } from "react";

interface VoteEffectProps {
  type: "up" | "down";
  active: boolean;
  onDone: () => void;
}

export default function VoteEffect({ type, active, onDone }: VoteEffectProps) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;

  if (type === "up") {
    return (
      <div className="vote-fx-wrap" aria-hidden>
        <span className="vfx-star-c">⭐</span>
        <span className="vfx-star-l">✨</span>
        <span className="vfx-star-r">✨</span>
        <span className="vfx-aplus">A+</span>
      </div>
    );
  }

  return (
    <div className="vote-fx-wrap" aria-hidden>
      <span className="vfx-sad">😢</span>
      <span className="vfx-heart">💔</span>
    </div>
  );
}
