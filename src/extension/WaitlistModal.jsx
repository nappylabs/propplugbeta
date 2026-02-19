import React, { useState, useEffect } from 'react';
import { useAuth } from './components/context/AuthContext';
import { useModal } from './components/context/ModalContext';
import { db } from '../shared/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const WaitlistModal = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { isWaitlistModalOpen, closeWaitlistModal, featureName } = useModal();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isWaitlistModalOpen) return null;

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to join the waitlist.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        isOnWaitlist: true,
        waitlistSignup: {
          feature: featureName,
          timestamp: new Date(),
        },
      });
      updateUserProfile({ isOnWaitlist: true }); // Optimistically update context
    } catch (err) {
      setError('Failed to join the waitlist. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-sm w-full relative">
        <button onClick={closeWaitlistModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>

        {currentUser?.isOnWaitlist ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-purple-900 mb-2">You're on the list!</h2>
            <p className="text-sm text-gray-600">You're on the early access list for Full Access features. We'll notify you as soon as they're ready.</p>
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist}>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Unlock Full Access First</h2>
            <p className="text-sm text-gray-600 mb-6">
              The <span className="font-semibold text-purple-700">{featureName}</span> feature is part of our upcoming Full Access plan. Join the early access list to be the first to unlock it.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 ml-1">Your Email</label>
                <input type="email" required value={email} readOnly disabled className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            {error && <div className="mt-4 text-xs text-red-600">{error}</div>}

            <button type="submit" disabled={loading} className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50">
              {loading ? 'Joining...' : 'Join Early Access'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};