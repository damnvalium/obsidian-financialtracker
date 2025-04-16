import FinancialTracker from "main";
import { SuggestModal } from "obsidian";
import { ControllerUiState } from "./ControllerUiState";

class SelectionModal extends SuggestModal<{ text: string, value: ControllerUiState }> {
    private modalData: { text: string, value: any }[] = [];

    constructor(title: string, fields: { text: string, value: ControllerUiState }[]) {
        super(FinancialTracker.PLUGIN_APP);
        this.setPlaceholder(title);
        this.modalData = fields;
    }

    getSuggestions(query: string): { text: string; value: ControllerUiState; }[] | Promise<{ text: string; value: ControllerUiState; }[]> {
        // Filtering disabled
        return this.modalData;
    }

    renderSuggestion(value: { text: string; value: ControllerUiState; }, el: HTMLElement): void {
        el.createEl('div', { text: value.text });
    }

    onChooseSuggestion(item: { text: string; value: ControllerUiState; }, evt: MouseEvent | KeyboardEvent): void { }

}


/**
 * Creates a modal with a list of entries and returns the selected value.
 * @param title The title of the modal.
 * @param entries The entries to display in the modal.
 * @param onSelect The function to call when an entry is selected.
 * @param onClose The function to call when the modal is closed.
 */
export function createSelectionModal(
    title: string,
    entries: { text: string, value: ControllerUiState }[],
    onSelect: (item: any) => {},
    onClose: () => {}
): void {

    const modal = new SelectionModal(title, entries);

    let modalChooseFunction = (item: { text: string, value: ControllerUiState }) => {
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