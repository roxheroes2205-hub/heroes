/**
 * Invisible watermark overlay — repeats Discord user info across the page
 * at very low opacity. Works with both dark and light themes via CSS variables.
 * Detectable by adjusting image levels in image editors but invisible to the eye.
 */
export function applyWatermark(discordUser) {
  if (!discordUser) return;

  // Build watermark text: display name | username | ID
  const parts = [];
  if (discordUser.global_name) parts.push(discordUser.global_name);
  if (discordUser.username && discordUser.username !== discordUser.global_name) {
    parts.push(discordUser.username);
  }
  if (discordUser.id) parts.push(discordUser.id);
  const watermarkText = parts.join(' | ');

  const overlay = document.createElement('div');
  overlay.id = 'watermark-overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;user-select:none;';

  // Sparse grid — larger text, fewer repetitions, easier to read when revealed
  const rows = 12;
  const cols = 4;
  const fragment = document.createDocumentFragment();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const span = document.createElement('span');
      span.textContent = watermarkText;
      span.style.cssText =
        'position:absolute;' +
        `top:${(r / rows) * 100}%;` +
        `left:${(c / cols) * 100}%;` +
        'transform:rotate(-30deg);' +
        'font-size:18px;' +
        'font-family:monospace;' +
        'color:var(--text);' +
        'opacity:0.018;' +
        'white-space:nowrap;' +
        'letter-spacing:3px;';
      fragment.appendChild(span);
    }
  }

  overlay.appendChild(fragment);
  document.body.appendChild(overlay);
}
