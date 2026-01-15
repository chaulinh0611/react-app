import Sidebar from '../../../components/Sidebar'
import WorkspaceSection from './WorkspaceSection'
import { useEffect, useState } from 'react'
import { getUser } from '@/features/dashboard/model/getUser'
import { getWorkspaces } from '@/features/dashboard/model/getWorkspaces'
import { SetIsEditDialogOpenContext, SelectedBoardContext } from '@/features/dashboard/shared/context'

interface Board {
    id: string
    title: string
    description: string
}

interface Workspace {
    id: string
    title: string
    description: string
    boards?: Board[]
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedBoard, setSelectedBoard] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await getUser()
                setUser(userRes)

                const wsRes = await getWorkspaces()

                if (Array.isArray(wsRes)) {
                    setWorkspaces(wsRes)
                } else if (wsRes?.data && Array.isArray(wsRes.data)) {
                    setWorkspaces(wsRes.data)
                } else {
                    console.warn('getWorkspaces() returned unexpected:', wsRes)
                    setWorkspaces([])
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // if (loading) return <div className="p-8 text-gray-500">Loading...</div>

    return (
        <SetIsEditDialogOpenContext.Provider value={setIsEditDialogOpen}>
            <SelectedBoardContext.Provider value={{ selectedBoard, setSelectedBoard }}>
                <div className='flex min-h-screen bg-white'>
                    <Sidebar />

                    <div className='flex flex-col flex-1'>
                        <header className='h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10'>
                            <div className='flex items-center gap-4'>
                                <h1 className='text-lg font-semibold text-gray-900'>Dashboard</h1>
                            </div>
                        </header>

                        <main className='flex-1 p-8 space-y-6'>
                            <div className='flex justify-between items-start mb-8'>
                                <div>
                                    <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
                                    <p className='text-muted-foreground'>Manage your workspaces and boards</p>
                                </div>

                                <button className='bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90 flex items-center gap-2'>
                                    <span className='text-lg font-semibold'>＋</span> New Workspace
                                </button>
                            </div>

                            <div className='space-y-10'>
                                {workspaces.map((ws) => (
                                    <WorkspaceSection
                                        key={ws.id}
                                        title={ws.title}
                                        subtitle={ws.description}
                                        boards={(ws.boards ?? []).map((b) => ({
                                            name: b.title,
                                            desc: b.description || 'No description',
                                            lists: 0,
                                            members: 0
                                        }))}
                                    />
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
                {isEditDialogOpen && selectedBoard && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40'>
                        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
                            <h2 className='text-xl font-semibold mb-4'></h2>
                            <p className='text-gray-600 mb-5'>{selectedBoard.name}</p>
                            <button
                                onClick={() => setIsEditDialogOpen(false)}
                                className='bg-gray-900 text-white px-4 py-2 rounded-md'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </SelectedBoardContext.Provider>
        </SetIsEditDialogOpenContext.Provider>
    )
}
