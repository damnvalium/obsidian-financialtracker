import FinancialTracker from "main";
import { Modal, Setting } from "obsidian";

class TextModal extends Modal {

    private input: { [key: string]: string } = {};

    constructor(
        title: string,
        fields: { key: string, name: string }[],
    ) {
        super(FinancialTracker.PLUGIN_APP);
        super.setTitle(title);

        for (const field of fields) {
            new Setting(this.contentEl)
                .setName(field.name)
                .addText((text) => {
                    text.onChange((value) => {
                        this.input[field.key] = value;
                    });
                });
        }

        new Setting(this.contentEl)
            .addButton((btn) => {
                btn.setIcon('cross');
                btn.onClick(() => {
                    this.onCancel();
                });
            })
            .addButton((btn) => {
                btn.setCta();
                btn.setIcon('checkmark');
                btn.onClick(() => {
                    this.onSubmit(this.input);
                });
            })

        this.scope.register([], 'Enter', () => {
            this.onSubmit(this.input);
        })
    }

    onSubmit: (values: { [key: string]: string }) => void;
    onCancel: () => void;

}

/**
 * Creates a modal with a list of text fiels.
 * @param title The title of the modal.
 * @param fields Fields to display in the modal.
 * @param onSubmit The function to call when the form is submitted
 * @param onCancel The function to call when the form is cancelled
 * @param onClose The function to call when the modal is closed (without submitting or cancelling)
 */
export function createTextModal(
    title: string,
    fields: { key: string, name: string }[],
    onSubmit: (values: { [key: string]: string }) => void,
    onCancel: () => void,
    onClose: () => void
): void {

    const modal = new TextModal(title, fields);

    modal.onSubmit = (values: { [key: string]: string }) => {
        modal.onClose = () => { };
        onSubmit(values);
        modal.close();
    };

    modal.onCancel = () => {
        modal.onClose = () => { };
        onCancel();
        modal.close();
    };

    modal.onClose = () => {
        onClose();
    };

    modal.open();

}