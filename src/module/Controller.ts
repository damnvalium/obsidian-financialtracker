import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewNewAccount } from "src/view/NewAccount";
import { viewAccounts } from "src/view/Accounts";
import { viewDashboard } from "src/view/Dashboard";
import { viewAccount } from "src/view/Account";
import { ControllerState, ControllerAction } from "./ControllerUiState";
import { zenParseFloat } from "./Utils";
import { viewEditAccountName } from "src/view/EditAccountName";
import { viewConfirm } from "src/view/Confirm";

export class Controller {

    static async openUi() {
        let state: ControllerState = { action: ControllerAction.OPEN_DASHBOARD };
        do {
            switch (state.action) {

                case ControllerAction.OPEN_DASHBOARD: {
                    state = await viewDashboard({
                        default_account: ModelAccount.getById(ModelConfiguration.getDefaultAccount()),
                        transactions_total: 0,
                    });
                    break;
                }

                case ControllerAction.OPEN_ACCOUNTS: {
                    state = await viewAccounts({
                        accounts: ModelAccount.getList(),
                        default_account: ModelConfiguration.getDefaultAccount()
                    });
                    break;
                }

                case ControllerAction.OPEN_ACCOUNT: {
                    state = await viewAccount({
                        default_account: ModelConfiguration.getDefaultAccount(),
                        account: ModelAccount.getById(state.action_data as number)
                    });
                    break;
                }

                case ControllerAction.CREATE_ACCOUNT: {
                    state = await viewNewAccount({
                        submit: (fields) => {
                            const name = fields[`name`];
                            const balance = zenParseFloat(fields[`balance`]);
                            const account = ModelAccount.create(name, balance);
                            if (state.redirect) return {
                                action: state.redirect,
                                action_data: state.redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: account.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel) return {
                                action: state.cancel,
                                action_data: state.cancel_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNTS
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_ACCOUNT_NAME: {
                    state = await viewEditAccountName({
                        account: ModelAccount.getById(state.action_data as number)
                    }, {
                        submit: (fields) => {
                            const account = ModelAccount.getById(state.action_data as number);
                            account.name = fields[`name`];
                            account.save();
                            return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        cancel: () => {
                            return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    })
                    break;
                }

                case ControllerAction.EDIT_ACCOUNT_DEFAULT: {
                    ModelConfiguration.setDefaultAccount(state.action_data as number);
                    state.action = ControllerAction.OPEN_ACCOUNT;
                    break;
                }

                case ControllerAction.DELETE_ACCOUNT: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this account? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            ModelAccount.getById(state.action_data as number).delete();
                            if (state.redirect) return {
                                action: state.redirect,
                                action_data: state.redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNTS
                            }
                        },
                        cancel: () => {
                            if (state.cancel) return {
                                action: state.cancel,
                                action_data: state.cancel_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

            }
        } while (state.action != ControllerAction.CLOSE);
    }

}