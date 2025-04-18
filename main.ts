import initSqlJs from 'sql.js';
import { App, Plugin } from 'obsidian';
import { Model } from 'src/model/Model';
import { createSelectionModal } from 'src/module/ModalSelection';
import { Controller } from 'src/module/Controller';
import { ModelAccount } from 'src/model/Account';
import { createTextModal } from 'src/module/ModalText';
import { ControllerAction, ControllerState } from 'src/module/ControllerUiState';
import { zenParseMoney } from 'src/module/Utils';

export default class FinancialTracker extends Plugin {

	static PLUGIN_APP: App;

	async onload() {

		FinancialTracker.PLUGIN_APP = this.app;

		const SQL = await initSqlJs({
			wasmBinary: await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-financialtracker/sql-wasm.wasm")
		});

		const DB_FILE = (await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-financialtracker/database.db"));
		
		Model.setSqlite(new SQL.Database(Buffer.from(DB_FILE)));

		this.addRibbonIcon('dollar-sign', 'Financial Tracker', async () => {
			Controller.openUi();
		});

	}
}