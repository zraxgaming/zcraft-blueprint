import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

/**
 * Discord OAuth Callback Handler
 * Handles redirect from Discord OAuth authorization
 * Exchanges code for access token and authenticates user
 */
export default function DiscordCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleDiscordCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle errors from Discord
      if (error) {
        const errorDescription = searchParams.get('error_description');
        toast({
          title: 'Discord authentication failed',
          description: errorDescription || error,
        });
        navigate('/login');
        return;
      }

      if (!code) {
        toast({
          title: 'Invalid callback',
          description: 'No authorization code received.',
        });
        navigate('/login');
        return;
      }

      try {
        // Exchange code for Discord tokens on backend
        // In production, this should hit YOUR backend endpoint, not directly call Discord
        const response = await fetch('/api/auth/discord/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange Discord code');
        }

        const data = await response.json();
        const { access_token, user: discordUser } = data;

        // Sign up or sign in user via Supabase with Discord data
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: discordUser.email || `${discordUser.id}@discord.local`,
          password: Math.random().toString(36).slice(-12), // Random password
          options: {
            data: {
              discord_id: discordUser.id,
              discord_username: discordUser.username,
              avatar_url: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
            },
          },
        });

        if (authError && authError.message !== 'User already registered') {
          throw authError;
        }

        // Create or update user profile
        const userId = authData?.user?.id;
        if (userId) {
          const { error: upsertError } = await supabase.from('users').upsert({
            id: userId,
            username: discordUser.username,
            email: discordUser.email || `${discordUser.id}@discord.local`,
            avatar_url: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
          });

          if (upsertError) throw upsertError;
        }

        toast({
          title: 'Discord sign-in successful!',
          description: `Welcome, ${discordUser.username}!`,
        });
        navigate('/profile');
      } catch (err: any) {
        console.error('Discord callback error:', err);
        toast({
          title: 'Authentication error',
          description: err?.message || 'Failed to complete Discord sign-in.',
        });
        navigate('/login');
      }
    };

    handleDiscordCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
        <p className="text-muted-foreground">Completing Discord authentication...</p>
      </div>
    </div>
  );
}
