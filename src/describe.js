import nlp from 'compromise'
import Recognition from './Recognition'
import Synthesis from './Synthesis'
import getAlt from './alt-gen'

import { q, h, createFloaterPositioning } from './util'

const speak = new Synthesis()

const generateAltTag = img => getAlt(img.src).then((caption) => { img.alt = caption })

async function describe(img) {
	if (!img) return
	if (img.alt) speak.say(img.alt)
	else {
		const desc = await generateAltTag(img)
		speak.say(desc)
	}
}

function describeImage(num) {
	const [img] = q(`[data-webreslink='${num}'`)
	describe(img)
}

function getClosestImage() {
	const images = q('img')
	const centerX = window.innerWidth / 2
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

function describeClosestImage() {
	const closest = getClosestImage()
	describe(closest)
}

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
	console.log(getClosestImage())
}

export default function initialiseDescription() {
	highlightImages()
	const speech = new Recognition()
	speech.addEventListener('interim', (result) => {
		const doc = nlp(result.transcript)
		if (doc.has('(tell me about|describe|explain|)') && doc.has('(image|picture)')) {
			if (doc.has('#Value')) describeImage(doc.values().text())
			else describeClosestImage()
		}
		console.log(result.transcript)
		// do some decoding on 'describe this image' or 'describe image X'
	})

	return highlightImages
}
