export class ControllerState {
    action: ControllerAction;
    action_data?: any;
    redirect?: ControllerAction;
    redirect_data?: any;
    cancel?: ControllerAction;
    cancel_data?: any;
}

export enum ControllerAction {
    OPEN_DASHBOARD,
    OPEN_ACCOUNTS,
    OPEN_ACCOUNT,
    OPEN_TRANSACTIONS,
    OPEN_PEOPLE,
    OPEN_CONSUMERS,
    CLOSE,
    /** Support: 
     * - Redirect: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Created account})
     * - Cancel: Redirection if cancelled 
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * */
    CREATE_ACCOUNT,
    CREATE_TRANSACTION,

    /**
     * Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_DEFAULT,

    /**
     * Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_NAME,

    /**
     * Requires:
     * - Data: Account ID
     *
     * Supports:
     * - Redirect: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Account})
     */
    DELETE_ACCOUNT,
}