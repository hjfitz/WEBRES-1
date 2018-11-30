import * as faceapi from 'face-api.js'
// import foo from 'face-'
import { h } from './util'

export default function draw() {
	console.log(faceapi.nets.mtcnn.isLoaded)
	const overlay = h('div', '', 'webres-settings-overlay')
	const video = h('video', '', 'webres-video')
	video.autoplay = true
	video.muted = true
	const canvas = h('canvas', '', 'webres-canvas-overlay')
	overlay.appendChild(video)
	overlay.appendChild(canvas)
	navigator.getUserMedia(
		{ video: {} },
		(stream) => { video.srcObject = stream },
		err => console.error(err),
	)

	const net = faceapi.tinyFaceDetector()
	console.log(net)
	document.body.appendChild(overlay)
}
