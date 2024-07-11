import { Dispatch, SetStateAction, createContext } from 'react'

interface HomeContextType {
    showNewSpeciesNotif: boolean
    setShowNewSpeciesNotif?: Dispatch<SetStateAction<boolean>>
    showDCProgressNotif: boolean
    setShowDCProgressNotif?: Dispatch<SetStateAction<boolean>>
}

export const HomeContext = createContext<HomeContextType>({
    showNewSpeciesNotif: false,
    showDCProgressNotif: false,
})
