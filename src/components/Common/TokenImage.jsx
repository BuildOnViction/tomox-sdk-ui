import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TOMOTOKENS_URL } from '../../config/environment'
import defaultTokenImageUrl from '../../assets/images/default_token_img.svg'

class TokenImage extends React.PureComponent {
    onError = () => {
        this.setState({
            src: defaultTokenImageUrl,
        })
    }

    render() {
        const { tokenAddress, size } = this.props
        const src = `${TOMOTOKENS_URL}/${tokenAddress}.png`

        return (
            <Image 
                src={src} 
                alt="Token Icon" 
                onError={this.onError} 
                width={size} 
                height={size} />
        )
    }    
}

export default TokenImage

TokenImage.propTypes = {
    tokenAddress: PropTypes.string,
    size: PropTypes.number,
}

const Image = styled.img`
    display: inline-block;
    border-radius: 50%;
`

