import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSetting } from '@/services/settingsService';

export default function DiscordRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        const discordLink = await getSetting('discord_link');
        
        if (discordLink) {
          // Redirect to the Discord link
          window.location.href = discordLink;
        } else {
          // If no Discord link is configured, go back home
          navigate('/');
        }
      } catch (error) {
        console.error('Error redirecting to Discord:', error);
        navigate('/');
      }
    };

    redirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Discord...</p>
      </div>
    </div>
  );
}
