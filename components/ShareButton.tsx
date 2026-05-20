"use client";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface Props {
  title: string;
  url?: string;
  size?: "sm" | "md";
}

export default function ShareButton({ title, url, size = "md" }: Props) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url ?? window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Hunter Hub`,
          text: `Check out this recommendation on Hunter Hub: ${title}`,
          url: shareUrl,
        });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isSmall = size === "sm";

  return (
    <button
      onClick={handleShare}
      className="btn btn-outline"
      style={{
        padding: isSmall ? "0.3rem 0.7rem" : "0.55rem 1.1rem",
        fontSize: isSmall ? "0.72rem" : "0.85rem",
        gap: "0.35rem",
      }}
      title="Share this recommendation"
    >
      {copied ? "✓ Copied" : "🔗 Share"}
    </button>
  );
}
