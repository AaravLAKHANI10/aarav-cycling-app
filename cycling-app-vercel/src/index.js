import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';

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
    >
      <Routes>
        {/* Main Route - Shows landing page or dashboard based on auth status */}
        <Route path="/" element={<App />} />
        
        {/* Auth Routes - Allow Clerk to handle all auth callbacks */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Dashboard Route (optional, App handles this already) */}
        <Route path="/dashboard" element={<App />} />
        
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

