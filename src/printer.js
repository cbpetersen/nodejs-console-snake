import Jetty from 'jetty'

var jetty = new Jetty(process.stdout)
jetty.clear()
if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true)
  process.stdin.resume()
}

export const print = (game) => {
  let pixel
  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      pixel = game.xy(x, y)
      jetty.rgb(pixel.color).moveTo([y, x]).text(pixel.symbol)
    }
  }
}

export const partialPrint = (game, upperX, lowerX, upperY, lowerY) => {
  let pixel
  const rectifiedLowerY = Math.max(lowerY, 0)
  const rectifiedUpperY = Math.max(upperY, 0)
  const rectifiedLowerX = Math.max(lowerX, 0)
  const rectifiedUpperX = Math.max(upperX, 0)
  for (let y = rectifiedLowerY; y < rectifiedUpperY; y++) {
    for (let x = rectifiedLowerX; x < rectifiedUpperX; x++) {
      pixel = game.xy(x, y)
      jetty.moveTo([y, x]).rgb(pixel.color).text(pixel.symbol)
    }
  }

  moveCurserToEnd(game)
}

export const updatePixel = (game, {x, y, symbol, color}) => {
  // const pixel = game.xy(x, y)
  jetty.moveTo([y, x]).rgb(color).text(symbol)
  moveCurserToEnd(game)
}

export const printGameOver = (game) => {
  const txt = 'Game Over'

  jetty.moveTo([Math.floor(game.height / 2), Math.floor((game.width / 2) - (txt.length / 2))]).text(txt)
  moveCurserToEnd(game)
}

const moveCurserToEnd = (game) => {
  const pixel = game.xy(0, 0)
  jetty.rgb(pixel.color).moveTo([0, 0]).text(pixel.symbol)
}

const logs = []
export const log = (game, string) => {
  if (typeof string !== 'string') {
    logs.push(JSON.stringify(string))
  } else {
    logs.push(string)
  }

  const logRows = 10
  const rows = logs.length > logRows ? logs.length - logRows : Math.min(logs.length, 0)
  let writeRow = 0
  for (let i = logs.length; i > rows; i--) {
    jetty.rgb([1, 1, 1]).moveTo([game.height + logRows - writeRow++, 0]).text(padEnd(logs[i], 50))
  }
}

const padEnd = (str, targetLength, padString) => {
  if (!str) {
    return
  }

  targetLength = targetLength >> 0 // floor if number or convert non-number to 0
  padString = String(padString || ' ')
  if (str.length > targetLength) {
    return String(str)
  } else {
    targetLength = targetLength - str.length
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length) // append to original to ensure we are longer than needed
    }
    return String(str) + padString.slice(0, targetLength)
  }
}
