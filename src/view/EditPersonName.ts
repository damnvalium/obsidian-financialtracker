import { ModelPerson } from "src/model/Person";
import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewEditPersonName(placeholder: {
    person: ModelPerson
}, cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`✏️ Renaming ${placeholder.person.name}...`,
            [
                {
                    key: `name`,
                    name: `New person's name?`,
                },
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}