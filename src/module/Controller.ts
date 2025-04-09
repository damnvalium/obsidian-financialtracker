import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewAccounts } from "src/view/viewAccounts";
import { viewDashboard } from "src/view/viewDashboard";

export class Controller {

    static async openUi() {
        let state = `dashboard`;
        do {
            switch (state) {
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
            }
        } while (state != `exit`);
    }

}