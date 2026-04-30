import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '@/components/ui/ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('toggles dark mode when clicked', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    
    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('saves theme preference to localStorage', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    
    fireEvent.click(button)
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})