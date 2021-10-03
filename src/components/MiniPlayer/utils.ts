import Color from '../../theme/colors'

export type RGB = [number, number, number]

export const hexToRgb = (hex: Color): RGB => {
	const hexTriplet = hex.replace(
		/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
		(_m, r, g, b) => `#${r + r + g + g + b + b}`
	)
	return [1, 3, 5].map((i) => {
		const b = hexTriplet.slice(i, i + 2)
		return parseInt(b, 16)
	}) as RGB
}

export const isElementInViewport = (el: HTMLElement, percentage = 50) => {
	const { innerHeight, innerWidth } = window // eslint-disable-line
	const { clientHeight, clientWidth } = document.documentElement // eslint-disable-line
	const rect = el.getBoundingClientRect()
	const offScreenTop = 0 - (rect.height * percentage) / 100

	return (
		rect.top >= offScreenTop &&
		rect.left >= 0 &&
		rect.bottom <= (innerHeight || clientHeight) &&
		rect.right <= (innerWidth || clientWidth)
	)
}
