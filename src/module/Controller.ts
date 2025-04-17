import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewNewAccount } from "src/view/NewAccount";
import { viewAccounts } from "src/view/Accounts";
import { viewDashboard } from "src/view/Dashboard";
import { viewAccount } from "src/view/Account";
import { ControllerUiState, Action } from "./ControllerUiState";

export class Controller {

    static async openUi() {
        let state: ControllerUiState = { action: Action.OPEN_DASHBOARD };
        do {
            switch (state.action) {

                case Action.OPEN_DASHBOARD: {
                    state = await viewDashboard({
                        default_account: ModelAccount.getById(ModelConfiguration.getDefaultAccount()),
                        transactions_total: 0,
                    });
                    break;
                }

                case Action.OPEN_ACCOUNTS: {
                    state = await viewAccounts({
                        accounts: ModelAccount.getList(),
                        default_account: ModelConfiguration.getDefaultAccount()
                    });
                    break;
                }

                case Action.OPEN_ACCOUNT: {
                    state = await viewAccount({
                        default_account: ModelConfiguration.getDefaultAccount(),
                        account: ModelAccount.getById(state.action_data as number)
                    });
                }

                case Action.CREATE_ACCOUNT: {
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

                case Action.EDIT_ACCOUNT_DEFAULT: {
                    const account_id = parseInt(state.split(`:`)[1]);
                    ModelConfiguration.setDefaultAccount(account_id);
                    state = `account:${account_id}`;
                    break;
                }

                case Action.DELETE_ACCOUNT: {
                    const account = ModelAccount.getById(parseInt(state.split(`:`)[1]));
                    if (account.id == ModelConfiguration.getDefaultAccount())
                        throw new Error(`Cannot delete default account`);
                    account.delete();
                    state = `accounts`;
                    break;
                }

            }
        } while (state.action != Action.CLOSE);
    }

}