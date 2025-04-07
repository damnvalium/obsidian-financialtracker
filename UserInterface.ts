import Fuse from "fuse.js";
import { MoneyTracker } from "./MoneyTracker";
import { Note } from "./Note";
import { Account } from "./Account";
import { ClassTag, OperationStatus, TransactionType, TTransaction, TransactionActor, UiTransactionFilter } from "./Types";
import { Person } from "./Person";
import { ConsumerWithCategory } from "./ConsumerWithCategory";
import { Consumer } from "./Consumer";
import { Transaction } from "./Transaction";

export class UserInterface {

    private istance: MoneyTracker;

    private state: string;

    constructor(istance: MoneyTracker) {
        this.istance = istance;
        this.state = "init"
    }

    async mainMenu() {
        while (true) {

            let BALANCE: number | string;
            let TRANSACTION: number;
            let STATE: string;

            BALANCE = this.istance.getAccount(this.istance.getSettings().default_account)!.getBalanceLiquid();
            TRANSACTION = 0;
            this.istance.getTransactions({
                from: Account.tag,
                interval_start: new Date(Date.now() - 7776000000) // Subtract 90 days
            }).forEach(transaction => { 
                if (!(transaction.getFrom() instanceof Account && transaction.getTo() instanceof Account)) TRANSACTION -= transaction!.getAmountValue(); 
            });
            this.istance.getTransactions({
                to: Account.tag,
                interval_start: new Date(Date.now() - 7776000000) // Subtract 90 days
            }).forEach(transaction => {
                if (!(transaction.getFrom() instanceof Account && transaction.getTo() instanceof Account)) TRANSACTION += transaction!.getAmountValue();
            });
            STATE = this.state == "update" ? "🔄" : this.state == "done" ? "✅" : this.state == "init" ? "🆕" : "❌";

            let input = await Note.suggester(
                [
                    `💳 Account: ${BALANCE}€`,
                    `🧾 Transaction: ${TRANSACTION == 0 ? `0` : TRANSACTION.toFixed(2)}€`,
                    ` `,
                    `🛒 New Expense`,
                    `🌫️ New Flow`,
                    ` `,
                    `👥 People`,
                    `🔖 Consumers`,
                    ` `,
                    `❌ Exit`
                ],
                [
                    async () => await this.accounts(),
                    async () => await this.transactions(),
                    `.3`,
                    async () => await this.newExpense(),
                    async () => await this.flows(),
                    `.7`,
                    async () => await this.people(),
                    async () => await this.consumers(),
                    `.10`,
                    `quit`
                ],
                false,
                `${STATE} MoneyTracker`
            );

            if (input instanceof Function) await input();
            if (input == "quit") break;

        }
    }

    async accounts() {
        while (true) {

            let input = await Note.suggester(
                [
                    ...this.istance.getAccounts().map(account => {
                        if (account.getId() == this.istance.getSettings().default_account) return `⭐ ${account.getName()}: ${account.getBalanceLiquid()}€`
                        else return `💳 ${account.getName()}: ${account.getBalanceLiquid()}€`
                    }
                    ),
                    `➕ New account`,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...this.istance.getAccounts().map(account => async () => await this.account(account)),
                    async () => {
                        // New account script
                        let input = await Note.prompt("💳 New account's name?", "", false);
                        if (input) this.istance.addAccount(input);
                    },
                    `.1`,
                    `back`
                ],
                false,
                "💳 Accounts"
            );

            if (input instanceof Function) await input();
            if (input == "back") break;

        }
    }

    async account(account: Account) {
        while (true) {

            let title_icon = `⭐`;
            let default_delete_text: Array<string> = [];
            let default_delete_action: Array<Function> = [];

            if (account.getId() != this.istance.getSettings().default_account) {

                title_icon = `💳`;

                default_delete_text.push("⭐ Set as default");
                default_delete_action.push(async () => {
                    // Set account as default script
                    this.istance.getSettings().default_account = account.getId();
                });

                default_delete_text.push("🗑️ Disable permanently");
                default_delete_action.push(async () => {
                    // Disable account script
                    const input = await Note.prompt(`🗑️ Type "yes" to confirm`, ``, false);
                    if (input == "yes") {
                        let status = this.istance.delAccount(account.getId());
                        if (status == OperationStatus.Success) return "back";
                        if (status == OperationStatus.ErrorBalance) await Note.message(`⚠️ Error: Account balance is not zero`);
                        if (status == OperationStatus.ErrorMainId) await Note.message(`⚠️ Error: Account is the main account, rename it instead`);
                        else await Note.message(`⚠️ Error: Unknown error`);
                    }
                });

            }

            let input = await Note.suggester(
                [
                    `◼️ Liquid Balance: ${account.getBalanceLiquid()}€`,
                    `◼️ Realistic Balance: ${account.getBalanceRealistic()}€`,
                    ` `,
                    `✏️ Edit name`,
                    ...default_delete_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    `.1`,
                    `.2`,
                    `.3`,
                    async () => {
                        // Edit account script
                        const input = await Note.prompt(`✏️ New account's name?`, ``, false);
                        if (input) account.setName(input);
                    },
                    ...default_delete_action,
                    `.4`,
                    `back`
                ],
                false,
                `${title_icon} Account: ${account.getName()}`
            );

            if (input instanceof Function) if (await input() == "back") break;
            if (input == "back") break;

        }
    }

    async consumers() {
        while (true) {

            let input = await Note.suggester(
                [
                    ...this.istance.getConsumers().map(consumer => {
                        let total: number = 0;
                        this.istance.getTransactions({
                            from: Account.tag,
                            to: consumer,
                            interval_start: new Date(Date.now() - 7776000000),
                            interval_end: new Date(Date.now())
                        }).forEach(transaction => { total += transaction.getAmountValue(); });
                        if (consumer.getId() == this.istance.getSettings().default_consumer) return `⭐ ${consumer.getName()}: ${total}€`;
                        return `🔖 ${consumer.getName()}: ${total}€`;
                    }),
                    `➕ New consumer`,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...this.istance.getConsumers().map(consumer => async () => await this.consumer(consumer)),
                    async () => {
                        // New person script
                        let input = await Note.prompt("🔖 New consumer's name?", "", false);
                        if (input) this.istance.addConsumer(input);
                    },
                    `.1`,
                    `back`
                ],
                false,
                "🔖 Consumers"
            );

            if (input instanceof Function) await input();
            if (input == "back") break;

        }
    }

    async consumer(consumer: Consumer) {
        while (true) {

            let title_icon = `⭐`;

            let cat_text: string[] = [];
            let cat_action: Function[] = [];
            consumer.getCategories().forEach(category => {
                cat_text.push(category.getCategoryName());
                cat_action.push(async () => { await this.consumerCategory(category); });
            });

            let default_delete_text: string[] = [];
            let default_delete_action: Function[] = [];
            if (consumer.getId() != this.istance.getSettings().default_consumer) {
                title_icon = `🔖`;
                default_delete_text.push("⭐ Set as default");
                default_delete_action.push(async () => {
                    // Set account as default script
                    this.istance.getSettings().default_consumer = consumer.getId();
                    this.istance.getSettings().default_consumer_category = 0;
                });
                default_delete_text.push("🗑️ Disable permanently");
                default_delete_action.push(async () => {
                    // Disable account script
                    const input = await Note.prompt(`🗑️ Type "yes" to confirm`, ``, false);
                    if (input == "yes") {
                        this.istance.delConsumer(consumer.getId());
                        return "back";
                    }
                });
            }

            let input = await Note.suggester(
                [
                    ...cat_text,
                    `➕ New category`,
                    ` `,
                    `✏️ Edit name`,
                    ...default_delete_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...cat_action,
                    async () => {
                        // New category script
                        let input = await Note.prompt("🔖 New category's name?", "", false);
                        if (input) consumer.addCategory(input);
                    },
                    `.1`,
                    async () => {
                        // Edit person script
                        const input = await Note.prompt(`✏️ New consumer's name?`, ``, false);
                        if (input) consumer.setName(input);
                    },
                    ...default_delete_action,
                    `.2`,
                    `back`
                ],
                false,
                `${title_icon} Consumer: ${consumer.getName()}`
            );

            if (input instanceof Function) if (await input() == "back") break;
            if (input == "back") break;

        }
    }

    async consumerCategory(consumer_with_category: ConsumerWithCategory) {
        while (true) {

            let title_icon = `⭐`;

            let default_delete_text: string[] = [];
            let default_delete_action: Function[] = [];
            if (
                consumer_with_category.getConsumerId() != this.istance.getSettings().default_consumer &&
                consumer_with_category.getCategoryId() != this.istance.getSettings().default_consumer_category
            ) {
                title_icon = `🔖`;
                default_delete_text.push(`⭐ Set as default`);
                default_delete_action.push(async () => {
                    // Set account as default script
                    this.istance.getSettings().default_consumer = consumer_with_category.getConsumerId();
                    this.istance.getSettings().default_consumer_category = consumer_with_category.getCategoryId();
                });
                default_delete_text.push(`🗑️ Disable permanently`);
                default_delete_action.push(async () => {
                    // Disable account script
                    const input = await Note.prompt(`🗑️ Type "yes" to confirm`, ``, false);
                    if (input == "yes") {
                        if (consumer_with_category.disableCategory()) return "back";
                    }
                })
            }

            let spent: number = 0;
            this.istance.getTransactions({
                to: consumer_with_category,
                interval_start: new Date(Date.now() - 7776000000),
                interval_end: new Date(Date.now())
            }).forEach(transaction => { spent += transaction.getAmountValue(); });

            let input = await Note.suggester(
                [
                    `◼️ Money spent : ${spent}€`,
                    ` `,
                    `✏️ Edit name`,
                    ...default_delete_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    `.1`,
                    `.2`,
                    async () => {
                        // Edit person script
                        const input = await Note.prompt(`✏️ New consumer's category name?`, ``, false);
                        if (input) consumer_with_category.setCategoryName(input);
                    },
                    ...default_delete_action,
                    `.3`,
                    `back`
                ],
                false,
                `${title_icon} Consumer: ${consumer_with_category.getConsumerName()} > ${consumer_with_category.getCategoryName()}`
            );

            if (input instanceof Function) if (await input() == "back") break;
            if (input == "back") break;

        }
    }

    async people() {
        while (true) {

            let input = await Note.suggester(
                [
                    ...this.istance.getPeople().map(person => `👤 ${person.getName()}: ${person.getBalance()}€`),
                    `➕ New person`,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...this.istance.getPeople().map(person => async () => await this.person(person)),
                    async () => {
                        // New person script
                        let input = await Note.prompt("👤 New person's name?", "", false);
                        if (input) this.istance.addPerson(input);
                    },
                    `.1`,
                    `back`
                ],
                false,
                "👥 People"
            );

            if (input instanceof Function) await input();
            if (input == "back") break;

        }
    }

    async person(person: Person) {
        while (true) {

            let input = await Note.suggester(
                [
                    `◼️ Balance: ${person.getBalance()}€`,
                    `◼️ Remissions: ${person.getRemissions()}€`,
                    ` `,
                    `✏️ Edit name`,
                    `🗑️ Disable permanently`,
                    ` `,
                    `🔙 Back`
                ],
                [
                    `.1`,
                    `.2`,
                    `.3`,
                    async () => {
                        // Edit person script
                        const input = await Note.prompt(`✏️ New person's name?`, ``, false);
                        if (input) person.setName(input);
                    },
                    async () => {
                        // Disable person script
                        const input = await Note.prompt(`🗑️ Type "yes" to confirm`, ``, false);
                        if (input == "yes") {
                            this.istance.delPerson(person.getId());
                            return "back";
                        }
                    },
                    `.4`,
                    `back`
                ],
                false,
                `👤 Person: ${person.getName()}`
            );

            if (input instanceof Function) if (await input() == "back") break;
            if (input == "back") break;

        }
    }

    async transactions(
        filter: UiTransactionFilter = { sender: undefined, reciver: undefined, type: undefined, amount_min: undefined, amount_max: undefined, now: undefined, timespan: undefined },
        search: string = ""
    ) {

        const TRANSACTIONS_PER_PAGE = 15;

        let page = 0;
        let update = true;
        let transactions: Transaction[] = [];

        while (true) {

            // Filter
            if (update) {
                transactions = this.istance.getTransactions({
                    type: filter.type,
                    from: filter.sender,
                    to: filter.reciver,
                    interval_start: filter.now && filter.timespan ? new Date(filter.now - filter.timespan) : undefined,
                    interval_end: filter.now ? new Date(filter.now) : undefined,
                    amount_min: filter.amount_min,
                    amount_max: filter.amount_max
                });
                if (search && search != "") transactions = new Fuse(transactions.map(transaction => { return { id: transaction.getId(), desc: transaction.getDescription() } }), {
                    keys: ["desc"],
                    threshold: 0.5,
                    shouldSort: true,
                    isCaseSensitive: false,
                }).search(search).map(result => this.istance.getTransaction(result.item.id)!);
                transactions.sort((a, b) => b.getDate().getTime() - a.getDate().getTime());
                update = false;
            }

            // Transaction renderer
            let ui_transactions_text: string[] = [];
            let ui_transactions_action: Function[] = [];
            transactions.forEach(transaction => {

                const [FROM, TO, TYPE, DATE, AMOUNT, DESCRIPTION] = [
                    transaction.getFrom(),
                    transaction.getTo(),
                    transaction.getAmountType(),
                    transaction.getDate(),
                    transaction.getAmountValue(),
                    transaction.getDescription()
                ];

                let transaction_type;
                if (TYPE == TransactionType.Full)
                    if (FROM instanceof Account && TO instanceof Account) transaction_type = "📤📥"; // Trasferimento
                    else if (FROM instanceof Account && (TO instanceof Consumer || TO instanceof ConsumerWithCategory)) transaction_type = "📤🛍️"; // Spesa
                    else if (FROM instanceof Account && TO === null) transaction_type = "📤📉"; // Perdita
                    else if (FROM === null && TO instanceof Account) transaction_type = "📥📈"; // Guadagno
                    else throw new Error("Invalid transaction type");
                if (TYPE == TransactionType.OnlyLiquid)
                    if (FROM instanceof Account && TO instanceof Person) transaction_type = "📤🤝"; // Prestito in uscita
                    else if (FROM instanceof Person && TO instanceof Account) transaction_type = "📥🤝"; // Prestito in ingresso
                    else throw new Error("Invalid transaction type");
                if (TYPE == TransactionType.OnlyReal)
                    if (FROM instanceof Account && TO instanceof Person) transaction_type = "📤⚖️"; // Condono in uscita
                    else if (FROM instanceof Person && TO instanceof Account) transaction_type = "📥⚖️"; // Condono in ingresso
                    else throw new Error("Invalid transaction type");

                let transaction_date = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(DATE);

                ui_transactions_text.push(`[${transaction_date}] ${transaction_type} ${DESCRIPTION} (${AMOUNT}€)`);
                ui_transactions_action.push(async () => { 
                    await this.transaction(transaction);
                    update = true;
                });

            });

            // Navigation buttons
            let ui_upnavigation_text: string[] = [];
            let ui_upnavigation_action: Function[] = [];
            let ui_dwnavigation_text: string[] = [];
            let ui_dwnavigation_action: Function[] = [];
            if (page > 0) {
                ui_upnavigation_text.push(`▲▲▲`);
                ui_upnavigation_action.push(async () => { page--; });
            }
            if (page < Math.ceil(ui_transactions_text.length / TRANSACTIONS_PER_PAGE) - 1) {
                ui_dwnavigation_text.push(`▼▼▼`);
                ui_dwnavigation_action.push(async () => { page++; });
            }

            let input = await Note.suggester(
                [
                    `🔎 Search${search != "" ? ": ".concat(search) : ""}`,
                    `🏷️ Filters${Object.keys(filter).filter(key => filter[`${key}`] !== undefined).length != 0 ? ": ".concat(Object.keys(filter).filter(key => filter[`${key}`] !== undefined).length.toString()) : ""}`,
                    ` `,
                    ...ui_upnavigation_text,
                    ...ui_transactions_text.splice(page * TRANSACTIONS_PER_PAGE, TRANSACTIONS_PER_PAGE),
                    ...ui_dwnavigation_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    async () => {
                        if (search == "") { search = await Note.prompt("🔎 Search transactions", "", false); if (!search) search = ""; update = true; }
                        else { search = ""; update = true; }
                    },
                    async () => {
                        filter = await this.transactionsFilter(filter);
                        update = true;
                    },
                    `.3`,
                    ...ui_upnavigation_action,
                    ...ui_transactions_action.splice(page * TRANSACTIONS_PER_PAGE, TRANSACTIONS_PER_PAGE),
                    ...ui_dwnavigation_action,
                    `.4`,
                    `back`
                ],
                false,
                "📝 Transactions"
            );
            if (input instanceof Function) await input();
            if (input == "back") break;
        }

    }

    async transactionsFilter(filter: UiTransactionFilter): Promise<UiTransactionFilter> {
        while (true) {
            let input = await Note.suggester(
                [
                    `📤 Sender: ${filter.sender === undefined ? "All" :
                        filter.sender === null ? "World" :
                            filter.sender == Account.tag ? "All accounts" :
                                filter.sender == Person.tag ? "All people" :
                                    filter.sender instanceof Account ? `${filter.sender.getName()} (Account)` :
                                        filter.sender instanceof Person ? `${filter.sender.getName()} (Person)` : "?"}`,
                    `📥 Reciver: ${filter.reciver === undefined ? "All" :
                        filter.reciver === null ? "World" :
                            filter.reciver == Account.tag ? "All accounts" :
                                filter.reciver == Person.tag ? "All people" :
                                    filter.reciver == Consumer.tag || filter.reciver == ConsumerWithCategory.tag ? "All consumers" :
                                        filter.reciver instanceof Account ? `${filter.reciver.getName()} (Account)` :
                                            filter.reciver instanceof Person ? `${filter.reciver.getName()} (Person)` :
                                                filter.reciver instanceof Consumer ? `${filter.reciver.getName()} (Consumer)` :
                                                    filter.reciver instanceof ConsumerWithCategory ? `${filter.reciver.getConsumerName()} (Consumer)` : "?"}`,
                    ` `,
                    `👇 Time: ${!filter.now ? "Now" :
                        new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(filter.now)}`,
                    `🕒 Wayback: ${!filter.timespan ? "All time" :
                        (filter.timespan / 86400000).toString() + " day/s before"
                    }`,
                    ` `,
                    `🗃️ Type: ${filter.type == undefined ? "All" :
                        filter.type as number == TransactionType.Full ? "Full" :
                            filter.type as number == TransactionType.OnlyLiquid ? "Only Liquid" : "Only Real"}`,
                    `💰 Amount Minimum: ${!filter.amount_min ? "None" : filter.amount_min.toString()}`,
                    `💰 Amount Maximum: ${!filter.amount_max ? "None" : filter.amount_max.toString()}`,
                    ` `,
                    `✔️ Apply`,
                    `❌ Reset`
                ],
                [
                    async () => {
                        // Sender
                        if (filter.sender !== undefined) filter.sender = undefined;
                        else while (true) {
                            let input = await Note.suggester(
                                [
                                    `💳 Accounts`,
                                    `👥 People`,
                                    `🌍 World`,
                                    ` `,
                                    `🔙 Back`

                                ],
                                [
                                    async () => {
                                        // Account selector
                                        let selection = await this.selectorAccount(true);
                                        if (selection) { filter.sender = selection; return "back"; }
                                    },
                                    async () => {
                                        // Person selector
                                        let selection = await this.selectorPerson(true);
                                        if (selection) { filter.sender = selection; return "back"; }
                                    },
                                    async () => {
                                        // World selector
                                        filter.sender = null;
                                        return "back";
                                    },
                                    `.1`,
                                    async () => `back`
                                ],
                                false,
                                "📤 Sender > Types"
                            );
                            if (input instanceof Function) if (await input() == "back") break;
                        }
                    },
                    async () => {
                        // Reciver
                        if (filter.reciver !== undefined) filter.reciver = undefined;
                        else while (true) {
                            let input = await Note.suggester(
                                [
                                    `💳 Accounts`,
                                    `👥 People`,
                                    `💵 Consumers`,
                                    `🌍 World`,
                                    ` `,
                                    `🔙 Back`

                                ],
                                [
                                    async () => {
                                        // Account selecto
                                        let selection = await this.selectorAccount(true);
                                        if (selection) { filter.reciver = selection; return "back"; }
                                    },
                                    async () => {
                                        // Person selector
                                        let selection = await this.selectorPerson(true);
                                        if (selection) { filter.reciver = selection; return "back"; }
                                    },
                                    async () => {
                                        // Consumer selector
                                        let selection = await this.selectorConsumer(true);
                                        if (selection) { filter.reciver = selection; return "back"; }
                                    },
                                    async () => {
                                        // World selector
                                        filter.reciver = null;
                                        return "back";
                                    },
                                    `.1`,
                                    async () => `back`
                                ],
                                false,
                                "📤 Reciver > Types"
                            );
                            if (input instanceof Function) if (await input() == "back") break;
                        }
                    },
                    `.1`,
                    async () => {
                        // Time
                        if (filter.now !== undefined) filter.now = undefined;
                        else {
                            let time = new Date(Date.now());
                            while (true) {
                                let input = await Note.suggester(
                                    [
                                        `+1 day`,
                                        `+1 week`,
                                        `+1 month`,
                                        `+1 year`,
                                        ` `,
                                        `-1 day`,
                                        `-1 week`,
                                        `-1 month`,
                                        `-1 year`,
                                        ` `,
                                        `✔️ Apply`,
                                        `❌ Cancel`
                                    ],
                                    [
                                        async () => { time = new Date(time.getTime() + 86400000); },
                                        async () => { time = new Date(time.getTime() + 604800000); },
                                        async () => { time = new Date(time.getTime() + 2592000000); },
                                        async () => { time = new Date(time.getTime() + 31536000000); },
                                        async () => { },
                                        async () => { time = new Date(time.getTime() - 86400000); },
                                        async () => { time = new Date(time.getTime() - 604800000); },
                                        async () => { time = new Date(time.getTime() - 2592000000); },
                                        async () => { time = new Date(time.getTime() - 31536000000); },
                                        async () => { },
                                        async () => { filter.now = time.getTime(); return "back"; },
                                        async () => { return "back"; }
                                    ],
                                    false,
                                    `👇 Now: ${time.toDateString()}`
                                );
                                if (input instanceof Function) if (await input() == "back") break;
                            }
                        }
                    },
                    async () => {
                        // Wayback
                        let number: string = "";
                        if (filter.timespan !== undefined) filter.timespan = undefined;
                        else while (true) {
                            let input = await Note.suggester(
                                [
                                    `1`,
                                    `2`,
                                    `3`,
                                    `4`,
                                    `5`,
                                    `6`,
                                    `7`,
                                    `8`,
                                    `9`,
                                    `0`,
                                    ` `,
                                    `✔️ Apply`,
                                    `❌ Cancel`
                                ],
                                [
                                    async () => { number += "1"; },
                                    async () => { number += "2"; },
                                    async () => { number += "3"; },
                                    async () => { number += "4"; },
                                    async () => { number += "5"; },
                                    async () => { number += "6"; },
                                    async () => { number += "7"; },
                                    async () => { number += "8"; },
                                    async () => { number += "9"; },
                                    async () => { number += "0"; },
                                    `.1`,
                                    async () => { filter.timespan = parseInt(number) * 86400000; return "back"; },
                                    async () => { return "back"; },
                                ],
                                false,
                                `🕒 Wayback ${number}... day/s`
                            );
                            if (input instanceof Function) if (await input() == "back") break;
                        }
                    },
                    `.2`,
                    async () => {
                        // Type
                        if (filter.type == undefined) filter.type = TransactionType.Full;
                        else if (filter.type as number == TransactionType.Full) filter.type = TransactionType.OnlyLiquid;
                        else if (filter.type as number == TransactionType.OnlyLiquid) filter.type = TransactionType.OnlyReal;
                        else if (filter.type as number == TransactionType.OnlyReal) filter.type = undefined;
                    },
                    async () => {
                        // Amount min
                        if (filter.amount_min !== undefined) filter.amount_min = undefined;
                        else {
                            let input: string | null = await Note.prompt(`💰 Insert the minimum amount`)
                            if (input) {
                                input = input.replace(',', '.');
                                filter.amount_min = parseFloat(input);
                            }
                            else await Note.message(`❌ Invalid amount`);
                        }
                    },
                    async () => {
                        // Amount max
                        if (filter.amount_max !== undefined) filter.amount_max = undefined;
                        else {
                            let input: string | null = await Note.prompt(`💰 Insert the maximum amount`)
                            if (input) {
                                input = input.replace(',', '.');
                                filter.amount_max = parseFloat(input);
                            }
                            else await Note.message(`❌ Invalid amount`);
                        }
                    },
                    `.3`,
                    filter,
                    { sender: undefined, reciver: undefined, type: undefined, amount_min: undefined, amount_max: undefined, now: undefined, timespan: undefined },
                ],
                false,
                `🏷️ Filter transactions`
            );
            if (input instanceof Function) await input();
            else if (typeof input != 'string') return input;
        }
    }

    // TODO: Improve in version 1.1
    async transaction(transaction: Transaction) {
        while (true) {
            let input = await Note.suggester(
                [
                    `🗑️ Delete transaction`,
                    ` `,
                    `🔙 Back`
                ],
                [
                    async () => { this.istance.delTransaction(transaction.getId()); return "back"; },
                    `.1`,
                    async () => { return "back"; }
                ],
                false,
                `📝 Transaction #${transaction.getId()}`
            );
            if (input instanceof Function) if (await input() == "back") break;
        }
    }

    async newExpense() {

        let account = this.istance.getAccount(this.istance.getSettings().default_account)!;
        let consumer = this.istance.getConsumer(this.istance.getSettings().default_consumer)!.getCategory(this.istance.getSettings().default_consumer_category)!;

        let amount: number | undefined;
        let date: Date | undefined;
        let descrition: string | undefined;

        let contributors: Person[] = [];
        let contributors_text: string[] = [];
        let contributors_action: Function[] = [];

        while (true) {
            let input = await Note.suggester(
                [
                    `💳 ${account.getName()}\nLiquid: ${account.getBalanceLiquid()}€ - Realistic: ${account.getBalanceRealistic()}€`,
                    ...contributors_text,
                    `➕ Add person to split with`,
                    ` `,
                    `📆 Date: ${date ? date.toLocaleDateString() : `Now`}`,
                    amount ? `💰 Amount: ${amount}` : `💰 Set amount`,
                    `🔖 Consumer: ${consumer.getConsumerName()} (${consumer.getCategoryName()})`,
                    descrition ? `📝 Description: ${descrition}` : `📝 Set description`,
                    ` `,
                    `📤 Done`,
                    `❌ Cancel`
                ],
                [
                    async () => {
                        // Change account 
                        let selection = await this.selectorAccount() as Account | undefined;
                        if (selection) account = selection;
                    },
                    ...contributors_action,
                    async () => {
                        // Add person to split with
                        let selection = await this.selectorPerson() as Person | undefined;
                        if (selection) {
                            contributors.push(selection);
                            contributors_text.push(`👤 ${selection.getName()}\nBalance: ${selection.getBalance()}€ - Remissions: ${selection.getRemissions()}€`);
                            contributors_action.push(async () => {
                                contributors.splice(contributors.length - 1, 1);
                                contributors_text.splice(contributors_text.length - 1, 1);
                                contributors_action.splice(contributors_action.length - 1, 1);
                            });
                        }
                    },
                    `.1`,
                    async () => {
                        // Set date
                        if (date !== undefined) date = undefined;
                        else {
                            let time = new Date(Date.now());
                            while (true) {
                                let input = await Note.suggester(
                                    [
                                        `+1 day`,
                                        `+1 week`,
                                        `+1 month`,
                                        `+1 year`,
                                        ` `,
                                        `-1 day`,
                                        `-1 week`,
                                        `-1 month`,
                                        `-1 year`,
                                        ` `,
                                        `✔️ Apply`,
                                        `❌ Cancel`
                                    ],
                                    [
                                        async () => { time = new Date(time.getTime() + 86400000); },
                                        async () => { time = new Date(time.getTime() + 604800000); },
                                        async () => { time = new Date(time.getTime() + 2592000000); },
                                        async () => { time = new Date(time.getTime() + 31536000000); },
                                        async () => { },
                                        async () => { time = new Date(time.getTime() - 86400000); },
                                        async () => { time = new Date(time.getTime() - 604800000); },
                                        async () => { time = new Date(time.getTime() - 2592000000); },
                                        async () => { time = new Date(time.getTime() - 31536000000); },
                                        async () => { },
                                        async () => { date = time; return "back"; },
                                        async () => { return "back"; }
                                    ],
                                    false,
                                    `👇 Now: ${time.toDateString()}`
                                );
                                if (input instanceof Function) if (await input() == "back") break;
                            }
                        }
                    },
                    async () => {
                        // Set amount
                        let input = await Note.prompt(`💰 Insert the amount`);
                        if (input) {
                            input = input.replace(',', '.');
                            amount = parseFloat(input);
                        }
                        else await Note.message(`❌ Invalid amount`)
                    },
                    async () => {
                        // Change consumer
                        let selection = await this.selectorConsumer() as ConsumerWithCategory | undefined;
                        if (selection) consumer = selection;
                    },
                    async () => {
                        // Set description
                        let input = await Note.prompt(`📝 Write a brief description of the expense`, ``, false);
                        if (!input) await Note.message("⚠️ Description can't be empty");
                        else descrition = (input as string).trim();
                    },
                    `.2`,
                    async () => {
                        // Create transaction
                        if (amount && descrition) {
                            if (contributors.length == 0) this.istance.addTransaction(account, consumer, TransactionType.Full, amount, descrition, date);
                            else {
                                this.istance.addTransaction(account, consumer, TransactionType.Full, amount / (contributors.length + 1), descrition, date);
                                contributors.forEach(contributor => {
                                    this.istance.addTransaction(account, contributor, TransactionType.OnlyLiquid, amount! / (contributors.length + 1), `Split paid: ${descrition}`!, date);
                                });
                            }
                            await this.transactions();
                            return "back";
                        }
                        else await Note.message("⚠️ You must set an amount and a description");
                    },
                    async () => "back"
                ],
                false,
                `🛒 New Expense`
            );
            if (input instanceof Function) if (await input() == "back") break;
        }
    }

    async flows() {
        while (true) {
            let input = await Note.suggester(
                [
                    `📤📥 Transfer`,
                    `📥📈 Gain`,
                    `📤📉 Loss`,
                    `📤🤝 Outgoing loan`,
                    `📥🤝 Incoming loan`,
                    `📤⚖️ Outgoing remission`,
                    `📥⚖️ Incoming remission`,
                    ` `,
                    `❌ Cancel`
                ],
                [
                    async () => { await this.customFlow("📤📥 New Transfer", TransactionActor.Account, TransactionActor.Account, TransactionType.Full); },
                    async () => { await this.customFlow("📥📈 New Gain", TransactionActor.World, TransactionActor.Account, TransactionType.Full); },
                    async () => { await this.customFlow("📤📉 New Loss", TransactionActor.Account, TransactionActor.World, TransactionType.Full); },
                    async () => { await this.customFlow("📤🤝 New Outgoing loan", TransactionActor.Account, TransactionActor.Person, TransactionType.OnlyLiquid); },
                    async () => { await this.customFlow("📥🤝 New Incoming loan", TransactionActor.Person, TransactionActor.Account, TransactionType.OnlyLiquid); },
                    async () => { await this.customFlow("📤⚖️ New Outgoing remission", TransactionActor.Account, TransactionActor.Person, TransactionType.OnlyReal); },
                    async () => { await this.customFlow("📥⚖️ New Incoming remission", TransactionActor.Person, TransactionActor.Account, TransactionType.OnlyReal); },
                    `.1`,
                    async () => { }
                ],
                false,
                `🌫️ Select a flow`
            );
            if (input instanceof Function) { await input(); break; }
        }
    }

    async customFlow(title: string, sender: TransactionActor, reciver: TransactionActor, type: TransactionType) {

        let tsender: Account | Person | ConsumerWithCategory | null | undefined;
        let treciver: Account | Person | ConsumerWithCategory | null | undefined;
        let tamount: number | undefined;
        let tdate: Date | undefined;
        let tdescription: string | undefined;

        if (sender == TransactionActor.World) tsender = null;
        if (reciver == TransactionActor.World) treciver = null;

        while (true) {

            let ui_sender_text: string[] = [];
            let ui_sender_action: Function[] = [];
            if (sender == TransactionActor.Account) {
                ui_sender_text.push(tsender ? `📤 Sender: 💳 ${(tsender as Account).getName()}\nLiquid: ${(tsender as Account).getBalanceLiquid()} - Realistic: ${(tsender as Account).getBalanceRealistic()}` : `📤 Sender: 💳 Select an account`);
                ui_sender_action.push(async () => tsender = await this.selectorAccount() as Account | undefined);
            }
            else if (sender == TransactionActor.Person) {
                ui_sender_text.push(tsender ? `📤 Sender: 👤 ${(tsender as Person).getName()}\nBalance: ${(tsender as Person).getBalance()} - Remissions: ${(tsender as Person).getRemissions()}` : `📤 Sender: 👤 Select a person`);
                ui_sender_action.push(async () => tsender = await this.selectorPerson() as Person | undefined);
            }
            else if (sender == TransactionActor.Consumer) {
                ui_sender_text.push(tsender ? `📤 Sender: 🔖 ${(tsender as ConsumerWithCategory).getConsumerName()} (${(tsender as ConsumerWithCategory).getCategoryName()})` : `📤 Sender: 🔖 Select a consumer`);
                ui_sender_action.push(async () => tsender = await this.selectorConsumer() as ConsumerWithCategory | undefined);
            }
            else if (sender == TransactionActor.World) {
                ui_sender_text.push(`📤 Sender: 🌐 World`);
                ui_sender_action.push(async () => { });
            }

            let ui_reciver_text: string[] = [];
            let ui_reciver_action: Function[] = [];
            if (reciver == TransactionActor.Account) {
                ui_reciver_text.push(treciver ? `📤 Reciver: 💳 ${(treciver as Account).getName()}\nLiquid: ${(treciver as Account).getBalanceLiquid()} - Realistic: ${(treciver as Account).getBalanceRealistic()}` : `📤 Reciver: 💳 Select an account`);
                ui_reciver_action.push(async () => treciver = await this.selectorAccount() as Account | undefined);
            }
            else if (reciver == TransactionActor.Person) {
                ui_reciver_text.push(treciver ? `📤 Reciver: 👤 ${(treciver as Person).getName()}\nBalance: ${(treciver as Person).getBalance()} - Remissions: ${(treciver as Person).getRemissions()}` : `📤 Reciver: 👤 Select a person`);
                ui_reciver_action.push(async () => treciver = await this.selectorPerson() as Person | undefined);
            }
            else if (reciver == TransactionActor.Consumer) {
                ui_reciver_text.push(treciver ? `📤 Reciver: 🔖 ${(treciver as ConsumerWithCategory).getConsumerName()} (${(treciver as ConsumerWithCategory).getCategoryName()})` : `📤 Reciver: 🔖 Select a consumer`);
                ui_reciver_action.push(async () => treciver = await this.selectorConsumer() as ConsumerWithCategory | undefined);
            }
            else if (reciver == TransactionActor.World) {
                ui_reciver_text.push(`📤 Reciver: 🌐 World`);
                ui_reciver_action.push(async () => { });
            }

            let input = await Note.suggester(
                [
                    tamount ? `💰 Amount: ${tamount}€` : `💰 Set the amount`,
                    ` `,
                    ...ui_sender_text,
                    ...ui_reciver_text,
                    ` `,
                    tdate ? `📆 Date: ${new Date(tdate).toLocaleString()}` : `📆 Date: ${new Date(Date.now()).toLocaleString()}`,
                    tdescription ? `💬 Description: ${tdescription}` : `💬 Set the description`,
                    ` `,
                    `✔️ Create`,
                    `❌ Cancel`
                ],
                [
                    async () => {
                        let input: string | null = await Note.prompt(`💰 Insert the amount`, ``, false);
                        if (input) {
                            input = input.replace(',', '.');
                            let convert = parseFloat(input);
                            if (!isNaN(convert)) tamount = convert;
                        }
                    },
                    `.1`,
                    ...ui_sender_action,
                    ...ui_reciver_action,
                    `.2`,
                    async () => {
                        if (tdate) tdate = undefined;
                        else {
                            let sdate = new Date(Date.now());
                            while (true) {
                                let input = await Note.suggester(
                                    [
                                        `+1 day`,
                                        `+1 week`,
                                        `+1 month`,
                                        `+1 year`,
                                        ` `,
                                        `-1 day`,
                                        `-1 week`,
                                        `-1 month`,
                                        `-1 year`,
                                        ` `,
                                        `✔️ Apply`,
                                        `❌ Cancel`
                                    ],
                                    [
                                        async () => { sdate = new Date(sdate.getTime() + 86400000); },
                                        async () => { sdate = new Date(sdate.getTime() + 604800000); },
                                        async () => { sdate = new Date(sdate.getTime() + 2592000000); },
                                        async () => { sdate = new Date(sdate.getTime() + 31536000000); },
                                        async () => { },
                                        async () => { sdate = new Date(sdate.getTime() - 86400000); },
                                        async () => { sdate = new Date(sdate.getTime() - 604800000); },
                                        async () => { sdate = new Date(sdate.getTime() - 2592000000); },
                                        async () => { sdate = new Date(sdate.getTime() - 31536000000); },
                                        async () => { },
                                        async () => { tdate = sdate; return "back"; },
                                        async () => { return "back"; }
                                    ],
                                    false,
                                    `📆 Date: ${sdate.toDateString()}`
                                );
                                if (input instanceof Function) if (await input() == "back") break;
                            }
                        }
                    },
                    async () => {
                        let input: string | null = await Note.prompt(`💬 Write a brief description`, ``, false);
                        if (input) tdescription = input;
                    },
                    `.3`,
                    async () => {
                        if (tsender !== undefined && treciver !== undefined && tamount !== undefined && tdescription !== undefined) {
                            this.istance.addTransaction((tsender as Account | Person | null), (treciver as Account | Person | Consumer | ConsumerWithCategory | null), type, tamount, tdescription, tdate);
                            return "back";
                        }
                        else await Note.message(`⚠️ You must fill all the fields`);
                    },
                    async () => `back`
                ],
                false,
                `${title}`
            );
            if (input instanceof Function) if (await input() == "back") break;
        }

    }

    async selectorAccount(generic_option: boolean = false): Promise<Account | ClassTag.Account | undefined> {

        let ui_gaccount_text: string[] = [];
        let ui_gaccount_action: Function[] = [];
        if (generic_option) {
            ui_gaccount_text.push(`🌐 All accounts`);
            ui_gaccount_action.push(async () => ClassTag.Account);
        }

        let ui_account_text: string[] = [];
        let ui_account_action: Function[] = [];
        this.istance.getAccounts().forEach(account => {
            ui_account_text.push(`💳 ${account.getName()}`);
            ui_account_action.push(async () => account);
        });

        while (true) {
            let input = await Note.suggester(
                [
                    ...ui_gaccount_text,
                    ...ui_account_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...ui_gaccount_action,
                    ...ui_account_action,
                    `.1`,
                    async () => undefined
                ],
                false,
                `💳 Account selector`
            );
            if (input instanceof Function) { return await input(); }
        }

    }

    async selectorPerson(generic_option: boolean = false): Promise<Person | ClassTag.Person | undefined> {

        let ui_gperson_text: string[] = [];
        let ui_gperson_action: Function[] = [];
        if (generic_option) {
            ui_gperson_text.push(`🌐 All people`);
            ui_gperson_action.push(async () => ClassTag.Person);
        }

        let ui_person_text: string[] = [];
        let ui_person_action: Function[] = [];
        this.istance.getPeople().forEach(person => {
            ui_person_text.push(`👤 ${person.getName()}`);
            ui_person_action.push(async () => person);
        });

        while (true) {
            let input = await Note.suggester(
                [
                    ...ui_gperson_text,
                    ...ui_person_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...ui_gperson_action,
                    ...ui_person_action,
                    `.1`,
                    async () => undefined
                ],
                false,
                `👤 Person selector`
            );
            if (input instanceof Function) { return await input(); }
        }

    }

    async selectorConsumer(generic_option: boolean = false): Promise<Consumer | ConsumerWithCategory | ClassTag.Consumer | undefined> {

        let ui_gconsumer_text: string[] = [];
        let ui_gconsumer_action: Function[] = [];
        if (generic_option) {
            ui_gconsumer_text.push(`🌐 All consumers`);
            ui_gconsumer_action.push(async () => ClassTag.Consumer);
        }

        let ui_consumer_text: string[] = [];
        let ui_consumer_action: Function[] = [];
        this.istance.getConsumers().forEach(consumer => {
            ui_consumer_text.push(`🔖 ${consumer.getName()}`);
            ui_consumer_action.push(async () => {

                let ui_gcategory_text: string[] = [];
                let ui_gcategory_action: Function[] = [];
                if (generic_option) {
                    ui_gcategory_text.push(`🌐 All categories`)
                    ui_gcategory_action.push(async () => consumer);
                }

                let ui_category_text: string[] = [];
                let ui_category_action: Function[] = [];
                consumer.getCategories().forEach(category => {
                    ui_category_text.push(category.getCategoryName());
                    ui_category_action.push(async () => category);
                });

                while (true) {
                    let input = await Note.suggester(
                        [
                            ...ui_gcategory_text,
                            ...ui_category_text,
                            ` `,
                            `🔙 Back`
                        ],
                        [
                            ...ui_gcategory_action,
                            ...ui_category_action,
                            `.1`,
                            async () => "keep"
                        ],
                        false,
                        `🔖 ${consumer.getName()} > Category selector`
                    );
                    if (input instanceof Function) return await input();
                }
            });

        });

        while (true) {
            let input = await Note.suggester(
                [
                    ...ui_gconsumer_text,
                    ...ui_consumer_text,
                    ` `,
                    `🔙 Back`
                ],
                [
                    ...ui_gconsumer_action,
                    ...ui_consumer_action,
                    `.1`,
                    async () => undefined,
                ],
                false,
                `🔖 Consumer selector`
            );
            if (input instanceof Function) {
                let result = await input();
                if (result != "keep") return result;
            }
        }

    }

}