import { ModelAccount } from "src/model/Account";
import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewEditAccountName(placeholder: {
    account: ModelAccount
}, cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`✏️ Renaming ${placeholder.account.name}...`,
            [
                {
                    key: `name`,
                    name: `New account's name?`,
                },
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}