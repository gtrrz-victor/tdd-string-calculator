import { expect, test, describe } from 'vitest'
import { add } from './add'

describe('String Calculator', () => {
  describe('Requirement 1: Handle up to two numbers separated by commas', () => {
    test('returns 0 for empty string', () => {
      expect(add("")).toBe(0)
    })

    test('returns the number itself for single number', () => {
      expect(add("1")).toBe(1)
      expect(add("5")).toBe(5)
      expect(add("42")).toBe(42)
    })

    test('returns sum for two numbers separated by comma', () => {
      expect(add("1,2")).toBe(3)
      expect(add("5,10")).toBe(15)
      expect(add("0,0")).toBe(0)
      expect(add("100,200")).toBe(300)
    })
  })

  describe('Requirement 2: Handle unknown number of arguments', () => {
    test('handles multiple numbers separated by commas', () => {
      expect(add("1,2,3")).toBe(6)
      expect(add("1,2,3,4,5")).toBe(15)
      expect(add("10,20,30,40")).toBe(100)
      expect(add("1,1,1,1,1,1")).toBe(6)
    })
  })

  describe('Requirement 3: Handle newlines as separators', () => {
    test('handles newlines instead of commas', () => {
      expect(add("1\n2")).toBe(3)
      expect(add("1\n2\n3")).toBe(6)
      expect(add("10\n20\n30")).toBe(60)
    })

    test('handles mixed commas and newlines', () => {
      expect(add("1,2\n3")).toBe(6)
      expect(add("1\n2,3")).toBe(6)
      expect(add("1,2\n3,4")).toBe(10)
      expect(add("5\n10,15\n20")).toBe(50)
    })
  })

  describe('Requirement 4: Validate separators - no separator at end', () => {
    test('throws error for comma at end', () => {
      expect(() => add("1,2,")).toThrow()
      expect(() => add("5,")).toThrow()
      expect(() => add(",")).toThrow()
      expect(() => add("1,2,3,")).toThrow()
    })

    test('throws error for newline at end', () => {
      expect(() => add("1,2\n")).toThrow()
      expect(() => add("5\n")).toThrow()
      expect(() => add("\n")).toThrow()
      expect(() => add("1\n2\n3\n")).toThrow()
    })

    test('throws error for invalid separator combinations', () => {
      expect(() => add("2,\n3")).toThrow()
      expect(() => add("1,\n")).toThrow()
      expect(() => add("1\n,2")).toThrow()
    })
  })

  describe('Requirement 5: Handle different delimiters', () => {
    test('handles custom single character delimiters', () => {
      expect(add("//;\n1;3")).toBe(4)
      expect(add("//|\n1|2|3")).toBe(6)
      expect(add("//:\n5:10:15")).toBe(30)
      expect(add("//*\n2*4*6")).toBe(12)
    })

    test('handles custom multi-character delimiters', () => {
      expect(add("//sep\n2sep5")).toBe(7)
      expect(add("//***\n1***2***3")).toBe(6)
      expect(add("//abc\n10abc20abc30")).toBe(60)
    })

    test('throws error when wrong delimiter is used', () => {
      expect(() => add("//|\n1|2,3")).toThrow("'|' expected but ',' found at position 3.")
      expect(() => add("//;\n1;2,3")).toThrow("';' expected but ',' found at position 3.")
      expect(() => add("//sep\n1sep2,3")).toThrow("'sep' expected but ',' found at position 5.")
    })
  })

  describe('Requirement 6: Negative numbers not allowed', () => {
    test('throws error for single negative number', () => {
      expect(() => add("1,-2")).toThrow("Negative number(s) not allowed: -2")
      expect(() => add("-5")).toThrow("Negative number(s) not allowed: -5")
      expect(() => add("10,-1,20")).toThrow("Negative number(s) not allowed: -1")
      expect(() => add("-1,20")).toThrow("Negative number(s) not allowed: -1")
    })

    test('throws error for multiple negative numbers', () => {
      expect(() => add("2,-4,-9")).toThrow("Negative number(s) not allowed: -4, -9")
      expect(() => add("-1,-2,-3")).toThrow("Negative number(s) not allowed: -1, -2, -3")
      expect(() => add("1,-2,3,-4,5")).toThrow("Negative number(s) not allowed: -2, -4")
    })

    test('throws error for negative numbers with custom delimiters', () => {
      expect(() => add("//;\n1;-2")).toThrow("Negative number(s) not allowed: -2")
      expect(() => add("//|\n-1|2|-3")).toThrow("Negative number(s) not allowed: -1, -3")
    })

    test('throws error for negative numbers with newlines', () => {
      expect(() => add("1\n-2")).toThrow("Negative number(s) not allowed: -2")
      expect(() => add("-1\n2\n-3")).toThrow("Negative number(s) not allowed: -1, -3")
    })
  })

  describe('Requirement 7: Multiple errors return all error messages', () => {
    test('returns both negative number and wrong delimiter errors', () => {
      expect(() => add("//|\n1|2,-3")).toThrow("Negative number(s) not allowed: -3\n'|' expected but ',' found at position 3.")
    })

    test('handles multiple types of errors together', () => {
      expect(() => add("//;\n-1;2,3")).toThrow("Negative number(s) not allowed: -1\n';' expected but ',' found at position 4.")
      expect(() => add("//|\n1|-2|3,-4")).toThrow("Negative number(s) not allowed: -2, -4\n'|' expected but ',' found at position 6.")
    })
  })

  describe('Requirement 8: Numbers bigger than 1000 should be ignored', () => {
    test('ignores numbers greater than 1000', () => {
      expect(add("2,1001")).toBe(2)
      expect(add("1000,1001")).toBe(1000)
      expect(add("5,2000,10")).toBe(15)
      expect(add("999,1000,1001")).toBe(1999)
    })

    test('ignores large numbers with custom delimiters', () => {
      expect(add("//;\n2;1001")).toBe(2)
      expect(add("//|\n5|2000|10")).toBe(15)
      expect(add("//sep\n100sep1500sep200")).toBe(300)
    })

    test('ignores large numbers with newlines', () => {
      expect(add("2\n1001")).toBe(2)
      expect(add("5,2000\n10")).toBe(15)
      expect(add("100\n1500,200")).toBe(300)
    })

    test('handles edge case with exactly 1000', () => {
      expect(add("1000")).toBe(1000)
      expect(add("1000,500")).toBe(1500)
      expect(add("1001")).toBe(0)
    })
  })

  describe('Edge cases and additional scenarios', () => {
    test('handles zero values correctly', () => {
      expect(add("0")).toBe(0)
      expect(add("0,0")).toBe(0)
      expect(add("0,5,0")).toBe(5)
      expect(add("//;\n0;0;0")).toBe(0)
    })

    test('handles single numbers with custom delimiters', () => {
      expect(add("//;\n5")).toBe(5)
      expect(add("//|\n42")).toBe(42)
      expect(add("//sep\n100")).toBe(100)
    })

    test('handles empty custom delimiter sections', () => {
      expect(add("//;\n")).toBe(0)
      expect(add("//|\n")).toBe(0)
    })
  })
})