const fs = require('fs')
const path = require('path')
const program = require('commander')

require('dotenv').load()

const messages = require('../locales/messages.json')

program
  .version('0.1.0')
  .option('-t, --trim [value]', 'Trim unused messages')
  .parse(process.argv)

const LOCALES_PATH = path.resolve(__dirname, '../locales')
const LANGS_PATH = path.join(LOCALES_PATH, 'langs')

const files = fs.readdirSync(LANGS_PATH)

const messageMap = messages.reduce((map, message) => {
  map[message.id] = message.defaultMessage
  return map
}, {})

files.forEach(file => {
  const langFile = `${LANGS_PATH}/${file}`
  let json
  try {
    json = JSON.parse(fs.readFileSync(langFile, 'utf8'))
  } catch (e) {
    console.log(e)
    json = {}
  }
  let updatedJson = {}
  for (const key in messageMap) {
    updatedJson[key] = json[key] || messageMap[key]
  }

  // update remaining keys in json
  if (!program.trim) {
    for (const key in json) {
      if (!messageMap[key]) {
        updatedJson[key] = json[key]
      }
    }
  }

  // sort by keys
  updatedJson = Object.keys(updatedJson)
    .sort()
    .reduce((map, key) => {
      map[key] = updatedJson[key]
      return map
    }, {})

  // console.log(json)
  console.log('Update file : ' + langFile)
  fs.writeFileSync(langFile, JSON.stringify(updatedJson, null, 2))
})
