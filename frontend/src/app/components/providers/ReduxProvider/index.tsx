'use client'
import { store } from '@/app/stores'
import { Provider } from 'react-redux'


export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}
