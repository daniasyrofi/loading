import test from 'node:test';
import assert from 'node:assert/strict';
import { generateChunk, intersects, nearestCard } from '../showcase-chunks.js';

const geometry = {
  width: 1600.8, height: 705.6, pitchX: 533.6, pitchY: 176.4, scale: 1.24,
  templates: [{ entry: { id: '02' }, width: 350, height: 60, variantCount: 3 },
    { entry: { id: '06' }, width: 290, height: 60, variantCount: 3 }],
  obstacles: []
};

test('chunk IDs, variants, positions and elapsed values are deterministic', () => {
  assert.deepEqual(generateChunk(-8, 5, geometry), generateChunk(-8, 5, geometry));
  const cards = generateChunk(-8, 5, geometry);
  assert.equal(cards.length, 12);
  assert.ok(cards.every((card) => card.variantIndex >= 0 && card.variantIndex < 3));
});

test('negative and distant chunk seams have no duplicates or collisions', () => {
  const cards = [];
  for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) {
    cards.push(...generateChunk(x, y, geometry));
  }
  assert.equal(new Set(cards.map((card) => card.id)).size, cards.length);
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
    assert.equal(intersects(cards[i], cards[j], 39.99), false, `${cards[i].id} overlaps ${cards[j].id}`);
  }
});

test('authored original cards reserve their space', () => {
  const obstacle = { x: 0, y: 0, width: 434, height: 75 };
  const cards = generateChunk(0, 0, { ...geometry, obstacles: [obstacle] });
  assert.ok(cards.every((card) => !intersects(card, obstacle, 40)));
});

const viewport = { width: 800, height: 600 };
const camera = { x: 0, y: 0 };
const card = (id, x, y, width = 200, height = 70) => ({ id, x, y, width, height });
test('Single chooses the nearest visible card using the actual camera', () => {
  const cards = [card('a', 0, 0), card('b', 450, 0)];
  assert.equal(nearestCard(cards, camera, viewport).id, 'a');
  assert.equal(nearestCard(cards, { x: -450, y: 0 }, viewport).id, 'b');
});
test('nearest card ignores covered HUD centers and invisible cards', () => {
  const cards = [card('covered', 0, 0), card('visible', 0, 120), card('outside', 1200, 0)];
  assert.equal(nearestCard(cards, camera, viewport,
    [{ left: 300, top: 250, right: 500, bottom: 350 }]).id, 'visible');
  assert.equal(nearestCard([cards[2]], camera, viewport), undefined);
});
test('partially visible fallback prefers the largest visible area', () => {
  assert.equal(nearestCard([card('sliver', -480, 0), card('half', 430, 0)], camera, viewport).id, 'half');
});
