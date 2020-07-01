import React, { useState } from 'react'
import styled from 'styled-components'

import { TmColors } from '../Common'

export default function Pagination({ totalItems, itemsPerPage, onChangePage }) {
    if (!totalItems) return null

    const [currentPage, setCurrentPage] = useState(1)
    const totalPage = Math.ceil(totalItems/itemsPerPage)

    function handleChangePage(direction) {
        if ((currentPage === 1 && direction === 'prev')
            || (currentPage === totalPage && direction === 'next')) return

        const newCurrentPage = direction === 'prev' ? currentPage - 1 : currentPage + 1
        setCurrentPage(newCurrentPage)
        onChangePage(newCurrentPage, itemsPerPage)
    }

    return (
        <Wrapper>
            <NavButton onClick={() => handleChangePage('prev')}><i className="fa fa-angle-left fa-2x" aria-hidden="true" /></NavButton>
            <div>{currentPage} / {totalPage}</div>
            <NavButton onClick={() => handleChangePage('next')}><i className="fa fa-angle-right fa-2x" aria-hidden="true" /></NavButton>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const NavButton = styled.div`
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
        color: ${TmColors.ORANGE};
    }
`