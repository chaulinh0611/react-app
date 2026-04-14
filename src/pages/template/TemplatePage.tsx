import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, LayoutTemplate, ChevronRight, DollarSign } from 'lucide-react';
import {
  LayoutGrid,
  Briefcase,
  Palette,
  GraduationCap,
  Cog,
  Megaphone,
  Users,
  User,
  Rocket,
  BarChart3,
  Globe,
  Star
} from "lucide-react";
import { useBoardTemplateQuery, useCreateBoardFromTemplate } from '@/entities/board/model/useBoard';
import { useWorkspacesQuery } from '@/entities/workspace/model/workspace.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

// Danh sách category cố định giống Trello
const CATEGORIES = [
  { key: 'all', label: 'All Templates', icon: LayoutGrid },
  { key: 'business', label: 'Business', icon: Briefcase },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'engineering', label: 'Engineering', icon: Cog },
  { key: 'marketing', label: 'Marketing', icon: Megaphone },
  { key: 'hr', label: 'HR & Operations', icon: Users },
  { key: 'personal', label: 'Personal', icon: User },
  { key: 'productivity', label: 'Productivity', icon: Rocket },
  { key: 'project', label: 'Project Management', icon: BarChart3 },
  { key: 'remote', label: 'Remote Work', icon: Globe },
  { key: 'sales', label: 'Sales & CRM', icon: DollarSign },
];

const CATEGORY_ALIASES: Record<string, string> = {
        business: 'business',
        design: 'design',
        education: 'education',
        engineering: 'engineering',
        marketing: 'marketing',
        hr: 'hr',
        'hr & operations': 'hr',
        personal: 'personal',
        productivity: 'productivity',
        'project management': 'project',
        project: 'project',
        'remote work': 'remote',
        remote: 'remote',
        'sales & crm': 'sales',
        sales: 'sales',
};

// Màu gradient placeholder cho thumbnail
const GRADIENT_COLORS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
];

function getGradient(index: number) {
    return GRADIENT_COLORS[index % GRADIENT_COLORS.length];
}

function getCategory(template: any): string {
    const rawCategory = String(template.category || '').trim().toLowerCase();
    if (rawCategory && CATEGORY_ALIASES[rawCategory]) {
        return CATEGORY_ALIASES[rawCategory];
    }

    const title = (template.title || '').toLowerCase();
    const desc = (template.description || '').toLowerCase();
    if (title.includes('market') || desc.includes('market')) return 'marketing';
    if (title.includes('design') || desc.includes('design')) return 'design';
    if (title.includes('engineer') || title.includes('tech') || desc.includes('engineer')) return 'engineering';
    if (title.includes('hr') || title.includes('people') || desc.includes('human resource')) return 'hr';
    if (title.includes('sale') || title.includes('crm') || desc.includes('sale')) return 'sales';
    if (title.includes('project') || title.includes('plan') || desc.includes('project')) return 'project';
    if (title.includes('remote') || desc.includes('remote')) return 'remote';
    if (title.includes('personal') || desc.includes('personal')) return 'personal';
    if (title.includes('edu') || title.includes('learn') || desc.includes('learn')) return 'education';
    if (title.includes('product') || title.includes('scrum') || desc.includes('product')) return 'productivity';
    return 'business';
}

interface TemplateCardProps {
    template: any;
    index: number;
    onClick: () => void;
    compact?: boolean;
}

function TemplateCard({ template, index, onClick, compact = false }: TemplateCardProps) {
    const bg = template.backgroundPath?.startsWith('#')
        ? template.backgroundPath
        : undefined;
    const bgImage = template.backgroundPath && !template.backgroundPath.startsWith('#')
        ? `url(${template.backgroundPath})`
        : undefined;

    return (
        <div
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
            onClick={onClick}
        >
            {/* Thumbnail */}
            <div
                className="relative overflow-hidden"
                style={{ height: compact ? 80 : 120 }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                        background: bg || getGradient(index),
                        backgroundImage: bgImage,
                    }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                {/* Kanby badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded px-1.5 py-0.5">
                    <LayoutTemplate className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-semibold text-blue-600">Kanby</span>
                </div>
            </div>

            {/* Body */}
            <div className={`${compact ? 'p-3' : 'p-4'}`}>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {template.title}
                </h3>
                {!compact && (
                    <>
                        <p className="mt-1 text-xs text-gray-400">by Kanby Team</p>
                        {template.category && (
                            <p className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                {template.category}
                            </p>
                        )}
                        {template.description && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {template.description}
                            </p>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

export default function TemplatePage() {
    const navigate = useNavigate();

    const { data: templatesData, isLoading, isError } = useBoardTemplateQuery();
    const { data: workspacesData } = useWorkspacesQuery();
    const workspaces = workspacesData || [];

    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const createBoardMutation = useCreateBoardFromTemplate();
    const templates: any[] = templatesData || [];

    // Filter templates
    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            const matchSearch = !searchQuery
                || t.title?.toLowerCase().includes(searchQuery.toLowerCase())
                || t.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = activeCategory === 'all'
                || getCategory(t) === activeCategory;
            return matchSearch && matchCategory;
        });
    }, [templates, searchQuery, activeCategory]);

    // Group by category for "all" view
    const groupedTemplates = useMemo(() => {
        if (activeCategory !== 'all') return null;
        const groups: Record<string, any[]> = {};
        filteredTemplates.forEach((t, i) => {
            const cat = getCategory(t);
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({ ...t, _idx: i });
        });
        return groups;
    }, [filteredTemplates, activeCategory]);

    const handleCreateFromTemplate = async () => {
        if (!newBoardTitle.trim() || !selectedWorkspace || !selectedTemplate) return;
        createBoardMutation.mutate(
            { templateId: selectedTemplate.id, payload: { title: newBoardTitle, workspaceId: selectedWorkspace } },
            {
                onSuccess: (board) => {
                    setSelectedTemplate(null);
                    setNewBoardTitle('');
                    setSelectedWorkspace('');
                    if (board?.id) navigate(`/board/${board.id}`);
                },
            }
        );
    };

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

    const activeCategoryLabel = CATEGORIES.find(c => c.key === activeCategory)?.label || 'All Templates';

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* ── Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 py-6 px-3 gap-1 sticky top-0 h-screen overflow-y-auto">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Categories</p>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;

                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                activeCategory === cat.key
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="truncate">{cat.label}</span>
                        </button>
                    );
                })}
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 min-w-0 p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {activeCategoryLabel}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Kickstart your next project with ready-to-use board templates.
                    </p>
                </div>

                {/* Search bar */}
                <div className="relative mb-8 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                </div>

                {/* Mobile category chips */}
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;

                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    activeCategory === cat.key
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* No results */}
                {filteredTemplates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <LayoutTemplate className="w-14 h-14 mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-600">No templates found</p>
                        <p className="text-sm mt-1 max-w-full break-all px-4 text-center">
                            {searchQuery ? `No results for "${searchQuery}"` : 'Templates created from boards will appear here.'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-blue-600 text-sm hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* ── All view: grouped by category ── */}
                {activeCategory === 'all' && groupedTemplates && Object.keys(groupedTemplates).length > 0 && (
                    <div className="space-y-10">
                        {/* Featured section (first 3 templates) */}
                        {filteredTemplates.length > 0 && !searchQuery && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <h2 className="text-lg font-bold text-gray-800">Featured Templates</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredTemplates.slice(0, 3).map((template, i) => (
                                        <TemplateCard
                                            key={template.id}
                                            template={template}
                                            index={i}
                                            onClick={() => setSelectedTemplate(template)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Category groups */}
                        {Object.entries(groupedTemplates).map(([catKey, catTemplates]) => {
                            const catInfo = CATEGORIES.find(c => c.key === catKey);
                            const Icon = catInfo?.icon;
                            return (
                                <section key={catKey}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{Icon && <Icon className="w-5 h-5" />}</span>
                                            <h2 className="text-lg font-bold text-gray-800">{catInfo?.label || catKey}</h2>
                                        </div>
                                        {catTemplates.length > 4 && (
                                            <button
                                                onClick={() => setActiveCategory(catKey)}
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                See all {catTemplates.length}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {catTemplates.slice(0, 4).map((template, i) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                index={template._idx ?? i}
                                                onClick={() => setSelectedTemplate(template)}
                                                compact
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}

                {/* ── Single category view ── */}
                {activeCategory !== 'all' && filteredTemplates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredTemplates.map((template, i) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                index={i}
                                onClick={() => setSelectedTemplate(template)}
                            />
                        ))}
                    </div>
                )}

                {/* ── Search results (flat) ── */}
                {searchQuery && filteredTemplates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredTemplates.map((template, i) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                index={i}
                                onClick={() => setSelectedTemplate(template)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Create Board Dialog ── */}
            <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
                <DialogContent className="sm:max-w-md w-full">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-blue-600" />
                            Use template: {selectedTemplate?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Board Title</label>
                            <Input
                                placeholder="e.g. My New Project"
                                value={newBoardTitle}
                                onChange={(e) => setNewBoardTitle(e.target.value)}
                                maxLength={255}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Workspace</label>
                            <select
                                className="w-full max-w-full rounded-md border border-gray-200 p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedWorkspace}
                                onChange={(e) => setSelectedWorkspace(e.target.value)}
                            >
                                <option value="" disabled>Select a workspace</option>
                                {workspaces.map((ws: any) => (
                                    <option key={ws.id} value={ws.id} title={ws.title}>
                                        {ws.title.length > 40 ? ws.title.slice(0, 40) + '…' : ws.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTemplate?.description && (
                            <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 leading-relaxed">
                                {selectedTemplate.description}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                        <Button
                            onClick={handleCreateFromTemplate}
                            disabled={!newBoardTitle.trim() || !selectedWorkspace || createBoardMutation.isPending}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {createBoardMutation.isPending ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
                            ) : 'Create Board'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
