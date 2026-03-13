import { useQuery } from "@tanstack/react-query";
import { TemplateApi } from "@/entities/board/api/template.api";
import { Card, CardContent } from "@/shared/ui/card";
import { Loader2, LayoutTemplate } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TemplatePage() {
    const navigate = useNavigate();

    const { data: templatesData, isLoading, isError } = useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const res = await TemplateApi.getAllTemplates();
            return res.data; 
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-red-500">
                <p>Failed to load templates.</p>
            </div>
        );
    }

    const templates = templatesData || [];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Templates</h1>
                <p className="text-gray-500">Kickstart your next project with ready-to-use board templates.</p>
            </div>

            {templates.length === 0 ? (
                <Card className="border-none shadow-sm bg-white rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No templates available</h2>
                        <p>Templates created from boards will appear here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((template: any) => (
                        <div 
                            key={template.id} 
                            className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md"
                            onClick={() => {
                                // For now, just navigate to the template board to view it
                                // Alternatively, open a modal to create a board from it
                                navigate(`/board/${template.id}`);
                            }}
                        >
                            <div 
                                className="h-32 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                style={{ 
                                    backgroundColor: template.backgroundUrl?.startsWith('#') ? template.backgroundUrl : '#f0f0f0',
                                    backgroundImage: template.backgroundUrl && !template.backgroundUrl.startsWith('#') ? `url(${template.backgroundUrl})` : 'none'
                                }}
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {template.title}
                                </h3>
                                {template.description && (
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                        {template.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                        Template
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
