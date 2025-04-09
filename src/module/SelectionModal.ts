import FinancialTracker from "main";
import { SuggestModal } from "obsidian";

class SelectionModal extends SuggestModal<{ text: string, value: any }> {
    private modalData: { text: string, value: any }[] = [];

    constructor(title: string, fields: { text: string, value: any }[]) {
        super(FinancialTracker.PLUGIN_APP);
        this.setPlaceholder(title);
        this.modalData = fields;
    }

    getSuggestions(query: string): { text: string; value: any; }[] | Promise<{ text: string; value: any; }[]> 
    {
        // Filtering disabled
        return this.modalData;
    }

    renderSuggestion(value: { text: string; value: any; }, el: HTMLElement): void 
    {
        el.createEl('div', { text: value.text });
    }

    onChooseSuggestion(item: { text: string; value: any; }, evt: MouseEvent | KeyboardEvent): void {}
    
}


/**
 * Creates a modal with a list of entries and returns the selected value.
 * @param title The title of the modal.
 * @param entries The entries to display in the modal.
 * @returns A promise that resolves to the selected value.
 */
export async function createSelectionModal(title: string, entries: {text: string, value: any}[]): Promise<any> {
    return new Promise(async (resolve) => {
        const modal = new SelectionModal(title, entries);
        let selected = false;
        modal.onChooseSuggestion = (item) => {
            selected = true;
            resolve(item.value);
        };
        modal.onClose = () => {
            setTimeout(() => {
                if (selected) return;
                resolve(`exit`);
            }, 25);
        }
        modal.open();
    });
}