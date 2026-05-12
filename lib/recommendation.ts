import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Recommendation,
  RecommendationCategory,
} from "@/types/recommendation";

const recommendationsCollection = collection(db, "recommendations");

type AddRecommendationInput = {
  title: string;
  category: RecommendationCategory;
  description: string;
  location: string;
  rating: number;
  tags: string[];
  createdBy: string;
  createdByName: string;
};

function convertDocToRecommendation(
  id: string,
  data: Record<string, unknown>
): Recommendation {
  return {
    id,
    title: String(data.title ?? ""),
    category: data.category as RecommendationCategory,
    description: String(data.description ?? ""),
    location: String(data.location ?? ""),
    rating: Number(data.rating ?? 0),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    createdBy: String(data.createdBy ?? ""),
    createdByName: String(data.createdByName ?? "Student"),
    createdAt: data.createdAt as Recommendation["createdAt"],
    upvotes: Number(data.upvotes ?? 0),
  };
}

export async function addRecommendation(input: AddRecommendationInput) {
  return addDoc(recommendationsCollection, {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    tags: input.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    upvotes: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getAllRecommendations(): Promise<Recommendation[]> {
  const q = query(recommendationsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    convertDocToRecommendation(docSnap.id, docSnap.data())
  );
}

export async function getRecommendationsByCategory(
  category: RecommendationCategory
): Promise<Recommendation[]> {
  const q = query(recommendationsCollection, where("category", "==", category));
  const snapshot = await getDocs(q);

  const recommendations = snapshot.docs.map((docSnap) =>
    convertDocToRecommendation(docSnap.id, docSnap.data())
  );

  return recommendations.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function getRecommendationById(
  id: string
): Promise<Recommendation | null> {
  const ref = doc(db, "recommendations", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return convertDocToRecommendation(snapshot.id, snapshot.data());
}

export async function upvoteRecommendation(id: string) {
  const ref = doc(db, "recommendations", id);

  await updateDoc(ref, {
    upvotes: increment(1),
  });
}