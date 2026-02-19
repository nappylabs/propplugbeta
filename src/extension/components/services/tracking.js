import { db } from './firebase';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export const trackSiteAccess = async (url, status) => {
  try {
    if (!url) return;
    const hostname = new URL(url).hostname;
    
    // Create a document reference based on the hostname
    const docRef = doc(db, 'site_stats', hostname);

    const isFailure = status === 'failed';
    const isUnsupported = status === 'unsupported';

    await setDoc(docRef, {
      hostname: hostname,
      lastAccessed: serverTimestamp(),
      accessCount: increment(1),
      failureCount: isFailure ? increment(1) : increment(0),
      unsupportedCount: isUnsupported ? increment(1) : increment(0)
    }, { merge: true });

  } catch (e) {
    console.error("Tracking error:", e);
  }
};