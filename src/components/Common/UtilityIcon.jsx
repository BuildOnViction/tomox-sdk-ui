import React from 'react'

import SvgFavorite from './Icons/icon/favorite.js'

const UtilityIcon = ({name, size, color}) => {
    switch(name) {
        case 'Favorite':
            return  (<SvgFavorite size={size} color={color} />)
        default:
            return (<SvgFavorite size={size} color={color} />)
    }
}

export default UtilityIcon