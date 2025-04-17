import FinancialTracker from "main";
import { SuggestModal } from "obsidian";
import { ControllerUiState } from "./ControllerUiState";

export type SelectionModalData = {
    text: string;
    value: ControllerUiState;
}

class SelectionModal extends SuggestModal<SelectionModalData> {
    private modalData: SelectionModalData[] = [];

    constructor(title: string, fields: SelectionModalData[]) {
        super(FinancialTracker.PLUGIN_APP);
        this.setPlaceholder(title);
        this.modalData = fields;
    }

    getSuggestions(query: string): SelectionModalData[] | Promise<SelectionModalData[]> {
        // Filtering disabled
        return this.modalData;
    }

    renderSuggestion(value: SelectionModalData, el: HTMLElement): void {
        el.createEl('div', { text: value.text });
    }

    onChooseSuggestion(item: SelectionModalData, evt: MouseEvent | KeyboardEvent): void { }

}


/**
 * Creates a modal with a list of entries.
 * @param title The title of the modal.
 * @param entries The entries to display in the modal.
 * @param onSelect The function to call when an entry is selected.
 * @param onClose The function to call when the modal is closed.
 */
export function createSelectionModal(
    title: string,
    entries: SelectionModalData[],
    onSelect: (item: ControllerUiState) => void,
    onClose: () => void
): void {

    const modal = new SelectionModal(title, entries);

    let modalChooseFunction = (item: SelectionModalData) => {
        modalCloseFunction = () => { };
        onSelect(item.value);
    }

    let modalCloseFunction = () => {
        onClose();
    }

    modal.onChooseSuggestion = modalChooseFunction;
    modal.onClose = modalCloseFunction;
    modal.open();

}