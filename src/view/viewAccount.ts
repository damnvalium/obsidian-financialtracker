import { createSelectionModal } from "src/module/SelectionModal";

export function viewAccount(_: {
    default_account: number,
    account_id: number,
    account_name: string,
    account_balance: number
}) {
    return createSelectionModal(`${_.default_account == _.account_id ? "⭐" : "💳"} ${_.account_name}`, [
        {
            text: `◼️ Liquidity: ${_.account_balance.toFixed(2)}`,
            value: {
                action: `account`,
                data: _.account_id
            }
        },
        {
            // TODO: Add net worth calculation
            text: `◼️ Net Worth: N/A`,
            value: {
                action: `account`,
                data: _.account_id
            }
        },
        {
            text: ` `,
            value: {
                action: `account`,
                data: _.account_id
            }
        },
        ...[
            {
                text: `⭐ Set as default`,
                value: {
                    action: `default_account`,
                    data: _.account_id
                },
            },
            {
                text: `🗑️ Delete`,
                value: {
                    action: `delete_account`,
                    data: _.account_id
                },
            },
            {
                text: ` `,
                value: {
                    action: `account`,
                    data: _.account_id
                },
            }
        ].filter(() => _.default_account != _.account_id),
        {
            text: `🔙 Back`,
            value: {
                action: `accounts`
            }
        },
    ]);
}