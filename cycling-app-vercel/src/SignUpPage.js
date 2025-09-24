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

// Protected Route Component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
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
        <Route path="/" element={<App />} />
        
        {/* Important: Use exact path for sign-in and sign-up, 
            Clerk handles the callbacks automatically */}
        <Route 
          path="/sign-in/*" 
          element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          } 
        />
        
        <Route 
          path="/sign-up/*" 
          element={
            <SignedOut>
              <SignUpPage />
            </SignedOut>
          } 
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all route for any missed paths */}
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


