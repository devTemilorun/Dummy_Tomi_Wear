import '@testing-library/jest-dom'

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

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ 
    data: null, 
    status: 'unauthenticated' 
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value
    },
    removeItem: (key: string): void => {
      delete store[key]
    },
    clear: (): void => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

interface LocationMock {
  href: string
  assign: jest.Mock
  replace: jest.Mock
  reload: jest.Mock
  toString: () => string
}

const locationMock: LocationMock = {
  href: 'http://localhost:3000',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: () => locationMock.href,
}

delete (window as any).location
window.location = locationMock as any

global.fetch = jest.fn() as jest.Mock

const originalConsoleError = console.error
console.error = jest.fn()

afterAll(() => {
  console.error = originalConsoleError
})