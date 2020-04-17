import React from 'react'

import SvgFavorite from './Icons/utilities/favorite.js'
import SvgFavoriteSolid from './Icons/utilities/favorite-solid.js'
import SvgArrowUp from './Icons/utilities/arrow-up.js'
import SvgArrowDown from './Icons/utilities/arrow-down.js'
import SvgWallet from './Icons/utilities/wallet.js'
import Login from './Icons/utilities/login.js'
import NotFound from './Icons/utilities/not-found.js'
import Lending from './Icons/utilities/lending.js'

const UtilityIcon = ({name, width, height, color}) => {
    switch(name) {
        case 'Favorite':
            return  (<SvgFavorite width={width} height={height} color={color} />)
        case 'FavoriteSolid':
            return  (<SvgFavoriteSolid width={width} height={height} color={color} />)
        case 'arrow-up':
            return  (<SvgArrowUp width={width} height={height} color={color} />)
        case 'arrow-down':
            return  (<SvgArrowDown width={width} height={height} color={color} />)
        case 'wallet':
            return  (<SvgWallet width={width} height={height} color={color} />)
        case 'login':
            return  (<Login width={width} height={height} color={color} />)
        case 'not-found':
            return  (<NotFound width={width} height={height} color={color} />)
        case 'lending':
            return  (<Lending width={width} height={height} color={color} />)
        default:
            return (<SvgFavorite width={width} height={height} color={color} />)
    }
}

export default UtilityIcon