import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  resetPassword,
  onAuthStateChanged,
  User,
  handleFirestoreError,
  OperationType,
  testConnection
} from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileCompletion: number;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function calculateProfileCompletion(p: Partial<UserProfile> | null): number {
  if (!p) return 0;
  const fields: { key: keyof UserProfile; weight: number }[] = [
    { key: 'fullName', weight: 10 },
    { key: 'educationLevel', weight: 10 },
    { key: 'degree', weight: 10 },
    { key: 'graduationYear', weight: 10 },
    { key: 'technicalSkills', weight: 15 },
    { key: 'softSkills', weight: 10 },
    { key: 'workExperience', weight: 10 },
    { key: 'projects', weight: 10 },
    { key: 'preferredJobRoles', weight: 10 },
    { key: 'preferredLocations', weight: 5 },
  ];

  let total = 0;
  for (const f of fields) {
    const val = p[f.key];
    if (Array.isArray(val) && val.length > 0) {
      total += f.weight;
    } else if (typeof val === 'string' && val.trim().length > 0) {
      total += f.weight;
    }
  }
  return Math.min(100, total);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial connection test
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const completion = calculateProfileCompletion(data);
            setProfile({ ...data, profileCompletion: completion });
          } else {
            // Initialize fresh profile
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              fullName: currentUser.displayName || 'Youth Explorer',
              technicalSkills: [],
              softSkills: [],
              languages: ['English'],
              preferredJobRoles: [],
              preferredLocations: [],
              profileCompletion: 20,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error('Failed to load user profile from Firestore:', error);
          // Fallback to minimal profile if Firestore fetch is restricted or fails
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            fullName: currentUser.displayName || 'Youth Explorer',
            technicalSkills: [],
            softSkills: [],
            languages: ['English'],
            preferredJobRoles: [],
            preferredLocations: [],
            profileCompletion: 20,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const register = async (name: string, email: string, pass: string) => {
    const cred = await registerWithEmail(email, pass);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      fullName: name,
      technicalSkills: [],
      softSkills: [],
      languages: ['English'],
      preferredJobRoles: [],
      preferredLocations: [],
      profileCompletion: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
    }
    setProfile(newProfile);
  };

  const loginGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await resetPassword(email);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    const updated = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString(),
    } as UserProfile;

    const completion = calculateProfileCompletion(updated);
    updated.profileCompletion = completion;

    try {
      await updateDoc(doc(db, 'users', user.uid), updated);
      setProfile(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const deleteUserAccount = async () => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await user.delete();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Account deletion error:', err);
      throw err;
    }
  };

  const profileCompletion = profile ? calculateProfileCompletion(profile) : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileCompletion,
        login,
        register,
        loginGoogle,
        logout,
        sendPasswordReset,
        updateUserProfile,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
