import React from 'react';
import ReactDOM from 'react-dom/client';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../shared/firebase';
import './index.css'; // Assuming Tailwind base styles are here

const FinishAuth = () => {
  const [message, setMessage] = React.useState('Verifying your sign-in link...');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        if (!email) {
          setError('Email is required to complete sign-in.');
          setMessage('');
          return;
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setMessage('Success! You are now signed in. You can close this tab and use the PropPlug extension.');
        } catch (err) {
          console.error(err);
          setError(`Failed to sign in. ${err.message}. Please try again.`);
          setMessage('');
        }
      } else {
        setError('This is not a valid sign-in link.');
        setMessage('');
      }
    };

    completeSignIn();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">PropPlug</h1>
        {message && <p className="text-gray-700">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <p className="text-xs text-gray-400 mt-6">You can now close this window.</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FinishAuth />
  </React.StrictMode>
);