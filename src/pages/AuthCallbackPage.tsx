import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';

/**
 * OAuth Callback Handler
 * Handles redirects from Supabase OAuth providers (Google, GitHub, Discord)
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session from URL hash (Supabase adds tokens there after OAuth)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it (trigger should have done this but just in case)
            setMessage('Setting up your profile...');
            const username = session.user.user_metadata?.username || 
                           session.user.user_metadata?.name ||
                           session.user.user_metadata?.full_name ||
                           session.user.email?.split('@')[0] || 
                           'User';
            
            await supabase.from('users').insert({
              id: session.user.id,
              email: session.user.email || '',
              username,
              avatar_url: session.user.user_metadata?.avatar_url || null,
            });
          }

          toast({ 
            title: 'Signed in successfully!', 
            description: `Welcome${profile?.username ? `, ${profile.username}` : ''}!` 
          });
          navigate('/profile');
        } else {
          // No session, something went wrong
          toast({ 
            title: 'Authentication failed', 
            description: 'Unable to complete sign-in. Please try again.' 
          });
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        toast({ 
          title: 'Authentication error', 
          description: err?.message || 'An error occurred during sign-in.' 
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}
