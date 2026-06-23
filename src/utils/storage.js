import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  writeBatch
} from 'firebase/firestore';

// Helper to format date in local YYYY-MM-DD
export function getLocalDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
}

// Generate or retrieve persistent local user ID
export function getOrInitializeUserId() {
  let userId = localStorage.getItem('gratitude_garden_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('gratitude_garden_user_id', userId);
  }
  return userId;
}

// Get all entries for active user from Firestore
export async function getEntries() {
  try {
    const userId = getOrInitializeUserId();
    const entriesRef = collection(db, 'entries');
    const q = query(entriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by timestamp descending in JS (saves needing to set up a composite index in Firestore)
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get entries from Firestore', error);
    return [];
  }
}

// Save entries (performs a clear-and-insert batch for dev time-travel operations)
export async function saveEntries(entries) {
  try {
    const userId = getOrInitializeUserId();
    
    // 1. Fetch and delete existing user entries
    const entriesRef = collection(db, 'entries');
    const q = query(entriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    
    // Commit deletes
    await batch.commit();

    // 2. Insert new entries
    const insertBatch = writeBatch(db);
    entries.forEach((entry) => {
      const docRef = doc(collection(db, 'entries'));
      insertBatch.set(docRef, {
        text: entry.text,
        date: entry.date,
        timestamp: entry.timestamp,
        plantType: entry.plantType,
        color: entry.color,
        position: entry.position,
        userId: userId
      });
    });

    await insertBatch.commit();
    return true;
  } catch (error) {
    console.error('Failed to save entries to Firestore', error);
    return false;
  }
}

// Add a new entry to Firestore
export async function addEntry(text, plantType, color, position) {
  const userId = getOrInitializeUserId();
  const todayStr = getLocalDateString();

  // Double check if already entries for today in Firestore
  const entriesRef = collection(db, 'entries');
  const q = query(
    entriesRef, 
    where('userId', '==', userId), 
    where('date', '==', todayStr)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error('You have already planted a seed today. Come back tomorrow!');
  }

  const newDoc = {
    text,
    date: todayStr,
    timestamp: Date.now(),
    plantType,
    color,
    position,
    userId
  };

  const docRef = await addDoc(collection(db, 'entries'), newDoc);
  return {
    id: docRef.id,
    ...newDoc
  };
}

// Calculate streaks (remains synchronous on the loaded entries array)
export function calculateStreakStats(entries) {
  if (!entries || entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique sorted dates in descending order (YYYY-MM-DD)
  const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort().reverse();
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  const mostRecentDate = uniqueDates[0];
  const hasEntryToday = (mostRecentDate === todayStr);
  const hasEntryYesterday = (mostRecentDate === yesterdayStr);

  if (!hasEntryToday && !hasEntryYesterday) {
    currentStreak = 0;
  } else {
    let expectedDate = new Date(mostRecentDate + 'T00:00:00'); // enforce local time matching
    let index = 0;

    while (index < uniqueDates.length) {
      const expectedStr = getLocalDateString(expectedDate);
      if (uniqueDates[index] === expectedStr) {
        currentStreak++;
        index++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate historical longest streak
  const ascendingDates = Array.from(new Set(entries.map(e => e.date))).sort();
  if (ascendingDates.length > 0) {
    runningStreak = 1;
    longestStreak = 1;

    for (let i = 1; i < ascendingDates.length; i++) {
      const prevDate = new Date(ascendingDates[i - 1] + 'T00:00:00');
      const currDate = new Date(ascendingDates[i] + 'T00:00:00');

      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }

      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return { currentStreak, longestStreak };
}

// Clear all user data from Firestore
export async function clearAllData() {
  try {
    const userId = getOrInitializeUserId();
    const entriesRef = collection(db, 'entries');
    const q = query(entriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Failed to clear data from Firestore', error);
    return false;
  }
}
