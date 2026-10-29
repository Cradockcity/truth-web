import { expect, test } from 'vitest'

import { CREATOR_CREDIT_KEY, creditedCreator, rememberCreator } from './creator-credit'

function memory() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

const DAY = 24 * 60 * 60 * 1000

test('a creator is credited for 30 days after the visit', () => {
  const storage = memory()
  rememberCreator('adventure-seekers', 0, storage)
  expect(creditedCreator(29 * DAY, storage)).toBe('adventure-seekers')
  expect(creditedCreator(30 * DAY + 1, storage)).toBeNull()
})

test('the last creator visited wins', () => {
  const storage = memory()
  rememberCreator('sarah-johnson', 0, storage)
  rememberCreator('adventure-seekers', DAY, storage)
  expect(creditedCreator(2 * DAY, storage)).toBe('adventure-seekers')
})

test('bad slugs and damaged values give no credit', () => {
  const storage = memory()
  rememberCreator('Not A Slug', 0, storage)
  expect(creditedCreator(0, storage)).toBeNull()
  storage.setItem(CREATOR_CREDIT_KEY, '{oops')
  expect(creditedCreator(0, storage)).toBeNull()
  storage.setItem(CREATOR_CREDIT_KEY, JSON.stringify({ slug: '../x', until: DAY }))
  expect(creditedCreator(0, storage)).toBeNull()
})

test('blocked storage never throws', () => {
  const blocked = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
  }
  expect(() => rememberCreator('sarah-johnson', 0, blocked)).not.toThrow()
  expect(creditedCreator(0, blocked)).toBeNull()
})
