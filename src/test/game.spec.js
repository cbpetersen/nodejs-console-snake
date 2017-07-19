/* eslint-env jest */

import * as game from '../game'
import * as printer from '../printer'

describe('When a new game has been created', () => {
  let gameState
  beforeEach(() => {
    for (let printFn in printer) {
      printer[printFn] = jest.fn()
    }

    game.newGame()
    gameState = game.getGameState()
  })

  it('player is alive', () => {
    expect(gameState.game.alive).toBe(true)
  })

  it('player is not alive when game over', () => {
    game.gameOver()
    expect(gameState.game.alive).toBe(false)
  })

  it('player is alive again, when a new game has started after game over', () => {
    game.gameOver()
    game.newGame()

    expect(gameState.game.alive).toBe(true)
  })

  it('an apple has been created', () => {
    expect(gameState.apple).toBeDefined()
  })
})
