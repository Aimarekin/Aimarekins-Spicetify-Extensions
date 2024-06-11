export type SkipAfterButtonProps = {
	mode: "duration" | "percentage",
	value: number,
	onChangeMode?: (mode: "duration" | "percentage") => void,
	onChangeValue?: (value: number) => void,
}

export default function SkipAfterButton(props: SkipAfterButtonProps) {
	return <div className="skip-after-timestamp-marker">
	<div className="skip-after-timestamp-container">
		<button className="skip-after-timestamp-button" type="button">
		</button>
	</div>
</div>
}