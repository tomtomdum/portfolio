import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // Specify the test environment
  testEnvironment: 'node',

  // Define the transform configuration for TypeScript files
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Define the file extensions Jest should look for
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};

export default config;
