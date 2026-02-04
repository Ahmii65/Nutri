import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserProfile } from "../types";

export const UserService = {
  /**
   * Creates or overwrites a user profile document in Firestore.
   * @param uid The user's UID (from Firebase Auth).
   * @param data The user profile data.
   */
  createUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(
        userRef,
        {
          ...data,
          uid,
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  /**
   * Updates an existing user profile document in Firestore.
   * @param uid The user's UID.
   * @param data The data to update.
   */
  updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  /**
   * Fetches a user profile from Firestore.
   * @param uid The user's UID.
   * @returns The user profile data or null if not found.
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
};
