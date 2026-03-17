import { CardApi } from '@/entities/card/api/card.api';
import { useUnarchiveCard } from '@/entities/card/model/useCard';
import { useListsByBoardId, useUnarchiveList } from '@/entities/list/model/useList';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useQueries } from '@tanstack/react-query';
import { Archive, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

type ArchivedList = {
    id: string;
    title: string;
    isArchived?: boolean;
};

type ArchivedCard = {
    id: string;
    title: string;
    isArchived?: boolean;
    listTitle?: string;
};

const getCardsFromResponse = (res: any) => {
    if (Array.isArray(res)) return res;

    const payload = res?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;

    return [];
};

export const ArchivedItemsSubMenu = () => {
    const { boardId = '' } = useParams();
    const [keyword, setKeyword] = useState('');

    const { data: lists = [] } = useListsByBoardId(boardId);
    const { mutate: unarchiveList, isPending: isUnarchivingList } = useUnarchiveList(boardId);
    const { mutate: unarchiveCard, isPending: isUnarchivingCard } = useUnarchiveCard();

    const cardQueries = useQueries({
        queries: lists.map((list: any) => ({
            queryKey: ['cards', list.id],
            queryFn: async () => {
                const res = await CardApi.getCardsOnList({ listId: list.id });
                const cards = getCardsFromResponse(res);

                return {
                    listId: list.id,
                    listTitle: list.title,
                    cards,
                };
            },
            enabled: !!list.id,
        })),
    });

    const archivedLists = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return lists
            .filter((list: ArchivedList) => list.isArchived)
            .filter((list: ArchivedList) =>
                !normalizedKeyword ? true : list.title.toLowerCase().includes(normalizedKeyword),
            );
    }, [lists, keyword]);

    const archivedCards = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return cardQueries.flatMap((query: any) => {
            if (!query.data) return [];

            const cards = (query.data.cards as ArchivedCard[]) || [];
            return cards
                .filter((card) => card.isArchived)
                .filter((card) =>
                    !normalizedKeyword
                        ? true
                        : card.title.toLowerCase().includes(normalizedKeyword),
                )
                .map((card) => ({
                    ...card,
                    listTitle: query.data.listTitle,
                }));
        });
    }, [cardQueries, keyword]);

    return (
        <>
            <DropdownMenuSubTrigger>
                <Archive />
                Archived Items
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="max-h-105 w-90 overflow-y-auto p-2">
                <DropdownMenuLabel className="px-2">Archived Items</DropdownMenuLabel>
                <div className="relative px-2 pb-2">
                    <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search archived items"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        className="pl-8"
                    />
                </div>

                <Tabs defaultValue="lists" className="gap-0">
                    <TabsList className="mx-2 w-full h-8">
                        <TabsTrigger value="lists">Lists</TabsTrigger>
                        <TabsTrigger value="cards">Cards</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lists" className="mt-2">
                        <DropdownMenuGroup>
                            {archivedLists.length === 0 ? (
                                <DropdownMenuItem disabled>No archived lists</DropdownMenuItem>
                            ) : (
                                archivedLists.map((list: ArchivedList) => (
                                    <DropdownMenuItem
                                        key={list.id}
                                        className="justify-between"
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            unarchiveList(list.id);
                                        }}
                                        disabled={isUnarchivingList}
                                    >
                                        <span className="max-w-55 truncate">{list.title}</span>
                                        <span className="text-muted-foreground text-xs">
                                            Unarchive
                                        </span>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuGroup>
                    </TabsContent>

                    <TabsContent value="cards" className="mt-2">
                        <DropdownMenuGroup>
                            {archivedCards.length === 0 ? (
                                <DropdownMenuItem disabled>No archived cards</DropdownMenuItem>
                            ) : (
                                archivedCards.map((card: ArchivedCard) => (
                                    <DropdownMenuItem
                                        key={card.id}
                                        className="justify-between"
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            unarchiveCard(card.id);
                                        }}
                                        disabled={isUnarchivingCard}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="max-w-55 truncate">{card.title}</p>
                                            <p className="text-muted-foreground max-w-55 truncate text-xs">
                                                {card.listTitle}
                                            </p>
                                        </div>
                                        <span className="text-muted-foreground text-xs">
                                            Unarchive
                                        </span>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuGroup>
                    </TabsContent>
                </Tabs>

                <DropdownMenuSeparator className="mt-2" />
            </DropdownMenuSubContent>
        </>
    );
};
