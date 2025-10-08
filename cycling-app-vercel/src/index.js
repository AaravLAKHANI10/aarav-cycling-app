import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import SSOCallback from './SSOCallback';

// Get the Publishable Key from environment variables
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Publishable Key. Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your .env.local file');
}

// Clerk Provider with Router
function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
      afterSignUpUrl="/"
      afterSignInUrl="/"
    >
      <Routes>
        {/* Main Route */}
        <Route path="/" element={<App />} />
        
        {/* Auth Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* SSO Callback Routes */}
        <Route path="/sign-up/sso-callback" element={<SSOCallback />} />
        <Route path="/sign-in/sso-callback" element={<SSOCallback />} />
        
        {/* Catch all */}
        <Route path="*" element={<App />} />
      </Routes>
    </ClerkProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  </React.StrictMode>
);

