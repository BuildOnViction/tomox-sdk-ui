import { utils } from 'ethers'
import BigNumber from 'bignumber.js'
import ethereum_address from 'ethereum-address'
import { format, formatRelative } from 'date-fns'
import { pricePrecision } from '../config/tokens'

export const rand = (min, max, decimals = 4) => {
  return (Math.random() * (max - min) + min).toFixed(decimals)
}

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return '-'
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()
}

export const relativeDate = (time: number) => {
  const formattedDate = formatRelative(new Date(time), new Date())
  return capitalizeFirstLetter(formattedDate)
}

export const formatDate = (time: number, pattern: string) => {
  const formattedDate = format(new Date(time), pattern)
  return formattedDate
}

export const isFloat = n => parseFloat(n.match(/^-?\d*(\.\d+)?$/)) > 0

export const isInteger = n => /^\+?\d+$/.test(n)

export const round = (n, decimals = '2') =>
  Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)

export const convertPricepointToPrice = (
  n,
  pricePointMultiplier = 1e9,
  decimals = 6
) => {
  const price =
    Math.round((n / pricePointMultiplier) * Math.pow(10, decimals)) /
    Math.pow(10, decimals)
  // console.log(pricePointMultiplier, price);
  return price
}
export const sortTable = (
  table,
  column,
  order: (a, b) => number | string = 'asc | des'
) => {
  const compareFn =
    typeof order === 'function' ? order : (a, b) => compare(a, b, order)
  return table.sort((a, b) => compareFn(a[column], b[column]))
}

export const compare = (a, b, order = 'asc') => {
  // console.log(a, b);
  if (typeof a === 'string' && typeof b === 'string') {
    a = a.toUpperCase()
    b = b.toUpperCase()
  }
  //eslint-disable-next-line
  return order === 'asc' ? (a < b ? -1 : 1) : a < b ? 1 : -1
}

export const filterer = (filter, coin, wrt, filterValue) => {
  if (filter) {
    return coin[wrt] === filterValue
  }
  return true
}

export const isJson = text => {
  return /^[\],:{}\s]*$/.test(
    text // eslint-disable-next-line
      .replace(/\\["\\\/bfnrtu]/g, '@') // eslint-disable-next-line
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
        ']'
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  )
}

export function toPassowrdType(text) {
  if (typeof text === 'string' || typeof text === 'number') {
    return '*'.repeat(text.length)
  }
  return text
}

export function getSessionStorageWallets() {
  const wallets = [{ address: 'Enter new...', key: '', rank: 0 }]
  let index = 1
  Object.keys(sessionStorage).map(key => {
    if (ethereum_address.isAddress(key)) {
      wallets.push({ address: key, key: sessionStorage[key], rank: index })
      index++
    }
    return key
  })
  return wallets
}

export function getLocalStorageWallets() {
  const wallets = [{ address: 'Enter new...', key: '', rank: 0 }]
  let index = 1
  Object.keys(localStorage).map(key => {
    if (ethereum_address.isAddress(key) && isJson(localStorage[key])) {
      wallets.push({ address: key, key: localStorage[key], rank: index })
      index++
    }
    return key
  })
  return wallets
}

export function passTimestamp(key) {
  if (typeof key === 'string') {
    return new Date(key).getTime()
  }
  if (Object.prototype.toString.call(key) === '[object Date]') {
    return key.getTime()
  }
  return key
}

export const computeTokenAmount = (amount: Object, tokenDecimals: number) => {
  return utils
    .bigNumberify(amount)
    .div(utils.bigNumberify(10).pow(tokenDecimals))
    .toString()
}

export const computePricepoint = ({
                                    price,
                                    // priceMultiplier,
                                    quoteMultiplier,
                                    pricePrecisionMultiplier,
                                  }: *) => {
  const a = price * pricePrecisionMultiplier
  const b = a.toFixed(0)
  const c = utils.bigNumberify(b)
  const d = c
    // .mul(priceMultiplier)
    .mul(quoteMultiplier)
    .div(pricePrecisionMultiplier)

  return d
}

export const computeAmountPoints = ({
                                      amount,
                                      baseMultiplier,
                                      amountPrecisionMultiplier,
                                    }: *) => {
  const a = amount * amountPrecisionMultiplier
  const b = a.toFixed(0)
  const c = utils.bigNumberify(b)
  const d = c.mul(baseMultiplier).div(amountPrecisionMultiplier)

  return d
}

export const computePairMultiplier = ({
                                        priceMultiplier,
                                        baseMultiplier,
                                        quoteMultiplier,
                                      }: *) => {
  return priceMultiplier.mul(baseMultiplier)
}

export const max = (a: Object, b: Object) => {
  const bigA = utils.bigNumberify(a)
  const bigB = utils.bigNumberify(b)

  if (bigA.gte(bigB)) {
    return bigA
  }
    return bigB

}

export const min = (a: Object, b: Object) => {
  const bigA = utils.bigNumberify(a)
  const bigB = utils.bigNumberify(b)

  if (bigA.lte(bigB)) {
    return bigA
  }
    return bigB

}

export const minOrderAmount = (makeFee: string, takeFee: string) => {
  const bigMakeFee = utils.bigNumberify(makeFee)
  const bigTakeFee = utils.bigNumberify(takeFee)
  const minAmount = bigMakeFee.mul(2).add(bigTakeFee.mul(2))

  return minAmount
}

export const computeChange = (open: string, close: string) => {
  const bigOpen = utils.bigNumberify(open)
  const bigClose = utils.bigNumberify(close)
  const percentMultiplier = utils.bigNumberify(100)

  if (bigOpen.eq(bigClose)) return 0

  // Multiply by 100 to keep 2 decimal places. Because BigNumber only support intergers
  // Reference: https://github.com/ethers-io/ethers.js/issues/488
  const change = ((bigClose.sub(bigOpen)).mul(percentMultiplier)).mul('100').div(bigOpen)
  const percentChange = Number(utils.formatUnits(change, 2))
  return percentChange
}

export const getChangePercentText = (change) => {

  const percent = Number(change) || 0

  if (percent > 0) return `+${percent}%`
  if (percent < 0) return `${percent}%`

  return `${BigNumber(percent).toFormat(2)}%`
}

export const getChangePriceText: string = (open: string, close: string, precision: number = pricePrecision) => {
  const result = BigNumber(close).minus(open)

  if (result > 0) return `+${BigNumber(result).toFormat(precision)}`
  if (result < 0) return `${BigNumber(result).toFormat(precision)}`

  return `${result}`
}

// Reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = (array) => {
  const shuffeArray = JSON.parse(JSON.stringify(array))
  let currentIndex = shuffeArray.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = shuffeArray[currentIndex]
    shuffeArray[currentIndex] = shuffeArray[randomIndex]
    shuffeArray[randomIndex] = temporaryValue
  }

  return shuffeArray
}


// Reference: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
export const validatePassword = (password) => {
  const validationPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^\-_])[A-Za-z\d@$!%*?&#^\-_]{8,}$/g

  return validationPasswordRegex.test(password.trim())
}

export const truncateZeroDecimal = (num: String) => {
  if (!num) return null

  if (num.match(/\.[0]+$/g)) {
    num = num.replace(/\.[0]+$/g, '')
  }

  if (num.match(/\.\d+[0]+$/g)) {
    num = num.replace(/[0]+$/g, '')
  }

  return num
}

// Reference: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export const isMobile = () => {
  let check = false;
  // eslint-disable-next-line
  (function(a) {if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true})(navigator.userAgent||navigator.vendor||window.opera)
  return check
}

export const isWeb3 = () => {
  return window.web3 || !window.web3.currentProvider
}

export const isTomoWallet = () => {
  if (!window.web3 || !window.web3.currentProvider) return false
  return window.web3.currentProvider.isTomoWallet
}

export const calcPrecision = (price: number) => {
  const totalPrecision = 8
  let pricePrecision, amountPrecision

  if (!price) return { pricePrecision: totalPrecision, amountPrecision: totalPrecision }

  switch (true) {
    case (price >= 50):
      pricePrecision = 2
      amountPrecision = totalPrecision - pricePrecision
      break
    case (price >= 1):
      pricePrecision = 4
      amountPrecision = totalPrecision - pricePrecision
      break
    case (price >= 0.1):
      pricePrecision = 5
      amountPrecision = totalPrecision - pricePrecision
      break
    case (price >= 0.001):
      pricePrecision = 6
      amountPrecision = totalPrecision - pricePrecision
      break
    default:
      pricePrecision = 8
      amountPrecision = totalPrecision - pricePrecision
      break
  }

  return { pricePrecision, amountPrecision }
}

export const calcPercent = (a: string, b: string, precision: number) => {
  const aFormated = BigNumber(a).toFixed(precision)
  const bFormated = BigNumber(b).toFixed(precision)

  return BigNumber(aFormated).times(100).div(bFormated).toNumber()
}

export function getLendingPairName(lendingPair) {
  const [term, lendingToken] = lendingPair.split('::')
  const days = (Number(term)/60/60/24)

  switch (true) {
    case (days <= 30):
      return `${days.toFixed()} Days/${lendingToken}`
    default:
      return `${(days/30).toFixed()} Months / ${lendingToken}`
  }
}