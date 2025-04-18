import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewNewPerson(cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`👤 New Person`,
            [
                {
                    key: `name`,
                    name: `Name`,
                },
                {
                    key: `owe_you`,
                    name: `How much do they owe you?`,
                },
                {
                    key: `owe_them`,
                    name: `How much do you owe them?`,
                },
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}