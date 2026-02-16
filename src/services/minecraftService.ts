/**
 * Minecraft Player Image Service
 * Fetches Minecraft player heads/skins from multiple reliable APIs
 */

export interface MinecraftProfile {
  uuid: string;
  name: string;
  skinUrl?: string;
  headUrl: string;
}

/**
 * Get Minecraft player profile and skin URL
 * Uses Crafatar.com as the primary image source
 */
export async function getMinecraftPlayerImage(
  username: string,
  type: 'head' | 'skin' = 'head',
  size: number = 64
): Promise<string> {
  try {
    // Validate username
    if (!username || username.length < 3) {
      return getDefaultAvatar();
    }

    // Use Mojang API to get UUID (more reliable than NameMC)
    const uuid = await getMinecraftUUID(username);
    if (!uuid) {
      // Fallback to crafatar with username
      return buildCrafatarUrl(username, type, size);
    }

    return buildCrafatarUrl(uuid, type, size);
  } catch (err) {
    console.warn(`Failed to get Minecraft image for ${username}:`, err);
    return getDefaultAvatar();
  }
}

/**
 * Get Minecraft player UUID from username
 * Tries multiple APIs for better reliability
 */
async function getMinecraftUUID(username: string): Promise<string | null> {
  try {
    // Try Mojang API first (official, most reliable)
    const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`, {
      method: 'GET',
    });

    if (mojangResponse.ok) {
      const data = await mojangResponse.json();
      return data.id;
    }

    // Fallback to NameMC API
    const nameMcResponse = await fetch(`https://api.namemc.com/profile/${username}`);
    if (nameMcResponse.ok) {
      const data = await nameMcResponse.json();
      return data.id;
    }

    // Fallback to Crafatar's texture endpoint
    const crafatarResponse = await fetch(`https://crafatar.com/api/players/profiles/minecraft/${username}`);
    if (crafatarResponse.ok) {
      const data = await crafatarResponse.json();
      return data[0]?.id;
    }

    return null;
  } catch (err) {
    console.warn(`Failed to get UUID for ${username}:`, err);
    return null;
  }
}

/**
 * Build Crafatar URL for player image
 * Crafatar is a reliable CDN service for Minecraft player skins and heads
 */
function buildCrafatarUrl(
  uuidOrUsername: string,
  type: 'head' | 'skin' = 'head',
  size: number = 64
): string {
  const baseUrl = 'https://crafatar.com/renders';
  
  // Crafatar supports: /avatars/, /heads/, /bodys/, /skins/ endpoints
  const endpoint = type === 'head' ? 'heads' : 'skins';
  
  // Parameters for better image delivery
  const params = new URLSearchParams({
    size: size.toString(),
    overlay: 'true', // Include skin overlay
  });

  return `${baseUrl}/${endpoint}/${uuidOrUsername}?${params.toString()}`;
}

/**
 * Get default avatar when player image can't be fetched
 */
function getDefaultAvatar(): string {
  // Return a placeholder image URL or emoji
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23888"%3E%3C/rect%3E%3Ctext x="32" y="40" font-size="32" text-anchor="middle" fill="white"%3E👤%3C/text%3E%3C/svg%3E';
}

/**
 * Get multiple formats of Minecraft player images
 */
export async function getMinecraftPlayerImages(
  username: string
): Promise<{
  head: string;
  skin: string;
  avatar: string;
  full: string;
}> {
  try {
    const uuid = await getMinecraftUUID(username);
    const id = uuid || username;

    return {
      head: buildCrafatarUrl(id, 'head', 64),
      skin: buildCrafatarUrl(id, 'skin', 64),
      avatar: buildCrafatarUrl(id, 'head', 32), // Smaller for avatars
      full: buildCrafatarUrl(id, 'skin', 128), // Larger for full body
    };
  } catch (err) {
    console.warn(`Failed to get Minecraft images for ${username}:`, err);
    const fallback = getDefaultAvatar();
    return {
      head: fallback,
      skin: fallback,
      avatar: fallback,
      full: fallback,
    };
  }
}

/**
 * Preload Minecraft player images
 * Useful for improving perceived performance
 */
export async function preloadMinecraftImage(username: string): Promise<void> {
  try {
    const url = await getMinecraftPlayerImage(username, 'head');
    const img = new Image();
    img.src = url;
  } catch (err) {
    console.warn(`Failed to preload image for ${username}:`, err);
  }
}
