import '@testing-library/jest-dom'

// Set environment variables for testing
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-jest'

// Suppress JSDOM navigation errors and React warnings
const originalError = console.error
console.error = (...args: any[]) => {
  const message = args[0]?.toString?.() || ''
  if (
    message.includes('Not implemented: navigation') ||
    message.includes('non-boolean attribute `fill`') ||  // Add this line
    message.includes('React does not recognize the `fill` prop')  // Also filter this
  ) {
    return
  }
  originalError.call(console, ...args)
}


// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ 
    data: null, 
    status: 'unauthenticated' 
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock