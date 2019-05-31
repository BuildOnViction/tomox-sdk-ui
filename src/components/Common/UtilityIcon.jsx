import React from 'react'

import SvgFavorite from './Icons/utilities/favorite.js'
import SvgFavoriteSolid from './Icons/utilities/favorite-solid.js'
import SvgArrowUp from './Icons/utilities/arrow-up.js'
import SvgArrowDown from './Icons/utilities/arrow-down.js'
import SvgWallet from './Icons/utilities/wallet.js'

const UtilityIcon = ({name, size, color}) => {
    switch(name) {
        case 'Favorite':
            return  (<SvgFavorite size={size} color={color} />)
        case 'FavoriteSolid':
            return  (<SvgFavoriteSolid size={size} color={color} />)
        case 'arrow-up':
            return  (<SvgArrowUp size={size} color={color} />)
        case 'arrow-down':
            return  (<SvgArrowDown size={size} color={color} />)
        case 'wallet':
            return  (<SvgWallet size={size} color={color} />)
        default:
            return (<SvgFavorite size={size} color={color} />)
    }
}

export default UtilityIcon