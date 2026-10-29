import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ExperienceCard, type ExperienceCardData } from './experience-card'

vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))

const experience: ExperienceCardData = {
  id: 'exp-1',
  title: 'Sunset Safari with Professional Photography',
  location: 'Kruger National Park',
  category: 'Adventure',
  duration: '4 hours',
  price: 1800,
  rating: 5,
  reviewCount: 67,
  imageUrl: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg',
}

test('links the title to the experience and shows price and rating', () => {
  render(<ExperienceCard experience={experience} />)

  expect(screen.getByRole('link', { name: experience.title })).toHaveAttribute(
    'href',
    '/experiences/exp-1',
  )
  expect(screen.getByText(/R\s?1\s800/)).toBeInTheDocument()
  expect(screen.getByText('Rated 5.0 out of 5 from 67 reviews')).toBeInTheDocument()
})

test('save button toggles its pressed state and remembers it', () => {
  render(<ExperienceCard experience={experience} />)
  const save = screen.getByRole('button', { name: `Save ${experience.title}` })

  expect(save).toHaveAttribute('aria-pressed', 'false')
  fireEvent.click(save)
  expect(
    screen.getByRole('button', { name: `Remove ${experience.title} from saved` }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(JSON.parse(localStorage.getItem('truth-saved') ?? '[]')).toEqual(['exp-1'])
  localStorage.clear()
})

test('hides the rating when there are no reviews', () => {
  render(<ExperienceCard experience={{ ...experience, rating: null, reviewCount: null }} />)
  expect(screen.queryByText(/out of 5/)).not.toBeInTheDocument()
})
