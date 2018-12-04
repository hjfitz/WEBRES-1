import 'tracking'
import 'tracking/build/data/face-min'
// face-api.js: no way to import models, has to make an API request
// clmtrackr: can't be used. tries to use web workers which are forbode by chrome extensions

// import * as dat from 'dat.gui'

import { h } from './util'

const history = []

function isScrolling() {
	const flat = history.map(entry => entry.y)
	const sorted = JSON.parse(JSON.stringify(flat)).sort((a, b) => {
		if (a < b) return 1
		if (a > b) return -1
		return 0
	})

	const shouldScroll = (
		// make sure that the head is ascending or descending
		JSON.stringify(flat) === JSON.stringify(sorted)
		// ensure that the first and last elements aren't the same
		// in the case that the user is sitting still
		&& flat[0] !== flat[flat.length - 1]
	)
	console.log({ flat, sorted, shouldScroll })
	// if the sizes are decreasing or increasing consistently
	// the user is attempting to scroll
	if (shouldScroll) {
		// check direction and scroll
		// ping off to aws
	}
}

function trackScroll(data) {
	if (history.length > 5) {
		history.shift()
		isScrolling()
	}
	history.push(Object.assign({ id: history.length }, data))
}

function beginDetection(video, canvas) {
	const context = canvas.getContext('2d')
	const tracker = new tracking.ObjectTracker('face')
	tracker.setInitialScale(4)
	tracker.setStepSize(2)
	tracker.setEdgesDensity(0.1)
	tracking.track('#webres-video', tracker, { camera: true })
	tracker.on('track', (event) => {
		context.clearRect(0, 0, canvas.width, canvas.height)
		if (event.data.length) trackScroll(event.data[0])
		event.data.forEach((rect) => {
			context.strokeStyle = '#00ff00'
			context.strokeRect(rect.x, rect.y, rect.width, rect.height)
			context.font = '11px Helvetica'
			context.fillStyle = '#fff'
			context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11)
			context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22)
		})
	})
}


export default function draw() {
	const overlay = h('div', '', 'webres-settings-overlay')
	overlay.innerHTML = `
		<div class="demo-frame" style='transform: translateX(10px);'>
			<div class="demo-container">
				<video id="webres-video" width="320" height="240" preload autoplay loop muted></video>
	  			<canvas id="webres-canvas" width="320" height="240"></canvas>
			</div>
		</div>`
	document.body.appendChild(overlay)
	const video = document.getElementById('webres-video')
	const canvas = document.getElementById('webres-canvas')
	navigator.getUserMedia(
		{ video: {} },
		(stream) => { video.srcObject = stream },
		err => console.error(err),
	)

	beginDetection(video, canvas)
}
