import React from 'react'

const SvgArrowUp = props => (
    <svg xmlns='http://www.w3.org/2000/svg' width={props.size || 6} height={props.size || 4}>
        <path fill={props.color || '#6E7793'} fillRule='evenodd' d='M2.56.223c.243-.297.637-.297.88 0l2.453 3.01A.496.496 0 0 1 6 3.545C6 3.796 5.824 4 5.608 4H.393a.366.366 0 0 1-.27-.124.508.508 0 0 1-.016-.643L2.56.223z'
        />
    </svg>
)

export default SvgArrowUp