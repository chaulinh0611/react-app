import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

export const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit }: Props) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        await onSubmit(name);
        setIsLoading(false);
        setName('');
        onClose(); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Create Workspace</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Workspace Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., My Awesome Project"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!name.trim() || isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};