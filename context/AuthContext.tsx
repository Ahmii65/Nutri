import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../config/firebase";
import { UserService } from "../services/userService";
import { AuthContextType, UserProfile } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          // Ideally fetch user profile from Firestore here to get full UserProfile
          // For now, casting basics
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          } as UserProfile);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      throw e;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (e) {
      throw e;
    }
  };

  const saveUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
      await UserService.createUserProfile(uid, data);
      // Update local state if needed
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (e) {
      throw e;
    }
  };

  const register = async (
    email: string,
    password: string,
    additionalData: any,
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // Create user document in Firestore using Service
      await UserService.createUserProfile(firebaseUser.uid, {
        email: firebaseUser.email,
        ...additionalData,
      });

      return firebaseUser;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        saveUserProfile,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
