import Image from 'next/image'
import LoadingGIF from './Loading'

interface LoadDataType {
    children: React.ReactNode
    conditionLoad: boolean
    conditionShowData?: boolean
    conditionNoResults?: boolean
}
export default function LoadData({
    children,
    conditionLoad,
    conditionShowData = true,
    conditionNoResults = false,
}: LoadDataType) {
    if (conditionLoad) {
        return <LoadingGIF />
    } else if (conditionShowData) {
        return children
    } else if (conditionNoResults) {
        return <span>No results</span>
    } else {
        return
    }
}
