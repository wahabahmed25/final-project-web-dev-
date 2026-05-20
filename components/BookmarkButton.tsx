"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";

interface Props {
  recommendationId: string;
  size?: "sm" | "md";
}

export default function BookmarkButton({ recommendationId, size = "md" }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    isBookmarked(user.uid, recommendationId).then(setSaved).catch(() => {});
  }, [user, recommendationId]);

  if (!user) return null;

  async function toggle() {
    if (!user || loading) return;
    try {
      setLoading(true);
      if (saved) {
        await removeBookmark(user.uid, recommendationId);
        setSaved(false);
        showToast("Removed from saved spots.", "info");
      } else {
        await addBookmark(user.uid, recommendationId);
        setSaved(true);
        showToast("Saved! Find it in your dashboard.", "success");
      }
    } catch {
      showToast("Could not update bookmark.", "error");
    } finally {
      setLoading(false);
    }
  }

  const isSmall = size === "sm";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="btn btn-outline"
      style={{
        padding: isSmall ? "0.3rem 0.7rem" : "0.55rem 1.1rem",
        fontSize: isSmall ? "0.72rem" : "0.85rem",
        gap: "0.35rem",
        borderColor: saved ? "var(--hunter-gold)" : undefined,
        color: saved ? "var(--hunter-gold-dark)" : undefined,
        background: saved ? "var(--hunter-gold-faint)" : undefined,
      }}
      title={saved ? "Remove from saved" : "Save this spot"}
    >
      {saved ? "🔖 Saved" : "🔖 Save"}
    </button>
  );
}
