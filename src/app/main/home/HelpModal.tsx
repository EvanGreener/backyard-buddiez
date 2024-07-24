'use client'

import Features from '@/app/Features'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { useState } from 'react'

export default function HelpModal() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <Button onClickHandler={() => setShowModal(true)}>Help</Button>
            <Modal
                showCondition={showModal}
                clickOutsideHandler={() => setShowModal(false)}
            >
                <Features />
            </Modal>
        </>
    )
}
