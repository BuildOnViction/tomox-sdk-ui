import React from 'react'

import SvgFavorite from './Icons/icon/favorite.js'
import SvgFavoriteSolid from './Icons/icon/favorite-solid.js'

const UtilityIcon = ({name, size, color}) => {
    switch(name) {
        case 'Favorite':
            return  (<SvgFavorite size={size} color={color} />)
        case 'Favorite-Solid':
            return  (<SvgFavoriteSolid size={size} color={color} />)
        default:
            return (<SvgFavorite size={size} color={color} />)
    }
}

export default UtilityIcon