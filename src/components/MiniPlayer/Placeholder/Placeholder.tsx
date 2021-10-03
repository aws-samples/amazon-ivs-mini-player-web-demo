import React, { useEffect, useState } from 'react'
import { hexToRgb, RGB } from '../utils'
import Color from '../../../theme/colors'
import './Placeholder.css'

interface Props {
	loading: boolean
}

const Placeholder = ({ loading }: Props) => {
	console.log('LOADING:', loading)
	const [gradientBg, setGradientBg] = useState('')

	const getRgba = (rgb: RGB, alpha: number) => {
		const [r, g, b] = rgb
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}

	useEffect(() => {
		const rgb = hexToRgb(Color.BG)

		setGradientBg(
			`linear-gradient(0deg, ${getRgba(rgb, 1)} 50%, ${getRgba(
				rgb,
				0.9
			)} 100%), linear-gradient(90deg, ${getRgba(rgb, 0.9)} 0%, ${getRgba(
				rgb,
				0.6
			)} 100%), linear-gradient(180deg, ${getRgba(rgb, 0.6)} 0%, ${getRgba(
				rgb,
				0.3
			)} 100%), linear-gradient(360deg, ${getRgba(rgb, 0.3)} 0%, ${getRgba(
				rgb,
				0
			)} 100%)`
		)
	}, [])

	return (
		<div className="Placeholder" style={{ background: Color.BG }}>
			<div className="Placeholder-content">
				{loading && (
					<div
						className="Placeholder-spinner"
						style={{ background: Color.SPINNER }}
					>
						<div
							className="Placeholder-gradient"
							style={{ backgroundImage: gradientBg }}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default Placeholder
