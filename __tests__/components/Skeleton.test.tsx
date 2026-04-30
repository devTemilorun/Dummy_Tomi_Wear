import { render, screen } from '@testing-library/react'
import { Skeleton, ProductSkeleton } from '@/components/ui/Skeleton'

describe('Skeleton Components', () => {
  it('renders basic skeleton', () => {
    render(<Skeleton className="h-4 w-full" />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders product skeleton', () => {
    render(<ProductSkeleton />)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})