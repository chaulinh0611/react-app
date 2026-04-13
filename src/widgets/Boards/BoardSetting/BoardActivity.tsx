import { useParams } from 'react-router-dom'
import { useGetBoardActivities } from '@/entities/board/model/useBoard'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'

export const BoardActivity = () => {
    const { boardId = '' } = useParams()
    const { data: activities = [] } = useGetBoardActivities(boardId)
    const getValue = (...values: any[]) => {
        return values.find(v => v !== undefined && v !== null) || ''
    }

    const renderActivityText = (act: any) => {
        const payload = act.payload || {}

        const cardName = getValue(
            payload.cardName,
            payload.cardTitle,
            act.card?.title,
            'a card'
        )

        const listName = getValue(
            payload.listName,
            payload.listTitle,
            act.list?.title,
            'a list'
        )

        const boardName = getValue(
            payload.title,
            payload.boardTitle,
            act.boardTitle,
            'a board'
        )

        switch (act.type) {
            case 'COMMENT_CREATED':
                return (
                    <>
                        commented <span className="text-blue-400 font-medium">{payload.content || ' '}</span> on{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>{' '}
                    </>
                )

            case 'COMMENT_UPDATED':
                return (
                    <>
                        edited <span className="text-blue-400 font-medium">{payload.content || ' '}</span> on{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'COMMENT_DELETED':
                return (
                    <>
                        deleted a comment on{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'CARD_CREATED':
                return (
                    <>
                        added card{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>{' '}
                        to <span className="text-muted-foreground">{listName}</span>
                    </>
                )

            case 'CARD_UPDATED':
                return (
                    <>
                        updated card{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'CARD_MOVED':
                return (
                    <>
                        moved card{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'CARD_ARCHIVED':
                return (
                    <>
                        archived card{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'CARD_RESTORED':
                return (
                    <>
                        restored card{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'CARD_MEMBER_ASSIGNED':
                return (
                    <>
                        assigned a member to{' '}
                        <span className="text-blue-400 font-medium">{cardName}</span>
                    </>
                )

            case 'LIST_CREATED':
                return (
                    <>
                        added list{' '}
                        <span className="text-green-400 font-medium">
                            {getValue(payload.title, payload.listTitle, 'a list')}
                        </span>
                    </>
                )

            case 'LIST_UPDATED':
                return <>updated a list</>

            case 'LIST_DELETED':
                return (
                    <>
                        deleted list{' '}
                        <span className="text-green-400 font-medium">
                            {getValue(payload.title, payload.listTitle, 'a list')}
                        </span>
                    </>
                )

            case 'LIST_MOVED':
                return <>moved a list</>

            case 'LIST_REORDERED':
                return <>reordered lists</>

            case 'LIST_DUPLICATED':
                return <>duplicated a list</>

            case 'BOARD_CREATED':
                return (
                    <>
                        created board{' '}
                        <span className="text-purple-400 font-medium">{boardName}</span>
                    </>
                )

            case 'BOARD_UPDATED':
                return (
                    <>
                        updated board{' '}
                        <span className="text-purple-400 font-medium">{boardName}</span>
                    </>
                )

            case 'BOARD_ARCHIVED':
                return <>archived this board</>

            case 'BOARD_RESTORED':
                return <>restored this board</>

            case 'BOARD_DELETED':
                return <>deleted this board</>

            case 'BOARD_OWNER_CHANGED':
                return <>changed board ownership</>

            default:
                return <>{act.message || 'did something'}</>
        }
    }

    const [tab, setTab] = useState<'activity' | 'comments'>('activity')

    const commentActivities = activities.filter((act: any) =>
        ['COMMENT_CREATED', 'COMMENT_UPDATED', 'COMMENT_DELETED'].includes(act.type)
    )

    const normalActivities = activities.filter((act: any) =>
        !['COMMENT_CREATED', 'COMMENT_UPDATED', 'COMMENT_DELETED'].includes(act.type)
    )
    useEffect(() => {
        console.log('🟢 BoardActivity MOUNT')
        return () => console.log('🔴 BoardActivity UNMOUNT')
    }, [])
    return (
        <div className="p-4 space-y-4">

            {/* TABS */}
            <div className="flex gap-2 border-b pb-2">
                <button
                    onClick={() => setTab('activity')}
                    className={`text-sm px-3 py-1 rounded-md transition ${
                        tab === 'activity'
                            ? 'bg-accent text-foreground font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Activity
                </button>

                <button
                    onClick={() => setTab('comments')}
                    className={`text-sm px-3 py-1 rounded-md transition ${
                        tab === 'comments'
                            ? 'bg-accent text-foreground font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Comments
                </button>
            </div>

            {/* EMPTY STATE */}
            {tab === 'activity' && normalActivities.length === 0 && (
                <div className="text-sm text-muted-foreground">
                    No activity yet
                </div>
            )}

            {tab === 'comments' && commentActivities.length === 0 && (
                <div className="text-sm text-muted-foreground">
                    No comments yet
                </div>
            )}

            {/* CONTENT */}
            {tab === 'activity' &&
                normalActivities.map((act: any) => (
                    <div key={act.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-accent transition">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                            {act.actor?.username?.slice(0, 2).toUpperCase() || '??'}
                        </div>

                        <div className="text-sm leading-relaxed">
                            <div>
                                <span className="font-semibold">
                                    {act.actor?.username || 'Someone'}
                                </span>{' '}
                                {renderActivityText(act)}
                            </div>

                            <div className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(act.createdAt), {
                                    addSuffix: true
                                })}
                            </div>
                        </div>
                    </div>
                ))}

            {tab === 'comments' &&
                commentActivities.map((act: any) => (
                    <div key={act.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-accent transition">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {act.actor?.username?.slice(0, 2).toUpperCase() || '??'}
                        </div>

                        <div className="text-sm leading-relaxed">
                            <div>
                                <span className="font-semibold">
                                    {act.actor?.username || 'Someone'}
                                </span>{' '}
                                {renderActivityText(act)}
                            </div>

                            <div className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(act.createdAt), {
                                    addSuffix: true
                                })}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}