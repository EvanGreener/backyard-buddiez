'use client'

import { MainContext } from '@/contexts/MainContext'
import { useContext, useEffect } from 'react'

export default function ClientSide() {
    const { setLoadingNewPage } = useContext(MainContext)
    useEffect(() => {
        setLoadingNewPage && setLoadingNewPage(false)
    })

    return (
        <div></div>
    )
}
