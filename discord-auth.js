// ── Discord OAuth2 Configuration ──
const DISCORD_CLIENT_ID = '1481074144471941241';
const DISCORD_GUILD_ID  = '1367569320913141812';
const REQUIRED_ROLE_ID  = '1367975406581579806';
const REDIRECT_URI      = 'https://roxheroes2205-hub.github.io/heroes/auth-callback.html';

const DISCORD_API_BASE  = 'https://discord.com/api/v10';
const SCOPES            = 'identify guilds.members.read';

// localStorage keys
const TOKEN_KEY      = 'discord_access_token';
const EXPIRY_KEY     = 'discord_token_expiry';
const USER_KEY       = 'discord_user';
const VERIFIED_KEY   = 'discord_last_verified';

// Only verify once per session — skip API re-checks until token expires or user logs out
const VERIFY_INTERVAL_MS = Infinity;

/**
 * Returns stored session if token exists and hasn't expired, or null.
 */
export function getStoredSession() {
  const token  = localStorage.getItem(TOKEN_KEY);
  const expiry = parseInt(localStorage.getItem(EXPIRY_KEY), 10);
  if (!token || !expiry || Date.now() >= expiry) {
    clearSession();
    return null;
  }
  const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  return { token, user };
}

/**
 * Stores token, computed expiry timestamp, and user info in localStorage.
 */
export function storeSession(token, expiresIn, user) {
  const expiryTimestamp = Date.now() + (expiresIn * 1000);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiryTimestamp.toString());
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clears all Discord auth data from localStorage.
 */
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(VERIFIED_KEY);
}

/**
 * Builds the Discord OAuth2 authorization URL.
 */
export function buildAuthUrl(returnPath) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: SCOPES,
    state: returnPath || '/index.html',
    prompt: 'none',
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

/**
 * Parses the URL fragment from the Discord OAuth2 callback.
 */
export function parseCallbackFragment() {
  const hash = window.location.hash.substring(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  if (!accessToken) return null;
  return {
    accessToken,
    tokenType: params.get('token_type') || 'Bearer',
    expiresIn: parseInt(params.get('expires_in'), 10) || 604800,
    state: params.get('state') || '/index.html',
  };
}

/**
 * Fetches the authenticated user's identity from Discord.
 */
export async function fetchUser(token) {
  const resp = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resp.status === 429) throw new Error('rate_limited');
  if (!resp.ok) return null;
  return resp.json();
}

/**
 * Fetches the authenticated user's guild member info (includes roles).
 */
export async function fetchGuildMember(token) {
  const resp = await fetch(
    `${DISCORD_API_BASE}/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (resp.status === 429) throw new Error('rate_limited');
  if (!resp.ok) return null;
  return resp.json();
}

/**
 * Checks whether a guild member has the required role.
 */
export function hasRequiredRole(member) {
  return Array.isArray(member?.roles) && member.roles.includes(REQUIRED_ROLE_ID);
}

/**
 * Returns the Discord CDN URL for a user's avatar.
 */
export function getAvatarUrl(user, size = 32) {
  if (user?.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
  }
  const index = Number((BigInt(user?.id || '0') >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

/**
 * Main gate function: validates stored token, checks guild membership + role.
 * Returns { user, member } on success, null on definitive failure,
 * or 'skip' if recently verified (to avoid Discord API rate limits).
 */
export async function checkDiscordAccess() {
  const session = getStoredSession();
  if (!session) return null;

  // Skip API calls if verified recently (avoids 429 rate limits)
  const lastVerified = parseInt(localStorage.getItem(VERIFIED_KEY), 10);
  if (lastVerified && (Date.now() - lastVerified) < VERIFY_INTERVAL_MS) {
    return 'skip';
  }

  const user = await fetchUser(session.token);
  if (!user) {
    clearSession();
    return null;
  }

  // Update stored user info
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const member = await fetchGuildMember(session.token);
  if (!member) {
    clearSession();
    return null;
  }

  if (!hasRequiredRole(member)) {
    clearSession();
    return null;
  }

  // Mark as verified
  localStorage.setItem(VERIFIED_KEY, Date.now().toString());
  return { user, member };
}
