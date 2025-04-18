import { ModelPerson } from "src/model/Person";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal } from "src/module/ModalSelection";

export async function viewPerson(placeholder: {
    person: ModelPerson
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `👤 ${placeholder.person.name}`,
            [
                {
                    text: `◼️ ${
                        placeholder.person.balance >= 0 ? 
                        "You owe them:" : 
                        "They owe you:"
                        } ${Math.abs(placeholder.person.balance)}€`,
                    value: {
                        action: ControllerAction.OPEN_PERSON,
                        action_data: placeholder.person.id
                    }
                },
                {
                    text: `◼️ Remission: ${placeholder.person.remission}€`,
                    value: {
                        action: ControllerAction.OPEN_PERSON,
                        action_data: placeholder.person.id
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_PERSON,
                        action_data: placeholder.person.id
                    }
                },
                {
                    text: `✏️ Rename`,
                    value: {
                        action: ControllerAction.EDIT_PERSON_NAME,
                        action_data: placeholder.person.id
                    },
                },
                {
                    text: `🗑️ Delete`,
                    value: {
                        action: ControllerAction.DELETE_PERSON,
                        action_data: placeholder.person.id
                    },
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_PERSON,
                        action_data: placeholder.person.id
                    }
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.OPEN_PEOPLE
                    }
                },
            ],
            (state) => resolve(state),
            () => resolve({ action: ControllerAction.CLOSE }),
        );
    });
}
