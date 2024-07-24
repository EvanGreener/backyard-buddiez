import { Dispatch, SetStateAction, createContext } from 'react'

interface IMainContext {
    showNewSpeciesNotif: boolean
    setShowNewSpeciesNotif?: Dispatch<SetStateAction<boolean>>
    showDCProgressNotif: boolean
    setShowDCProgressNotif?: Dispatch<SetStateAction<boolean>>
}

export const MainContext = createContext<IMainContext>({
    showNewSpeciesNotif: false,
    showDCProgressNotif: false,
})
