import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Match, ActionType, RaidResult, TackleResult, MatchAction } from '../../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const matchService = {
  async createMatch(match: Omit<Match, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'matches'), {
        ...match,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'matches');
    }
  },

  async updateMatch(id: string, updates: Partial<Match>) {
    try {
      const docRef = doc(db, 'matches', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `matches/${id}`);
    }
  },

  async addAction(matchId: string, action: Omit<MatchAction, 'id'>) {
    try {
      const actionsRef = collection(db, 'matches', matchId, 'actions');
      await addDoc(actionsRef, {
        ...action,
        timestamp: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `matches/${matchId}/actions`);
    }
  },

  subscribeToMatches(callback: (matches: Match[]) => void) {
    const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      callback(matches);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'matches');
    });
  },

  async getMatch(id: string) {
    try {
      const docRef = doc(db, 'matches', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Match;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `matches/${id}`);
    }
  },

  async deleteMatch(id: string) {
    try {
      await deleteDoc(doc(db, 'matches', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `matches/${id}`);
    }
  }
};
