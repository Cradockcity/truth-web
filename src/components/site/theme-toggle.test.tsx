import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { THEME_STORAGE_KEY } from '@/lib/theme'

import { ThemeToggle } from './theme-toggle'

afterEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

test('defaults to matching the device', () => {
  render(<ThemeToggle />)
  expect(screen.getByRole('radio', { name: /Auto/ })).toHaveAttribute('aria-checked', 'true')
  expect(document.documentElement).not.toHaveAttribute('data-theme')
})

test('choosing dark saves it and applies it to the page', () => {
  render(<ThemeToggle />)
  fireEvent.click(screen.getByRole('radio', { name: /Dark/ }))

  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  expect(screen.getByRole('radio', { name: /Dark/ })).toHaveAttribute('aria-checked', 'true')
})

test('choosing auto clears the saved choice', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'light')
  render(<ThemeToggle />)
  expect(screen.getByRole('radio', { name: /Light/ })).toHaveAttribute('aria-checked', 'true')

  fireEvent.click(screen.getByRole('radio', { name: /Auto/ }))
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  expect(document.documentElement).not.toHaveAttribute('data-theme')
})
