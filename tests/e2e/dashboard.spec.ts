import { test } from '@playwright/test';

test.describe('dashboard smoke test', () => {
  test('placeholder to ensure playwright setup', () => {
    test.skip(true, 'UI smoke tests run in CI with server running');
  });
});
