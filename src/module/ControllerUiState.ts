export class ControllerUiState {
    action: Action;
    action_data?: any;
    redirect?: Action;
    redirect_data?: any;
}

export enum Action {
    OPEN_DASHBOARD = `dashboard`,
    OPEN_ACCOUNTS = `accounts`,
    OPEN_ACCOUNT = `account`,
    OPEN_TRANSACTIONS = `transactions`,
    OPEN_PEOPLE = `people`,
    OPEN_CONSUMERS = `consumers`,
    CLOSE = `close`,
    CREATE_ACCOUNT = `new_account`,
    CREATE_TRANSACTION = `new_transaction`,
    EDIT_ACCOUNT_DEFAULT = `default_account`,
    DELETE_ACCOUNT = `delete_account`,
}