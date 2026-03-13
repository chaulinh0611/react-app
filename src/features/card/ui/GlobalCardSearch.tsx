import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useSearchStore } from '@/entities/search/model/search.store';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export const GlobalCardSearch = () => {
    const navigate = useNavigate();
    const [showResults, setShowResults] = useState(false);
    const { searchResults, isSearching, globalSearch } = useSearchStore();

    const debouncedSearch = useDebouncedCallback(async (keyword: string) => {
        if (!keyword.trim()) {
            globalSearch('');
            setShowResults(false);
            return;
        }
        await globalSearch(keyword.trim());
        setShowResults(true);
    }, 500);

    const onSearch = (keyword: string) => {
        if (!keyword.trim()) {
            globalSearch('');
            setShowResults(false);
            debouncedSearch.cancel();
            return;
        }
        debouncedSearch(keyword);
    };

    const hasResults = searchResults.cards.length > 0 || searchResults.boards.length > 0 || searchResults.workspaces.length > 0 || searchResults.members.length > 0;

    return (
        <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search everywhere..."
                className="pl-9 h-9"
                onChange={(e) => onSearch(e.target.value)}
            />
            {isSearching && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
            
            {showResults && hasResults && (
                <div className="absolute top-10 w-full max-h-[400px] overflow-y-auto bg-popover border rounded-md shadow-md z-[100] p-2 flex flex-col gap-2">
                    {/* BOARDS */}
                    {searchResults.boards.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Boards</p>
                            {searchResults.boards.map((board) => (
                                <div 
                                    key={board.id} 
                                    className="p-2 hover:bg-accent rounded-sm cursor-pointer border-b last:border-0"
                                    onClick={() => {
                                        navigate(`/board/${board.id}`);
                                        setShowResults(false);
                                    }}
                                >
                                    <p className="text-sm font-medium">{board.title}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CARDS */}
                    {searchResults.cards.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cards</p>
                            {searchResults.cards.map((card) => (
                                <div 
                                    key={card.id} 
                                    className="p-2 hover:bg-accent rounded-sm cursor-pointer border-b last:border-0"
                                    onClick={() => {
                                        const boardId = card.list?.board?.id || (card.list as any)?.boardId;
                                        if (boardId) {
                                            navigate(`/board/${boardId}`);
                                            setShowResults(false);
                                        }
                                    }}
                                >
                                    <p className="text-sm font-medium">{card.title}</p>
                                    {card.list && <p className="text-xs text-muted-foreground">in {card.list.title}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* WORKSPACES */}
                    {searchResults.workspaces.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Workspaces</p>
                            {searchResults.workspaces.map((ws) => (
                                <div 
                                    key={ws.id} 
                                    className="p-2 hover:bg-accent rounded-sm cursor-pointer border-b last:border-0"
                                    onClick={() => {
                                        navigate('/dashboard');
                                        setShowResults(false);
                                    }}
                                >
                                    <p className="text-sm font-medium">{ws.title}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* MEMBERS */}
                    {searchResults.members.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Members</p>
                            {searchResults.members.map((member) => (
                                <div 
                                    key={member.id} 
                                    className="p-2 hover:bg-accent rounded-sm flex items-center gap-2 border-b last:border-0"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                        {member.username ? member.username.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{member.fullName || member.username}</p>
                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {showResults && !isSearching && !hasResults && (
                <div className="absolute top-10 w-full bg-popover border rounded-md shadow-md z-[100] p-4 text-center">
                    <p className="text-sm text-muted-foreground">No results found.</p>
                </div>
            )}
        </div>
    );
};