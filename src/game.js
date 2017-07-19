import keypress from 'keypress'

import * as printer from './printer'

const setupKeypress = () => {
  keypress(process.stdin)
  process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name === 'c') {
      process.exit(0)
    }

    move(key.name)
  })
}

const board = []

export const move = (direction, step) => {
  const confirmMove = (x, y) => {
    setXy(player.x, player.y, player)
    if (player.x === apple.x && player.y === apple.y) {
      printer.log(game, `apple eaten`)
      player.hiddenTail = { ...apple, symbol: 'o' }
      createApple()
    }

    lastMove = direction
    nextMove = process.uptime() + 0.25

    for (let i = player.tail.length - 1; i >= 0; i--) {
      const tail = player.tail[i]
      if (i === player.tail.length - 1) {
        setXy(player.tail[i].x, tail.y, { symbol: ' ' })
      }
      if (i === 0) {
        tail.x = x
        tail.y = y
        setXy(x, y, tail)
      } else {
        tail.x = player.tail[i - 1].x
        tail.y = player.tail[i - 1].y
        setXy(tail.x, tail.y, tail)
      }
    }
  }

  if (!game.alive) {
    if (direction === 'return') {
      newGame()
    }

    return
  }

  // going up/down, can only move to sides
  let {x, y} = player
  if (lastMove === 'left' || lastMove === 'right' || step) {
    if (direction === 'up') {
      if (player.y - 1 > 0) {
        setXy(player.x, player.y--, {...player, symbol: ' '})
        confirmMove(x, y)
      } else {
        gameOver()
      }
    } else if (direction === 'down') {
      if (player.y + 1 < game.height - 1) {
        setXy(player.x, player.y++, {...player, symbol: ' '})
        confirmMove(x, y)
      } else {
        gameOver()
      }
    }
  } if (lastMove === 'up' || lastMove === 'down' || step) {
    if (direction === 'left') {
      if (player.x - 1 > 0) {
        setXy(player.x--, player.y, {...player, symbol: ' '})
        confirmMove(x, y)
      } else {
        gameOver()
      }
    } else if (direction === 'right') {
      if (player.x + 1 < game.width - 1) {
        setXy(player.x++, player.y, {...player, symbol: ' '})
        confirmMove(x, y)
      } else {
        gameOver()
      }
    }
  }
}

export const xy = (x, y) => {
  return board[x + (y * game.width)]
}

export const setXy = (x, y, val) => {
  board[x + (y * game.width)] = val
  printer.updatePixel(game, {...val, x, y})
}

let game = {
  height: 20,
  width: 30,
  xy: xy,
  alive: true
}
let player
let apple
let nextMove = 0
let lastMove = 'right'

export const gameOver = () => {
  game.alive = false
  printer.printGameOver(game)
}

export const getGameState = () => ({
  board,
  game,
  player,
  apple
})

export const createApple = () => {
  const x = Math.round(Math.random() * game.width)
  const y = Math.round(Math.random() * game.height)
  const pixel = xy(x, y)

  if (pixel.symbol !== ' ') {
    return createApple()
  }

  pixel.color = Math.round(Math.random() * 215)
  pixel.symbol = '@'

  apple = {
    ...pixel,
    x: x,
    y: y
  }
  printer.log(game, `apple created at: ${JSON.stringify(apple)}`)
  printer.updatePixel(game, apple)
}

export const gameLoopUpdate = () => {
  move(lastMove, true)
}

export const gameLoop = () => {
  setInterval(() => {
    if (nextMove > process.uptime()) {
      return
    }
    gameLoopUpdate()
    if (player.hiddenTail) {
      player.tail.push(player.hiddenTail)
      delete player.hiddenTail
    }

    nextMove = process.uptime() + 0.25
  }, 50)
}

export const newGame = () => {
  board.length = 0
  player = {
    x: Math.floor(game.width / 2),
    y: Math.floor(game.height / 2),
    color: [100, 0, 100],
    symbol: 'O',
    tail: [],
    hiddenTail: null
  }

  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      if (x === player.x && y === player.y) {
        board.push(player)
        continue
      }

      board.push({
        symbol: y === 0 || x === 0 || y === game.height - 1 || x === game.width - 1 ? '#' : ' ',
        color: [3, 0, 2]
      })
    }
  }

  createApple()
  game.alive = true
  printer.print(game)
}

export default () => {
  setupKeypress()
  newGame()
  gameLoop()
}
