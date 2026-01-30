import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  position?: string;
  bio?: string;
}

interface DbUser {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  role: string;
  position?: string;
  bio?: string | null;
  createdAt: string;
}

interface AuthResponse {
  firebaseUser: FirebaseUser;
  dbUser: DbUser;
}

class AuthService {
  // Register new user (Worker or Client)
  async register(
    email: string, 
    password: string, 
    userData: RegisterData, 
    role: 'USER' | 'WORKER'
  ): Promise<AuthResponse> {
    try {
      console.log('Creating Firebase user...');
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('Firebase user created:', firebaseUser.uid);

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Send user data to your backend to create in PostgreSQL
      console.log('Sending to backend:', {
        firebaseUid: firebaseUser.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address || '',
        role: role,
        position: userData.position || '',
        bio: userData.bio || ''
      });

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - backend doesn't need it for registration
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          address: userData.address || '',
          role: role,
          position: userData.position || '',
          bio: userData.bio || ''
        })
      });

      console.log('Backend response status:', response.status);

      const text = await response.text();
      console.log('Backend response text:', text);

      if (!text) {
        throw new Error('Empty response from server');
      }

      const dbUser: DbUser = JSON.parse(text);

      if (!response.ok) {
        throw new Error((dbUser as any).error || 'Failed to create user in database');
      }

      return {
        firebaseUser,
        dbUser
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      // If database creation fails, delete the Firebase user
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          console.error('Failed to delete Firebase user:', deleteError);
        }
      }
      throw error;
    }
  }

  // Sign in existing user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Fetch user data from your backend
      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const dbUser: DbUser = await response.json();

      return {
        firebaseUser,
        dbUser
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Get ID token
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}

export default new AuthService();