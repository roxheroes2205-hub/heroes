/**
 * Append-only Firestore access log.
 * Writes a log entry each time a Discord-authenticated user visits a page.
 *
 * Firestore rules required:
 *   match /accessLogs/{logId} {
 *     allow create: if true;
 *     allow read: if true;
 *     allow update, delete: if false;
 *   }
 */

/**
 * Logs a page access event to the accessLogs Firestore collection.
 * Fire-and-forget — errors are silently caught.
 *
 * @param {object} db - Firestore database instance
 * @param {Function} addDocFn - Firestore addDoc function
 * @param {Function} collectionFn - Firestore collection function
 * @param {Function} TimestampClass - Firestore Timestamp class
 * @param {object} discordUser - Discord user object ({ id, username, global_name })
 * @param {string} pagePath - Current page path (e.g., '/members.html')
 */
export function logPageAccess(db, addDocFn, collectionFn, TimestampClass, discordUser, pagePath) {
  if (!db || !discordUser) return;
  try {
    addDocFn(collectionFn(db, 'accessLogs'), {
      discordUserId: discordUser.id,
      discordUsername: discordUser.global_name || discordUser.username,
      page: pagePath,
      timestamp: TimestampClass.now(),
      userAgent: navigator.userAgent,
    });
  } catch (_) {
    // Silent — logging should never block the user
  }
}
