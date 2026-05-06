import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../../lib/firebase';

export const authService = {

  async loginWithGoogle() {

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {

        await setDoc(userDocRef, {
          email: user.email,
          role: 'SPECTATOR', // Changed from 'ADMIN' to 'SPECTATOR' for new users
          createdAt: new Date(),
          // Add other default fields as needed (e.g., name, etc.)
        });

      }

      return user;

    } catch (error) {

      console.error('Authentication Flow Error:', error);

      throw error;
    }
  },

  async logout() {

    try {

      await signOut(auth);

    } catch (error) {

      console.error('Logout Error:', error);

      throw error;
    }
  },

  onAuthChange(callback: (user: FirebaseUser | null) => void) {

    return onAuthStateChanged(auth, callback);
  },

  async getUserRole(uid: string) {

    try {

      const userDocRef = doc(db, 'users', uid);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {

        return userDoc.data().role;
      }

      return 'SPECTATOR';

    } catch (error) {

      console.error('Get Role Error:', error);

      return 'SPECTATOR';
    }
  }
};