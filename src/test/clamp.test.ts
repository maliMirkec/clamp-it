import * as assert from 'assert';
import { formatNumber, formatRem, generateClampFunction, parseInput } from '../clamp';

const defaults = { viewportMin: 600, viewportMax: 1200, baseFontSize: 16 };

const clamp = (text: string, showComments = false) => {
  const input = parseInput(text, defaults);
  if (typeof input === 'string') {
    throw new Error(input);
  }
  return generateClampFunction(input, showComments);
};

suite('formatNumber', () => {
  test('rounds and trims', () => {
    assert.strictEqual(formatNumber(1.23456, 3), '1.235');
    assert.strictEqual(formatNumber(1.2, 3), '1.2');
    assert.strictEqual(formatNumber(2, 3), '2');
    assert.strictEqual(formatNumber(-0.0001, 3), '0');
  });
});

suite('formatRem', () => {
  test('converts px to rem', () => {
    assert.strictEqual(formatRem(32), '2rem');
    assert.strictEqual(formatRem(16), '1rem');
    assert.strictEqual(formatRem(14, 14), '1rem');
  });
});

suite('generateClampFunction', () => {
  test('uses global viewports when only font sizes are given', () => {
    assert.strictEqual(clamp('16, 20'), 'clamp(1rem, calc(0.75rem + 0.667vw), 1.25rem)');
  });

  test('uses custom viewports', () => {
    assert.strictEqual(clamp('16, 32, 375, 768'), 'clamp(1rem, calc(0.046rem + 4.071vw), 2rem)');
  });

  test('uses a custom base font size', () => {
    assert.strictEqual(clamp('16, 20, 600, 1200, 10'), 'clamp(1.6rem, calc(1.2rem + 0.667vw), 2rem)');
  });

  test('accepts px units', () => {
    assert.strictEqual(clamp('16px, 20px'), clamp('16, 20'));
  });

  test('accepts 0 as minimum viewport', () => {
    assert.strictEqual(clamp('16, 20, 0, 1000'), 'clamp(1rem, calc(1rem + 0.4vw), 1.25rem)');
  });

  test('uses defaults for empty values', () => {
    assert.strictEqual(clamp('16, 20, , , 16'), clamp('16, 20'));
  });

  test('shrinks when the mobile size is larger', () => {
    assert.strictEqual(clamp('20, 16'), 'clamp(1rem, calc(1.5rem - 0.667vw), 1.25rem)');
  });

  test('returns a plain value when sizes are equal', () => {
    assert.strictEqual(clamp('16, 16'), '1rem');
  });

  test('adds a comment without a semicolon', () => {
    assert.strictEqual(
      clamp('16, 20', true),
      'clamp(1rem, calc(0.75rem + 0.667vw), 1.25rem) /* min: 16px, max: 20px */',
    );
  });
});

suite('parseInput', () => {
  const error = (text: string) => typeof parseInput(text, defaults) === 'string';

  test('rejects bad input', () => {
    assert.ok(error(''));
    assert.ok(error('16'));
    assert.ok(error('16, abc'));
    assert.ok(error('16, 20, 1200, 600'));
    assert.ok(error('16, 20, 600, 600'));
    assert.ok(error('16, 20, 600, 1200, 0'));
    assert.ok(error('16, 20, 600, 1200, 16, 1'));
    assert.ok(error('-16, 20'));
  });
});
