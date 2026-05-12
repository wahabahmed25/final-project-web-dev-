import type { Timestamp } from "firebase/firestore";

export type RecommendationCategory =
  | "study-spots"
  | "food"
  | "coffee"
  | "bookstores"
  | "school-resources";

export type Recommendation = {
  id: string;
  title: string;
  category: RecommendationCategory;
  description: string;
  location: string;
  rating: number;
  tags: string[];
  createdBy: string;
  createdByName: string;
  createdAt?: Timestamp;
  upvotes: number;
};