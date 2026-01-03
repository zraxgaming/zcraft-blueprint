import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

/**
 * Supabase OAuth Callback Handler
 * Handles redirects from Supabase OAuth providers (Google, GitHub, Discord via Supabase)
 * URL: http://localhost:5173/auth/callback
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If user is authenticated after callback
    if (userProfile) {
      toast({ title: 'Signed in successfully!', description: `Welcome, ${userProfile.username}!` });
      navigate('/profile');
    } else {
      // If no user after callback, something went wrong
      toast({ title: 'Authentication failed', description: 'Unable to complete sign-in.' });
      navigate('/login');
    }
  }, [userProfile, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
