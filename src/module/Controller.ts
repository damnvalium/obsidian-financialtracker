import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewNewAccount } from "src/view/NewAccount";
import { viewAccounts } from "src/view/Accounts";
import { viewDashboard } from "src/view/Dashboard";
import { viewAccount } from "src/view/Account";
import { ControllerState, ControllerAction } from "./ControllerUiState";
import { zenParseMoney } from "./Utils";
import { viewEditAccountName } from "src/view/EditAccountName";
import { viewConfirm } from "src/view/Confirm";
import { ModelPerson } from "src/model/Person";
import { viewPeople } from "src/view/People";
import { viewNewPerson } from "src/view/NewPerson";
import { viewPerson } from "src/view/Person";
import { viewEditPersonName } from "src/view/EditPersonName";

export class Controller {

    static async openUi() {
        let state: ControllerState = { action: ControllerAction.OPEN_DASHBOARD };
        do {
            switch (state.action) {

                /* 
                * START DASHBOARD 
                */

                case ControllerAction.OPEN_DASHBOARD: {
                    state = await viewDashboard({
                        default_account: ModelAccount.getById(ModelConfiguration.getDefaultAccount()),
                        transactions_total: 0,
                    });
                    break;
                }

                /* 
                *START ACCOUNTS 
                */

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
                            const account = ModelAccount.create(
                                fields[`name`],
                                zenParseMoney(fields[`balance`])
                            );
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: account.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
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
                    });
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
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNTS
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
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

                /* 
                * START PEOPLE 
                */

                case ControllerAction.OPEN_PEOPLE: {
                    state = await viewPeople({
                        people: ModelPerson.getList(),
                    });
                    break;
                }

                case ControllerAction.OPEN_PERSON: {
                    state = await viewPerson({
                        person: ModelPerson.getById(state.action_data as number)
                    });
                    break;
                }

                case ControllerAction.CREATE_PERSON: {
                    state = await viewNewPerson({
                        submit: (fields) => {
                            const person = ModelPerson.create(
                                fields[`name`],
                                zenParseMoney(fields[`owe_them`]) - zenParseMoney(fields[`owe_you`]),
                            );
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: person.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PEOPLE
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_PERSON_NAME: {
                    state = await viewEditPersonName({
                        person: ModelPerson.getById(state.action_data as number)
                    }, {
                        submit: (fields) => {
                            const person = ModelPerson.getById(state.action_data as number);
                            person.name = fields[`name`];
                            person.save();
                            return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: state.action_data
                            }
                        },
                        cancel: () => {
                            return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.DELETE_PERSON: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this person? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            ModelPerson.getById(state.action_data as number).delete();
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PEOPLE
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PERSON,
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