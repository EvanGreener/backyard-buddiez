import Image from 'next/image'
import LoadingGIF from './LoadingGIF'

interface LoadDataType {
    children: React.ReactNode
    conditionLoad: boolean
    conditionShowData?: boolean
    conditionNoResults?: boolean
    noResultsMessage?: string
}
export default function LoadData({
    children,
    conditionLoad,
    conditionShowData = true,
    conditionNoResults = false,
    noResultsMessage = 'No results',
}: LoadDataType) {
    if (conditionLoad) {
        return <LoadingGIF />
    } else if (conditionShowData) {
        return children
    } else if (conditionNoResults) {
        return <span>{noResultsMessage}</span>
    }
    return children
}
