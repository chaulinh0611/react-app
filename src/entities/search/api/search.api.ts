import axios from 'axios';
import type { SearchResults } from './type';

export const SearchApi = {
    globalSearch: (keyword: string) => {
        return axios.get<SearchResults>('/search', { params: { keyword } });
    },
};
