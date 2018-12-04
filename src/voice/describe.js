import nlp from 'compromise'
import getImageDescription from './alt-gen'
import Synthesis from '../classes/Synthesis'

import { q, h, createFloaterPositioning } from '../util'

const speak = new Synthesis()

const describe = img => getImageDescription(img.src).then(speak.say)


function describeImage(num) {
	const [img] = q(`[data-webres-link='${num}'`)
	console.log(num)
	if (img) describe(img)
}

function getClosestImage() {
	const images = q('img')
	const [inFrame] = images.filter((image) => {
		const rect = image.getBoundingClientRect()
		return (
			rect.top >= 0
			&& rect.left >= 0
			&& rect.right <= (window.innerWidth)
			&& rect.bottom <= (window.innerHeight)
		)
	}).sort((img1, img2) => {
		const rect1 = img1.getBoundingClientRect()
		const rect2 = img2.getBoundingClientRect()
		if (rect1.top > rect2.top) return 1
		if (rect1.top < rect2.top) return -1
		return 0
	})
	return inFrame
}

const describeClosestImage = () => describe(getClosestImage())

// todo: stop wasteful api calls
function highlightImages() {
	q('.webres-injected-link.blue').forEach(elem => document.body.removeChild(elem))
	q('img').forEach((img, idx) => {
		const elem = h('span', '', 'webres-injected-link blue')
		const num = idx + 1
		img.dataset.webresLink = num
		elem.appendChild(h('p', num))
		createFloaterPositioning(img, elem, true)
		document.body.appendChild(elem)
	})
}

export default function initialiseVoiceDescription(speech) {
	highlightImages()
	speech.addEventListener('result', (result) => {
		console.log(result.transcript)
		const doc = nlp(result.transcript);
		// do some decoding on 'describe this image' or 'describe image X'
		['tell me about', 'describe', 'explain'].forEach((verb) => {
			if (!result.contains(verb)) return
			console.log(doc.values().text())
			if (result.transcript.match(/[0-9]*/g)) {
				console.log('about to describe')
				describeImage(Number(doc.values(0).toNumber().out()))
			} else describeClosestImage()
		})
	})

	return highlightImages
}
