import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MediaPlayer, PlayerError } from 'amazon-ivs-player'

import Placeholder from './Placeholder'
import PlayerControls from './PlayerControls'

import {
	CONTROL,
	POSITION,
	CORNER_SPACE,
	DEFAULT_POSITION,
	TRANSITION
} from './config'
import { isElementInViewport } from './utils'
import { PlayerSize, PlayerPosition } from './types'

import './MiniPlayer.css'

interface Props {
	controls?: CONTROL[]
	position?: POSITION
	height?: number
	width?: number
	transition?: boolean
	streamUrl: string | URL
}

const MiniPlayer = ({
	controls = [CONTROL.MUTE, CONTROL.CLOSE, CONTROL.RESIZE],
	position = POSITION.BOTTOM_RIGHT,
	height = 154,
	width = 274,
	transition = false,
	streamUrl
}: Props) => {
	const { IVSPlayer } = window
	const { isPlayerSupported } = IVSPlayer

	const [loading, setLoading] = useState(true)
	const [isMiniPlayer, setIsMiniPlayer] = useState(false)
	const [muted, setMuted] = useState(false)
	const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({})
	const [playerSize, setPlayerSize] = useState<PlayerSize>({})

	const visibleRef = useRef(false)
	const player = useRef<MediaPlayer | null>(null)
	const playerBaseEl = useRef<HTMLDivElement>(null)
	const videoEl = useRef<HTMLVideoElement>(null)

	const updatePlayer = useCallback(
		(isMini: boolean) => {
			let top,
				right,
				bottom,
				left = DEFAULT_POSITION
			const targetPosition = isMini ? `${CORNER_SPACE}px` : '0px'
			const targetHeight = isMini ? `${height}px` : '100%'
			const targetWidth = isMini ? `${width}px` : '100%'

			switch (position) {
				case POSITION.TOP_LEFT:
					top = left = targetPosition
					break
				case POSITION.TOP_RIGHT:
					top = right = targetPosition
					break
				case POSITION.BOTTOM_LEFT:
					bottom = left = targetPosition
					break
				case POSITION.BOTTOM_RIGHT: {
					bottom = right = targetPosition
					break
				}
				default: {
					const _exhaustiveCheck: never = position
					return _exhaustiveCheck
				}
			}

			setPlayerSize({
				height: targetHeight,
				width: targetWidth
			})
			setPlayerPosition({
				top,
				right,
				bottom,
				left
			})
		},
		[height, width, position]
	)

	useEffect(() => {
		// handle case when autoplay with sound is blocked by browser
		if (player.current) {
			setMuted(player.current.isMuted())
		}
	}, [loading])

	useEffect(() => {
		const { ENDED, PLAYING, READY } = IVSPlayer.PlayerState
		const { ERROR } = IVSPlayer.PlayerEventType

		if (!isPlayerSupported) {
			console.warn(
				'The current browser does not support the Amazon IVS player.'
			)
			return
		}

		const onStateChange = () => {
			if (player.current) {
				const playerState = player.current.getState()
				console.log(`Player State - ${playerState}`)
				setLoading(playerState !== PLAYING)
			}
		}

		const onError = (err: PlayerError) => {
			console.warn('Player Event - ERROR:', err)
		}

		player.current = IVSPlayer.create()

		player.current.attachHTMLVideoElement(videoEl.current as HTMLVideoElement)
		player.current.load(streamUrl as string)
		player.current.play()

		player.current.addEventListener(READY, onStateChange)
		player.current.addEventListener(PLAYING, onStateChange)
		player.current.addEventListener(ENDED, onStateChange)
		player.current.addEventListener(ERROR, onError)

		return () => {
			player.current?.removeEventListener(READY, onStateChange)
			player.current?.removeEventListener(PLAYING, onStateChange)
			player.current?.removeEventListener(ENDED, onStateChange)
			player.current?.removeEventListener(ERROR, onError)
		}
	}, [IVSPlayer, isPlayerSupported, streamUrl])

	useEffect(() => {
		const onVisibilityChange = () => {
			const visible = isElementInViewport(
				playerBaseEl.current as HTMLDivElement
			)

			if (visible === visibleRef.current) return

			visibleRef.current = visible

			if (visible && player.current?.isPaused()) {
				player.current.play()
			}

			if (!visible && playerBaseEl.current) {
				const playerRect = playerBaseEl.current.getBoundingClientRect()
				setPlayerSize({
					height: `${playerRect.height}px`,
					width: `${playerRect.width - CORNER_SPACE}px`
				})
			}

			setTimeout(() => {
				setIsMiniPlayer(!visible)
			}, 100)
		}

		if (!isPlayerSupported) {
			return
		}

		onVisibilityChange()
		updatePlayer(visibleRef.current)

		window.addEventListener('scroll', onVisibilityChange)
		window.addEventListener('resize', onVisibilityChange)

		return () => {
			window.removeEventListener('scroll', onVisibilityChange)
			window.removeEventListener('resize', onVisibilityChange)
		}
	}, [isPlayerSupported, updatePlayer])

	useEffect(() => {
		updatePlayer(isMiniPlayer)
	}, [isMiniPlayer, updatePlayer])

	if (!isPlayerSupported) {
		return null
	}

	const close = () => {
		if (player.current) {
			player.current.pause()
			setIsMiniPlayer(false)
		}
	}

	const resize = () => {
		if (playerBaseEl.current) {
			const { offsetLeft, offsetTop } = playerBaseEl.current
			window.scrollTo({
				top: offsetTop - 20,
				left: offsetLeft,
				behavior: 'smooth'
			})
		}
	}

	const toggleMute = () => {
		if (player.current) {
			const shouldMute = !player.current.isMuted()
			player.current.setMuted(shouldMute)
			setMuted(shouldMute)
		}
	}

	const { top, right, bottom, left } = playerPosition

	return (
		<div className="MiniPlayer" ref={playerBaseEl}>
			<div className="MiniPlayer-videoBox">
				<Placeholder loading={loading} />

				<div
					className={`MinPlayer-video${isMiniPlayer ? ' small' : ''}`}
					style={{
						top,
						right,
						bottom,
						left,
						width: `${playerSize.width}`,
						height: `${playerSize.height}`,
						transition:
							transition && isMiniPlayer
								? `height ${TRANSITION}, width ${TRANSITION}`
								: 'none'
					}}
				>
					<video ref={videoEl} playsInline>
						<track default kind="captions" srcLang="en" />
					</video>

					{isMiniPlayer && (
						<PlayerControls
							controls={controls}
							muted={muted}
							onClose={close}
							onResize={resize}
							onMute={toggleMute}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default MiniPlayer
