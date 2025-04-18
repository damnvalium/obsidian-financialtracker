import { ModelAccount } from "src/model/Account";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewAccounts(placeholder: {
    accounts: ModelAccount[],
    default_account: number
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(`💳 Accounts`,
            [
                ...placeholder.accounts.map<SelectionModalData>((account): SelectionModalData => (
                    {
                        text: `${account.id != placeholder.default_account ? "💳" : "⭐"} ${account.name}: ${account.balance}€`,
                        value: {
                            action: ControllerAction.OPEN_ACCOUNT,
                            action_data: account.id
                        }
                    }
                )),
                {
                    text: `➕ New account`,
                    value: {
                        action: ControllerAction.CREATE_ACCOUNT,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNTS,
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
    })
}