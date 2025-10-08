import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const SSOCallback = () => {
  const navigate = useNavigate();
  const { loaded } = useClerk();

  useEffect(() => {
    if (loaded) {
      // Give Clerk a moment to process the callback
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  }, [loaded, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign up...</p>
      </div>
    </div>
  );
};

export default SSOCallback;

