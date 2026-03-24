export type LabelColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';

export interface LabelItem {
    id: string;
    name: string | null;
    color: LabelColor;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateLabelPayload {
    color: LabelColor;
    name?: string;
}

export interface UpdateLabelPayload {
    color?: LabelColor;
    name?: string;
}

export const LABEL_COLOR_HEX: Record<LabelColor, string> = {
    red: '#ef4444',
    green: '#22c55e',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    purple: '#a855f7',
    orange: '#f97316',
};

export const LABEL_COLORS: LabelColor[] = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
