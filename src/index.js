// things overcome:
// window scroll position
// adding style to elements in the DOM - have to add to the DOM and then add style
// Add all methods in IIFE so as to not mess with window
// body not rendering everything and thus having to do different rounds - having to wait for render
// as well as links, need to find elements with event listeners to simulate a click
import initialiseSpeech from './speech'
import initialiseImages from './describe'
import Recognition from './Recognition'
import { throttle } from './util'

const listeners = []


function main() {
	const speech = new Recognition()
	const highlightImages = initialiseImages(speech)
	const highlightClickables = initialiseSpeech(speech);


	[highlightClickables, highlightImages].forEach((fn) => {
		window.addEventListener('scroll', throttle(fn, 50))
		window.addEventListener('mouseup', fn)
	})
}

setTimeout(main, 1)
