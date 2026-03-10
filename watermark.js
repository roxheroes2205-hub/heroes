/**
 * Invisible watermark overlay — repeats the Discord user ID across the page
 * at very low opacity. Works with both dark and light themes via CSS variables.
 * Detectable by adjusting image levels in image editors but invisible to the eye.
 */
export function applyWatermark(discordUserId) {
  if (!discordUserId) return;

  const overlay = document.createElement('div');
  overlay.id = 'watermark-overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;user-select:none;';

  // Build a grid of rotated user IDs filling the viewport
  const rows = 30;
  const cols = 8;
  const fragment = document.createDocumentFragment();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const span = document.createElement('span');
      span.textContent = discordUserId;
      span.style.cssText =
        'position:absolute;' +
        `top:${(r / rows) * 100}%;` +
        `left:${(c / cols) * 100}%;` +
        'transform:rotate(-30deg);' +
        'font-size:10px;' +
        'font-family:monospace;' +
        'color:var(--text);' +
        'opacity:0.018;' +
        'white-space:nowrap;' +
        'letter-spacing:2px;';
      fragment.appendChild(span);
    }
  }

  overlay.appendChild(fragment);
  document.body.appendChild(overlay);
}
