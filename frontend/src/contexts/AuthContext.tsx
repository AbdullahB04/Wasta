import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';

// Define types for database user
export interface DbUser {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  image?: string;
  phone?: string;
  address?: string;
  bio?: string;
  skills?: string;
  languages?: string;
  isActive?: boolean;
  role: string; // USER, WORKER, or ADMIN
}

// Define the context type
interface AuthContextType {
  currentUser: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

// Create the context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user data from backend
  const fetchUserData = async (firebaseUser: FirebaseUser, retries = 5): Promise<void> => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        // User might be in the process of being created, retry with exponential backoff
        if (retries > 0) {
          console.log(`User not found, retrying in ${6 - retries} seconds... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, (6 - retries) * 1000)); // Increasing delay
          return fetchUserData(firebaseUser, retries - 1);
        }
        
        console.warn('User not found in database after multiple retries. Please complete registration.');
        setDbUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      console.log('✅ User data fetched successfully:', userData);
      setDbUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setDbUser(null);
    }
  };

  // Function to refresh user data
  const refreshUser = async (): Promise<void> => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setDbUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    dbUser,
    loading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Optional: Export the context itself if needed elsewhere
export { AuthContext };