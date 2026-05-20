import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function addBookmark(uid: string, recommendationId: string) {
  const ref = doc(db, "users", uid, "bookmarks", recommendationId);
  await setDoc(ref, { recommendationId, savedAt: serverTimestamp() });
}

export async function removeBookmark(uid: string, recommendationId: string) {
  const ref = doc(db, "users", uid, "bookmarks", recommendationId);
  await deleteDoc(ref);
}

export async function isBookmarked(uid: string, recommendationId: string): Promise<boolean> {
  const ref = doc(db, "users", uid, "bookmarks", recommendationId);
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function getUserBookmarkIds(uid: string): Promise<string[]> {
  const ref = collection(db, "users", uid, "bookmarks");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.id);
}
