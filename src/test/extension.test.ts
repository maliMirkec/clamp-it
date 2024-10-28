import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {
  formatNumber,
  formatRem,
  generateClampFunction
} from '../extension'; // Adjust import based on your file structure

suite('Extension Test Suite', () => {
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  describe('formatNumber', () => {
    it('should format number correctly with 3 decimal places', () => {
      assert.strictEqual(formatNumber(1.23456, 3), '1.235');
      assert.strictEqual(formatNumber(1.2, 3), '1.2');
      assert.strictEqual(formatNumber(2, 3), '2');
      assert.strictEqual(formatNumber(1.00000, 3), '1');
    });
  });

  describe('formatRem', () => {
    it('should convert px to rem and format correctly', () => {
      assert.strictEqual(formatRem(32), '2rem'); // 32px to rem
      assert.strictEqual(formatRem(16), '1rem'); // 16px to rem
    });
  });

  describe('generateClampFunction', () => {
    it('should generate the correct clamp function string', () => {
      const result = generateClampFunction(16, 20, 16, 600, 1200);
      assert.strictEqual(result, 'clamp(1rem, calc(0.821rem + 0.476vw), 1.25rem); /* mobile: 16px, desktop: 20px */'); // Check expected output
    });
  });
});
