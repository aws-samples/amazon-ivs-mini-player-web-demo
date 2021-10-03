import React from 'react'
import { CONTROL } from '../config'
import { AspectRatio, Close, VolumeOff, VolumeUp } from '../../../assets/icons'

interface Props {
	controls?: CONTROL[]
	muted: boolean
	onClose(): void
	onMute(): void
	onResize(): void
}

const PlayerControls = (props: Props) => {
	const { controls, muted, onClose, onMute, onResize } = props

	const renderControl = (control: CONTROL, key: number) => {
		let Icon
		let callback

		switch (control) {
			case CONTROL.CLOSE:
				Icon = Close
				callback = onClose
				break
			case CONTROL.MUTE:
				Icon = muted ? VolumeOff : VolumeUp
				callback = onMute
				break
			case CONTROL.RESIZE:
				Icon = AspectRatio
				callback = onResize
				break
			default: {
				const _exhaustiveCheck: never = control
				return _exhaustiveCheck
			}
		}

		return (
			<button key={key} className="PlayerControls-button" onClick={callback}>
				<Icon />
			</button>
		)
	}

	return (
		<div className="PlayerControls">
			{controls?.map((control, i) => renderControl(control, i))}
		</div>
	)
}

export default PlayerControls
