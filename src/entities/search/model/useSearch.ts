import { useQuery } from '@tanstack/react-query';
import { SearchApi } from '../api/search.api';
import type { SearchResults } from './type';

export const useGlobalSearch = (keyword: string) => {
    return useQuery<SearchResults>({
        queryKey: ['global-search', keyword],
        queryFn: () => SearchApi.globalSearch(keyword).then((res) => res.data),
        enabled: keyword.trim().length > 0,
        staleTime: 30000,
    });
};
