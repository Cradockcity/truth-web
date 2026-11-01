import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { HeaderShell, useHeaderFloating } from './header-shell'

function Probe() {
  return <span>{useHeaderFloating() ? 'floating' : 'solid'}</span>
}

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  act(() => {
    fireEvent.scroll(window)
  })
}

afterEach(() => scrollTo(0))

test('floats over the hero, then turns solid once scrolled past it', () => {
  render(
    <HeaderShell overlay>
      <Probe />
    </HeaderShell>,
  )
  const header = screen.getByRole('banner')

  expect(screen.getByText('floating')).toBeInTheDocument()
  expect(header).toHaveClass('scheme-dark')

  scrollTo(window.innerHeight)
  expect(screen.getByText('solid')).toBeInTheDocument()
  expect(header).not.toHaveClass('scheme-dark')
  expect(header).toHaveClass('bg-canvas/85')

  scrollTo(0)
  expect(screen.getByText('floating')).toBeInTheDocument()
})

test('pages without a hero always get the solid sticky header', () => {
  render(
    <HeaderShell overlay={false}>
      <Probe />
    </HeaderShell>,
  )
  expect(screen.getByText('solid')).toBeInTheDocument()
  expect(screen.getByRole('banner')).toHaveClass('sticky')
})
