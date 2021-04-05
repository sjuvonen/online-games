function getBulls (number) {
  if (number === 55) {
    return 7
  }

  if (number % 11 === 0) {
    return 5
  }

  if (number % 10 === 0) {
    return 3
  }

  if (number % 5 === 0) {
    return 2
  }

  return 1
}

export function makeCards () {
  return Array.from({ length: 104 }).map((_, i) => ({
    number: i + 1,
    bulls: getBulls(i + 1)
  }))
}
