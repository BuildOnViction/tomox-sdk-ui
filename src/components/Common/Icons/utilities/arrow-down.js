import React from 'react'

const SvgArrowDown = props => (
    <svg xmlns='http://www.w3.org/2000/svg' width={props.width || 6} height={props.height || 4}>
        <path fill={props.color || '#6E7793'} fillRule='evenodd' d='M2.56 3.777L.107.767A.508.508 0 0 1 .123.124.366.366 0 0 1 .393 0h5.215C5.824 0 6 .204 6 .455a.496.496 0 0 1-.107.312L3.44 3.777c-.243.297-.637.297-.88 0'
        />
    </svg>
)

export default SvgArrowDown