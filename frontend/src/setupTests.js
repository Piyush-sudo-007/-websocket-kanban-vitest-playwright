import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend({
  ...import('@testing-library/jest-dom/matchers'),
});

afterEach(() => {
  cleanup();
});

