import dotenv from 'dotenv'

let envPath

switch (process.env.NODE_ENV) {
  case 'development':
    envPath = '~/.env.development'
    break
  case 'test':
    envPath = '~/.env.test'
    break
  default:
    envPath = '~/.env'
    break
}

dotenv.config({
  path: envPath,
})
