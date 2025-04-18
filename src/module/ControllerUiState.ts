export class ControllerState {
    action: ControllerAction;
    action_data?: any;
    confirm_redirect?: ControllerAction;
    confirm_redirect_data?: any;
    cancel_redirect?: ControllerAction;
    cancel_redirect_data?: any;
}

export enum ControllerAction {

    /*
    * DASHBOARD
    */

    OPEN_DASHBOARD,


    /*
    * ACCOUNTS
    */

    OPEN_ACCOUNTS,
    OPEN_ACCOUNT,
    /** Support: 
     * - Confirm: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Created account})
     * - Cancel: Redirection if cancelled 
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * */
    CREATE_ACCOUNT,
    /** Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_DEFAULT,
    /** Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_NAME,
    /** Requires:
     * - Data: Account ID
     *
     * Supports:
     * - Confirm: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Account})
     */
    DELETE_ACCOUNT,


    /*
    * PEOPLE
    */

    OPEN_PEOPLE,
    OPEN_PERSON,
    /** Support:
     * - Confirm: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_PERSON|Created person})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_PEOPLE|People})
     */
    CREATE_PERSON,
    /** Requires:
     * - Data: Person ID
     */
    EDIT_PERSON_NAME,
    /** Requires:
     * - Data: Person ID
     *
     * Supports:
     * - Confirm: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_PEOPLE|People})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_PERSON|Person})
     */
    DELETE_PERSON,


    /*
    * CONSUMERS
    */

    OPEN_CONSUMERS,


    /*
    * TRANSACTIONS
    */

    OPEN_TRANSACTIONS,
    CREATE_TRANSACTION,


    /*
    * OTHERS
    */

    CLOSE,

    
}