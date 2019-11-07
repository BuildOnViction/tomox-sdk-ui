//@flow
import React from 'react'
import type { Node } from 'react'
import styled from 'styled-components'

type Props = {
  /** h indicate the important for headings, 1-h1,...,6-h6 */
  h: string,
  /** The text to be rendered in the Heading */
  children: Node
};

const H1 = styled.h1``
const H2 = styled.h2``
const H3 = styled.h3``
const H4 = styled.h4``
const H5 = styled.h5``
const H6 = styled.h6``

// default is H2 - index0, and follow by 1-H1...6-H6
const headings = [H1, H2, H3, H4, H5, H6]

// must wrap by a tag so that storybook can understand it is a react component
const Heading = ({ h, children }: Props) => {
  const HTag = headings[+h - 1] || H2 // if not found then return H2 as default
  return <HTag>{children}</HTag>
}

export default Heading
