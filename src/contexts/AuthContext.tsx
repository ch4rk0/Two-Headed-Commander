import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function checkAccess(email: string): Promise<{ allowed: boolean; isSuperAdmin: boolean }> {
  try {
    const snap = await getDoc(doc(db, 'config', 'allowed_emails'));
    if (!snap.exists()) return { allowed: false, isSuperAdmin: false };
    const data = snap.data();
    const list: string[] = data.emails ?? [];
    const superadmin: string = data.superadmin ?? '';
    return {
      allowed: list.includes(email),
      isSuperAdmin: !!superadmin && email === superadmin,
    };
  } catch {
    return { allowed: false, isSuperAdmin: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u?.email) {
        const { allowed, isSuperAdmin } = await checkAccess(u.email);
        setIsAdmin(allowed);
        setIsSuperAdmin(isSuperAdmin);
        if (!allowed) {
          await firebaseSignOut(auth);
          setUser(null);
          setError('Access denied. Your Google account is not authorised for this admin panel.');
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSuperAdmin, loading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
