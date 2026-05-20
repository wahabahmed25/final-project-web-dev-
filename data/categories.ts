import type { RecommendationCategory } from "@/types/recommendation";

export type Category = {
  label: string;
  value: RecommendationCategory;
  description: string;
  icon: string;
  accent: string;
  gradient: string;
  tags: string[];
};

export const categories: Category[] = [
  {
    label: "Study Spots",
    value: "study-spots",
    description: "Quiet and productive places to study on or near campus.",
    icon: "📚",
    accent: "#5C2D8B",
    gradient: "linear-gradient(135deg, #EDE5F5 0%, #F7F3FC 100%)",
    tags: ["quiet", "wifi", "outlets", "open-late", "free", "on-campus", "group-friendly", "24h"],
  },
  {
    label: "Food",
    value: "food",
    description: "Affordable lunch and meal options near Hunter.",
    icon: "🍱",
    accent: "#C2410C",
    gradient: "linear-gradient(135deg, #FEF3C7 0%, #FFF9F0 100%)",
    tags: ["cheap", "fast", "halal", "vegetarian", "vegan", "delivery", "near-campus", "filling"],
  },
  {
    label: "Coffee",
    value: "coffee",
    description: "Coffee shops and caffeine spots close to campus.",
    icon: "☕",
    accent: "#92400E",
    gradient: "linear-gradient(135deg, #FDE8D0 0%, #FFF6F0 100%)",
    tags: ["cheap", "cozy", "strong-coffee", "wifi", "quiet", "quick", "iced", "study-friendly"],
  },
  {
    label: "Bookstores",
    value: "bookstores",
    description: "Places to buy books, supplies, and class materials.",
    icon: "📖",
    accent: "#1D4ED8",
    gradient: "linear-gradient(135deg, #DBEAFE 0%, #F0F6FF 100%)",
    tags: ["textbooks", "used", "cheap", "supplies", "on-campus", "trade-in", "online", "nyc"],
  },
  {
    label: "School Resources",
    value: "school-resources",
    description: "Helpful Hunter offices, services, and student resources.",
    icon: "🏫",
    accent: "#065F46",
    gradient: "linear-gradient(135deg, #D1FAE5 0%, #F0FDF8 100%)",
    tags: ["free", "tutoring", "financial-aid", "counseling", "career", "health", "library", "advising"],
  },
];

export function getCategoryLabel(value: string): string {
  return categories.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryIcon(value: string): string {
  return categories.find((c) => c.value === value)?.icon ?? "📍";
}

export function getCategoryAccent(value: string): string {
  return categories.find((c) => c.value === value)?.accent ?? "var(--hunter-purple)";
}

export function getCategoryTags(value: string): string[] {
  return categories.find((c) => c.value === value)?.tags ?? [];
}

export function isValidCategory(value: string): value is RecommendationCategory {
  return categories.some((c) => c.value === value);
}