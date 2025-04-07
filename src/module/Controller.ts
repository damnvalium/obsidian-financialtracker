import { viewDashboard } from "src/view/viewDashboard";

export class Controller {

    static async main() {
        let uistate = `dashboard`;

        do {
            switch (uistate) {
                case `dashboard`: {
                    uistate = await viewDashboard(0, 0);
                    break;
                }
                case `accounts`: {
                    uistate = await 
                }
            }
        } while (uistate != null);

    }

}