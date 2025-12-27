/**
 * Tests for Navigation component
 */

import { render, screen } from '@testing-library/react'
import Navigation from '@/components/Navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

describe('Navigation', () => {
    it('should render navigation bar', () => {
        render(<Navigation />)
        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render all navigation items', () => {
        render(<Navigation />)

        // Check for navigation links
        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(3) // Home, Companion, Medical
    })

    it('should have correct href attributes', () => {
        render(<Navigation />)

        const links = screen.getAllByRole('link')
        const hrefs = links.map(link => link.getAttribute('href'))

        expect(hrefs).toContain('/')
        expect(hrefs).toContain('/companion')
        expect(hrefs).toContain('/medical')
    })

    it('should apply active state styling', () => {
        render(<Navigation />)

        // The home link should have active styling since usePathname returns '/'
        const homeLink = screen.getAllByRole('link')[0]
        expect(homeLink.firstChild).toHaveClass('bg-cyan-500')
    })
})
