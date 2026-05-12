import type { RecommendationCategory } from "@/types/recommendation";

export type Category = {
  label: string;
  value: RecommendationCategory;
  description: string;
};

export const categories: Category[] = [
  {
    label: "Study Spots",
    value: "study-spots",
    description: "Quiet and useful places to study on or near campus.",
  },
  {
    label: "Food",
    value: "food",
    description: "Affordable lunch and food options near Hunter.",
  },
  {
    label: "Coffee",
    value: "coffee",
    description: "Coffee shops and quick caffeine spots near campus.",
  },
  {
    label: "Bookstores",
    value: "bookstores",
    description: "Places to buy books, supplies, and class materials.",
  },
  {
    label: "School Resources",
    value: "school-resources",
    description: "Helpful Hunter offices, services, and student resources.",
  },
];

export function getCategoryLabel(value: string) {
  return categories.find((category) => category.value === value)?.label ?? value;
}

export function isValidCategory(value: string): value is RecommendationCategory {
  return categories.some((category) => category.value === value);
}