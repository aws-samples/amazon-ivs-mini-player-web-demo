enum CONTROL {
	MUTE = 'mute',
	CLOSE = 'close',
	RESIZE = 'resize'
}

enum POSITION {
	TOP_LEFT = 'top-left',
	TOP_RIGHT = 'top-right',
	BOTTOM_RIGHT = 'bottom-right',
	BOTTOM_LEFT = 'bottom-left'
}

const CORNER_SPACE = 32
const DEFAULT_POSITION = 'auto'
const TRANSITION = '200ms ease-in-out'

export { CONTROL, POSITION, CORNER_SPACE, DEFAULT_POSITION, TRANSITION }
