export interface ChecklistItem {
    id : string;
    content : string;
    isChecked : boolean;
    position : number;
    createdAt : Date;
    updatedAt : Date;
}

export interface Checklist {
    id : string;
    title : string;
    items? : string[];
    createdAt : Date;
    updatedAt : Date;
    card : {
        id : string;
    }
}


export interface ChecklistState {
    checklists : Record<string, Checklist>;
    checklistItems : Record<string, ChecklistItem>;
    cardChecklists : Record<string, string[]>;

    isLoading : boolean;
    error : string | null;
}

export interface ChecklistAction {
    getChecklistsOnCard : (cardId : string) => Promise<void>;
    getChecklistItems : (checklistId : string) => Promise<void>;
    createChecklist : (title : string, cardId : string) => Promise<void>;
    deleteChecklist : (checklistId : string) => Promise<void>;
    addChecklistItem : (checklistId : string, content : string) => Promise<void>;
    updateChecklistItems : (itemId : string, content : string, isChecked : boolean) => Promise<void>;
    deleteChecklistItem : (itemId : string) => Promise<void>;
}