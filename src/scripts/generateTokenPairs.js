import fs from 'fs'
import quotesBySymbol from '../jsons/quotes.json'
import tokensBySymbol from '../jsons/tokens.json'
import { generateTokenPairs } from '../utils/tokens'

const quotes = Object.values(quotesBySymbol)
const tokens = Object.values(tokensBySymbol)
const tokenPairs = generateTokenPairs(quotes, tokens)

fs.writeFile('tokenPairs.json', JSON.stringify(tokenPairs), 'utf8', err => {
  if (err) return console.log(err)
  console.log('File saved')
})
