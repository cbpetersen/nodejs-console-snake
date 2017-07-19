#!/usr/bin/env babel-node

// @flow

require('babel-register')({
  ignore: /node_modules\/(?!snake)/
})

require('./src/game').default()
