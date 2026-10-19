import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

export default createJestConfig({
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
    collectCoverageFrom: ['components/**/*.tsx', 'lib/**/*.ts', '!**/__tests__/**'],
});