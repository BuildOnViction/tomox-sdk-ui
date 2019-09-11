import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import defaultTokenImageUrl from '../../assets/images/default_token_img.svg'

const IMAGE_URL = 'https://raw.githubusercontent.com/tomochain/tokens/master/tokens'

class TokenImage extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            src: `${IMAGE_URL}/${props.tokenAddress}.png`,
            size: props.size,
        }
    }

    onError = () => {
        this.setState({
            src: defaultTokenImageUrl,
        })
    }

    render() {
        const { src, size } = this.state

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

