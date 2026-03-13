import { useQuery } from "@tanstack/react-query"

const UNSPLASH_URL = "https://api.unsplash.com/photos?orientation=squarish&client_id=5yNaPm-G6szrYKXjXonBICxgF144drGEYBg38SvXnwE";

export const unsplashApi = {
    getImages: async () => {
        const res = await fetch(UNSPLASH_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch images");
        }

        return res.json();
    },

    getSearchImage: async (query: string, page: number) => {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=10`, {
            headers: {
                Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch images");
        }

        return res.json();
    }
};


export const useUnsplash = () => {
    return useQuery({
        queryKey: ["unsplash"],
        queryFn: unsplashApi.getImages,
    });
};

export const useQueryImage = (query: string, page: number) => {
    return useQuery({
        queryKey: ["unsplash"],
        queryFn: () => unsplashApi.getSearchImage(query, page)
    })
}