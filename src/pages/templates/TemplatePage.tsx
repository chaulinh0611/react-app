import { useQuery } from "@tanstack/react-query";
import { TemplateApi } from "@/entities/board/api/template.api";
import { Loader2, LayoutTemplate, Search, Briefcase, Paintbrush, GraduationCap, Code, Megaphone, User, Zap, Box, ClipboardList, Globe, BarChart, Headphones, Users2 } from "lucide-react";
import { useState } from "react";
import { UseTemplateDialog } from "./components/UseTemplateDialog";

const categories = [
    { id: 'all', name: 'All', icon: LayoutTemplate },
    { id: 'Project Management', name: 'Project Management', icon: ClipboardList },
    { id: 'Engineering', name: 'Engineering', icon: Code },
    { id: 'Design', name: 'Design', icon: Paintbrush },
    { id: 'Marketing', name: 'Marketing', icon: Megaphone },
    { id: 'Education', name: 'Education', icon: GraduationCap },
    { id: 'Business', name: 'Business', icon: Briefcase },
    { id: 'Personal', name: 'Personal', icon: User },
    { id: 'Productivity', name: 'Productivity', icon: Zap },
    { id: 'Product Management', name: 'Product Management', icon: Box },
    { id: 'Remote Work', name: 'Remote Work', icon: Globe },
    { id: 'Sales', name: 'Sales', icon: BarChart },
    { id: 'Support', name: 'Support', icon: Headphones },
    { id: 'Team Management', name: 'Team Management', icon: Users2 },
];

export default function TemplatePage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const { data: templatesData, isLoading } = useQuery({
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

    const templates = templatesData || [];
    
    const filteredTemplates = templates.filter((template: any) => {
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (template.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
                
                {/* Sidebar Categories */}
                <div className="w-full md:w-64 shrink-0">
                    <h2 className="text-sm font-bold text-gray-500 mb-4 px-2 tracking-wider">CATEGORIES</h2>
                    <nav className="space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedCategory === cat.id 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Templates</h1>
                            <p className="text-gray-500 text-sm">Kickstart your next project with ready-to-use board templates.</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search templates..."
                                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredTemplates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <LayoutTemplate className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg">No templates found for this search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template: any) => (
                                <div 
                                    key={template.id} 
                                    className="group flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200"
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    <div 
                                        className="h-32 w-full bg-cover bg-center"
                                        style={{ 
                                            backgroundColor: template.backgroundPath?.startsWith('#') ? template.backgroundPath : '#f0f0f0',
                                            backgroundImage: template.backgroundPath && !template.backgroundPath.startsWith('#') ? `url(${template.backgroundPath})` : 'none'
                                        }}
                                    >
                                        <div className="w-full h-full bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="mb-2">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {template.category || 'Template'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                            {template.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                                            {template.description || 'No description available for this template.'}
                                        </p>
                                        <div className="pt-4 border-t flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400">By Kanby Team</span>
                                            <button className="text-[11px] font-bold text-blue-600 hover:underline">USE TEMPLATE</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedTemplate && (
                <UseTemplateDialog 
                    template={selectedTemplate} 
                    onClose={() => setSelectedTemplate(null)} 
                />
            )}
        </div>
    );
}
