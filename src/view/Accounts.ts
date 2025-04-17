import { ModelAccount } from "src/model/Account";
import { Action, ControllerUiState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewAccounts(placeholder: {
    accounts: ModelAccount[],
    default_account: number
}): Promise<ControllerUiState> {
    return new Promise((resolve) => {
        createSelectionModal(`💳 Accounts`,
            [
                ...placeholder.accounts.map<SelectionModalData>((account): SelectionModalData => (
                    {
                        text: `${account.id != placeholder.default_account ? "💳" : "⭐"} ${account.name}: ${account.balance}€`,
                        value: {
                            action: Action.OPEN_ACCOUNT,
                            action_data: account.id
                        }
                    }
                )),
                {
                    text: `➕ New account`,
                    value: {
                        action: Action.CREATE_ACCOUNT,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: Action.OPEN_ACCOUNTS,
                    }
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: Action.OPEN_DASHBOARD,
                    }
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: Action.CLOSE })
        );
    })
}