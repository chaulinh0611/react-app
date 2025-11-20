import { createContext } from 'react'

export const SetIsEditDialogOpenContext = createContext<(open: boolean) => void>(() => {})

export const SelectedBoardContext = createContext<any>(null)
