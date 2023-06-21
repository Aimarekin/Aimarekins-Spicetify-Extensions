// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { translate } from "./localizer"
import { waitForElm } from "./util"
import { SettingsSection } from "spcr-settings";
import "./format_unicorn"
import "./style.scss"


async function main() {
	while (!Spicetify?.Player || !Spicetify?.Locale || !Spicetify?.showNotification || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

}
	
export default main
