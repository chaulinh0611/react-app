import axios from "axios";
import type { ApiResponse } from "@/shared/models/response";

export const TemplateApi = {
    getAllTemplates: (): Promise<ApiResponse<any>> => {
        return axios.get('/boards/template');
    },
    
    createBoardFromTemplate: (templateId: string, payload: { title: string, workspaceId: string, visibility: string, backgroundUrl?: string }): Promise<ApiResponse<any>> => {
        return axios.post(`/boards/template/${templateId}`, payload);
    }
}
