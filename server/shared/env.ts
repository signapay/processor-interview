import type { EnvMode } from './const.js';

export const mode = (process.env.NODE_ENV as EnvMode) ?? 'development';

export const isProductionMode = mode === 'production';
