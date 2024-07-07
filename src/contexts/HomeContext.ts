import { Dispatch, SetStateAction, createContext } from 'react'

interface HomeContextType {
    showNewSpeciesNotif: boolean
    setShowNewSpeciesNotif?: Dispatch<SetStateAction<boolean>>
}

export const HomeContext = createContext<HomeContextType>({
    showNewSpeciesNotif: false,
})
