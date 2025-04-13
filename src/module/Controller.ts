import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewNewAccount } from "src/view/viewNewAccount";
import { viewAccounts } from "src/view/viewAccounts";
import { viewDashboard } from "src/view/viewDashboard";
import { viewAccount } from "src/view/viewAccount";
import { ControllerUiState } from "./ControllerUiState";

export class Controller {

    static async openUi() {
        let state: ControllerUiState = {action: `dashboard`};
        do {
            switch (state.action) {

                case `dashboard`: {
                    state = await viewDashboard({
                        account_balance: 0,
                        transactions_total: 0,
                    });
                    break;
                }

                case `accounts`: {
                    state = await viewAccounts({
                        accounts: ModelAccount.getList(),
                        default_account: ModelConfiguration.getDefaultAccount()
                    });
                    break;
                }

                case `account`: {
                    const account = ModelAccount.getById(parseInt(state.split(`:`)[1]));
                    state = await viewAccount({
                        default_account: ModelConfiguration.getDefaultAccount(),
                        account_id: account.id,
                        account_name: account.name,
                        account_balance: account.balance,
                    });
                }

                case `new_account`: {
                    const input = await viewNewAccount();
                    if (input == null) {
                        state = `accounts`;
                        break;
                    }
                    if (input == `exit`) {
                        state = `exit`;
                        break;
                    }
                    ModelAccount.create(
                        input["name"],
                        parseFloat(input["balance"])
                    );
                    break;
                }

                case `default_account`: {
                    const account_id = parseInt(state.split(`:`)[1]);
                    ModelConfiguration.setDefaultAccount(account_id);
                    state = `account:${account_id}`;
                    break;
                }

                case `delete_account`: {
                    const account = ModelAccount.getById(parseInt(state.split(`:`)[1]));
                    if (account.id == ModelConfiguration.getDefaultAccount())
                        throw new Error(`Cannot delete default account`);
                    account.delete();
                    state = `accounts`;
                    break;
                }

            }
        } while (state != `exit`);
    }

}