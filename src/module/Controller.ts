import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewAccounts } from "src/view/viewAccounts";
import { viewDashboard } from "src/view/viewDashboard";

export class Controller {

    static async main() {
        let state = `dashboard`;
        do {
            switch (state) {
                case `dashboard`: {
                    state = await viewDashboard(
                            0,
                            0
                    );
                    break;
                }
                case `accounts`: {
                    state = await viewAccounts(
                        ModelAccount.getList(),
                        ModelConfiguration.getDefaultAccount()
                    );
                    break;
                }
            }
        } while (state != `exit`);
    }
    
}