// Pure layout data: no DOM reads, clocks, or render-time randomness.
export function chunkRandom(x, y, index = 0) {
  let seed = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(index + 1, 83492791)) >>> 0;
  return () => {
    seed += 0x6d2b79f5;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function intersects(a, b, gap = 0) {
  return Math.abs(a.x - b.x) < (a.width + b.width) / 2 + gap
    && Math.abs(a.y - b.y) < (a.height + b.height) / 2 + gap;
}

export function generateChunk(x, y, { width, height, pitchX, pitchY, templates, obstacles, scale, gap = 40 }) {
  const cards = [];
  let index = 0;
  // Extend the existing staggered field instead of independently packing each
  // chunk. Global row parity keeps the half-step at every seam and fills empty
  // slots around the original cards without creating rejected-row holes.
  const rows = Math.round(height / pitchY);
  const columns = Math.round(width / pitchX);
  // Integer slot ownership avoids floating-point ceil errors duplicating a
  // boundary row/column at negative or far-away chunk coordinates.
  const firstRow = y * rows - Math.floor(rows / 2);
  for (let row = firstRow; row < firstRow + rows; row++) {
    const parity = Math.abs(row) % 2;
    const offset = parity * pitchX / 2;
    const firstColumn = x * columns + Math.ceil(-columns / 2 - parity / 2);
    for (let column = firstColumn; column < firstColumn + columns; column++) {
      const id = `chunk-${x}-${y}-card-${index}`;
      const cardRandom = chunkRandom(x, y, ++index);
      const template = templates[Math.floor(cardRandom() * templates.length)];
      const bounds = {
        x: column * pitchX + offset,
        y: row * pitchY,
        width: template.width * scale,
        height: template.height * scale
      };
      // Native widths keep the cards hugging their contents. Clearance uses
      // the largest authored card, including across neighboring chunks.
      if (obstacles.some((other) => intersects(bounds, other, gap))
        || cards.some((other) => intersects(bounds, other, gap))) continue;
      cards.push({ ...bounds, id, typeId: template.entry.id,
        variantIndex: Math.floor(cardRandom() * Math.max(1, template.variantCount)),
        elapsed: Math.round((12 + cardRandom() * 168) * 10) / 10 });
    }
  }
  return cards;
}

// The viewport snapshot is frozen by the caller before asking for a selection.
export function nearestCard(cards, camera, viewport, hudRects = []) {
  const cx = viewport.width / 2;
  const cy = viewport.height / 2;
  const ranked = cards.map((card) => {
    const x = cx + card.x + camera.x;
    const y = cy + card.y + camera.y;
    const left = Math.max(0, x - card.width / 2);
    const right = Math.min(viewport.width, x + card.width / 2);
    const top = Math.max(0, y - card.height / 2);
    const bottom = Math.min(viewport.height, y + card.height / 2);
    let area = Math.max(0, right - left) * Math.max(0, bottom - top);
    for (const rect of hudRects) {
      area -= Math.max(0, Math.min(right, rect.right) - Math.max(left, rect.left))
        * Math.max(0, Math.min(bottom, rect.bottom) - Math.max(top, rect.top));
    }
    area = Math.max(0, area);
    const covered = hudRects.some((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
    const preferred = x >= 0 && x <= viewport.width && y >= 0 && y <= viewport.height
      && !covered && area / (card.width * card.height) >= .6;
    return { card, preferred, area, distance: Math.hypot(x - cx, y - cy) };
  }).filter((item) => item.area > 0);
  const preferred = ranked.filter((item) => item.preferred);
  (preferred.length ? preferred : ranked).sort((a, b) => preferred.length
    ? a.distance - b.distance
    : b.area - a.area || a.distance - b.distance);
  return (preferred.length ? preferred : ranked)[0]?.card;
}
