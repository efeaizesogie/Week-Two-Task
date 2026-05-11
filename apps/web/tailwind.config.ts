import type { Config } from 'tailwindcss';

import preset from '@rfpilot/ui/tailwind.preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
