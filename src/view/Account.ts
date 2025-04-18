import { ModelAccount } from "src/model/Account";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewAccount(placeholder: {
    account: ModelAccount,
    default_account: number
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `${placeholder.default_account == placeholder.account.id ? "⭐" : "💳"} ${placeholder.account.name}`,
            [
                {
                    text: `◼️ Liquidity: ${placeholder.account.balance.toFixed(2)}€`,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                {
                    // TODO: Add net worth calculation
                    text: `◼️ Net Worth: N/A€`,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                {
                    text: `✏️ Rename`,
                    value: {
                        action: ControllerAction.EDIT_ACCOUNT_NAME,
                        action_data: placeholder.account.id
                    },
                },
                ...Array<SelectionModalData>(
                    {
                        text: `⭐ Set as default`,
                        value: {
                            action: ControllerAction.EDIT_ACCOUNT_DEFAULT,
                            action_data: placeholder.account.id
                        },
                    },
                    {
                        text: `🗑️ Delete`,
                        value: {
                            action: ControllerAction.DELETE_ACCOUNT,
                            action_data: placeholder.account.id
                        },
                    },
                ).filter(() => placeholder.default_account != placeholder.account.id),
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    },
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNTS
                    }
                },
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE })
        );
    });
}