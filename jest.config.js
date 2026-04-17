module.exports = {
  // AJUSTAR según tu proyecto:
  // Para Node.js puro: "node"
  // Para navegador/React: "jsdom"
  testEnvironment: 'node',
  
  // Rutas de archivos de test
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Extensiones de archivo
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'cobertura'
  ],
  
  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    // AJUSTAR la ruta según tu estructura:
    // 'app/**/*.{js,jsx,ts,tsx}',
    // 'lib/**/*.{js,jsx,ts,tsx}',
    // 'components/**/*.{js,jsx,ts,tsx}',
    
    // Exclusiones
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ],
  
  // Umbrales de cobertura (ajustar según necesites)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Transformaciones para TypeScript/JSX
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
    // DESCOMENTAR para TypeScript:
    // '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  
  // DESCOMENTAR para TypeScript:
  // preset: 'ts-jest',
  
  // Module name mapper para imports absolutos y assets
  moduleNameMapper: {
    // AJUSTAR según tu configuración de paths:
    // '^@/(.*)$': '<rootDir>/src/$1',
    // '^@components/(.*)$': '<rootDir>/src/components/$1',
    // '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    
    // Para archivos estáticos
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Setup files
  // DESCOMENTAR si necesitas setup:
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Ignorar carpetas
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.next/',
    '/.nuxt/'
  ],
  
  // Transformar node_modules si es necesario
  transformIgnorePatterns: [
    'node_modules/(?!(module-to-transform)/)'
    // AJUSTAR si necesitas transformar algún módulo específico
  ],
  
  // Verbose output
  verbose: true,
  
  // DESCOMENTAR para React Testing Library:
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // DESCOMENTAR para Next.js:
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
  // testEnvironment: 'jsdom',
  
  // DESCOMENTAR para Vue:
  // testEnvironment: 'jsdom',
  // transform: {
  //   '^.+\\.vue$': '@vue/vue3-jest',
  //   '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  
  // Timeout para tests
  testTimeout: 10000
};
