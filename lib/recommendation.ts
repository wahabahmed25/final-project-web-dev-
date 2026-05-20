import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Recommendation,
  RecommendationCategory,
} from "@/types/recommendation";

const recommendationsCollection = collection(db, "recommendations");

// ─── Types ────────────────────────────────────────────────────────

export type Comment = {
  id: string;
  text: string;
  createdBy: string;
  createdByName: string;
  createdAt?: Timestamp;
};

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

// ─── Converters ───────────────────────────────────────────────────

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

// ─── Recommendations ──────────────────────────────────────────────

export async function addRecommendation(input: AddRecommendationInput) {
  return addDoc(recommendationsCollection, {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    upvotes: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getAllRecommendations(): Promise<Recommendation[]> {
  const q = query(recommendationsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => convertDocToRecommendation(d.id, d.data()));
}

export async function getRecommendationsByCategory(
  category: RecommendationCategory
): Promise<Recommendation[]> {
  const q = query(recommendationsCollection, where("category", "==", category));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((d) =>
    convertDocToRecommendation(d.id, d.data())
  );
  return list.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function getRecommendationsByUser(
  uid: string
): Promise<Recommendation[]> {
  const q = query(recommendationsCollection, where("createdBy", "==", uid));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((d) =>
    convertDocToRecommendation(d.id, d.data())
  );
  return list.sort((a, b) => {
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
  if (!snapshot.exists()) return null;
  return convertDocToRecommendation(snapshot.id, snapshot.data());
}

export async function upvoteRecommendation(id: string) {
  const ref = doc(db, "recommendations", id);
  await updateDoc(ref, { upvotes: increment(1) });
}

export async function deleteRecommendation(id: string) {
  const ref = doc(db, "recommendations", id);
  await deleteDoc(ref);
}

// ─── Comments ─────────────────────────────────────────────────────

export async function getComments(recommendationId: string): Promise<Comment[]> {
  const commentsRef = collection(db, "recommendations", recommendationId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      text: String(data.text ?? ""),
      createdBy: String(data.createdBy ?? ""),
      createdByName: String(data.createdByName ?? "Student"),
      createdAt: data.createdAt as Timestamp | undefined,
    };
  });
}

export async function addComment(
  recommendationId: string,
  input: { text: string; createdBy: string; createdByName: string }
) {
  const commentsRef = collection(db, "recommendations", recommendationId, "comments");
  return addDoc(commentsRef, {
    ...input,
    text: input.text.trim(),
    createdAt: serverTimestamp(),
  });
}