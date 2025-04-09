import FinancialTracker from "main";
import { Modal, Setting } from "obsidian";

class TextModal extends Modal {

    private input: { [key: string]: string } = {};

    constructor(
        title: string, 
        fields: { id: string, name: string }[], 
        onSubmit: (values: { [key: string]: string }) => void,
        onCancel: () => void 
    ) {
        super(FinancialTracker.PLUGIN_APP);
        super.setTitle(title);

        for (const field of fields) {
            new Setting(this.contentEl)
                .setName(field.name)
                .addText((text) => {
                    text.onChange((value) => {
                        this.input[field.id] = value;
                    });
                });
        }

        new Setting(this.contentEl)
            .addButton((btn) => {
                btn.setIcon('cross');
                btn.onClick(() => {
                    onCancel();
                    this.close();
                });
            })
            .addButton((btn) => {
                btn.setCta();
                btn.setIcon('checkmark');
                btn.onClick(() => {
                    onSubmit(this.input);
                    this.close();
                });
            })
        super.open();
    }

}

export async function createTextModal(title: string, fields: { id: string, name: string }[]): Promise<{ [key: string]: string } | null> {
    return new Promise(async (resolve) => {
        new TextModal(
            title, 
            fields,
            (values) => {
                resolve(values);
            },
            () => {
                resolve(null);
            }
        );
    });
}