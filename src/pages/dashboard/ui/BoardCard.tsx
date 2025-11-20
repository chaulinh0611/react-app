import { SelectedBoardContext, SetIsEditDialogOpenContext } from '@/features/dashboard/shared/context'
import { useContext } from 'react'
interface Props {
    board: {
        name: string
        desc: string
        lists: number
        members: number
    }
}

export default function BoardCard({ board }: Props) {
    const setIsEditDialogOpen = useContext(SetIsEditDialogOpenContext)
    const { setSelectedBoard } = useContext(SelectedBoardContext)

    const handleClick = () => {
        setSelectedBoard(board)
        setIsEditDialogOpen(true)
    }
    return (
        <div
            onClick={handleClick}
            className='border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between'
        >
            <div>
                <h3 className='font-medium'>{board.name}</h3>
                <p className='text-gray-500 text-sm'>{board.desc}</p>
            </div>

            <div className='flex justify-between items-center text-xs text-gray-400 mt-4'>
                <div>{board.lists} lists</div>
                <div className='flex items-center gap-1'>
                    <span>👥</span> {board.members}
                </div>
            </div>
        </div>
    )
}
