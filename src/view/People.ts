import { ModelPerson } from "src/model/Person";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewPeople(placeholder: {
    people: ModelPerson[],
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `👤 People`,
            [
                ...placeholder.people.map((person): SelectionModalData => (
                    {
                        text: `👤 ${person.name}`,
                        value: {
                            action: ControllerAction.OPEN_PERSON,
                            action_data: person.id
                        }
                    }
                )),
                {
                    text: `➕ New person`,
                    value: {
                        action: ControllerAction.CREATE_PERSON
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_PEOPLE,
                    }
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.OPEN_DASHBOARD,
                    }
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE })
        );
    });
}