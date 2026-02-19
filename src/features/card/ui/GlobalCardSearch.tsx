import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useCardStore } from '@/entities/card/model/card.store';
import type { Card } from '@/entities/card/model/card.type';

export const GlobalCardSearch = () => {
    const [searchResults, setSearchResults] = useState<Card[]>([]);
    const [showResults, setShowResults] = useState(false);
    const { globalSearch, isLoading } = useCardStore();

    const onSearch = async (keyword: string) => {
        if (!keyword.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        const data = await globalSearch(keyword);
        setSearchResults(data);
        setShowResults(true);
    };

    return (
        <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search everywhere..."
                className="pl-9 h-9"
                onChange={(e) => onSearch(e.target.value)}
            />
            {isLoading && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
            
            {showResults && searchResults.length > 0 && (
                <div className="absolute top-10 w-full bg-popover border rounded-md shadow-md z-[100] p-2">
                    {searchResults.map((card) => (
                        <div key={card.id} className="p-2 hover:bg-accent rounded-sm cursor-pointer">
                            <p className="text-sm font-medium">{card.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};