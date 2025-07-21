import { expect, test } from 'vitest'
import { add } from './add'

test('adds "" to equal 0', () => {
  expect(add("")).toBe(0)
})