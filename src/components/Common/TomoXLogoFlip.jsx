//@flow
import React from 'react'
import styled, { keyframes } from 'styled-components'
import tomoXLogo from '../../assets/logo.png'


const TomoXLogoFlip = (props: { height: number, width: number, alt: string }) => {
    const { height, width, duration, alt } = props

    return (  
        <Coin width={width} height={height} duration={duration} >
            <Front>
                <img src={tomoXLogo} alt={alt} />
            </Front>
            <Back>
                <img src={tomoXLogo} alt={alt} />
            </Back>
        </Coin>
    )
}

const spin = keyframes`
    100% { transform: rotateY(360deg); }
`

const Coin = styled.div`
    animation: ${spin} ${props => props.duration || 3000}ms linear infinite;
    transform-style: preserve-3d;
    position: relative;
    width: ${props => props.width || '50px'};
    height: ${props => props.height || '50px'};
`

const Side = styled.div`
    backface-visibility:hidden;
    position:absolute;
    width: 100%;
    height: 100%;
    img {
        display: block;
        widht: 100%;
        height: 100%;
    }
`

const Front = styled(Side)`
    transform:rotateY(0deg);
`

const Back = styled(Side)`
    transform:rotateY(180deg);
`

export default TomoXLogoFlip
