// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { Translate } from "./localizer"
import "./format_unicorn"
import "./style.scss"

type Promisable<T> = T | Promise<T>

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	
	
}
	
export default main
