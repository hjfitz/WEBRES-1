// things overcome:
// window scroll position
// adding style to elements in the DOM - have to add to the DOM and then add style
// Add all methods in IIFE so as to not mess with window
// body not rendering everything and thus having to do different rounds - having to wait for render
// as well as links, need to find elements with event listeners to simulate a click
// developing with speech is difficult - google must throttle this as it doesn't always print to console
import initialiseVoiceDescription from './voice/describe'
import initialiseVoiceControl from './voice/control-page'
import Recognition from './classes/Recognition'
import { throttle } from './util'
import draw from './draw-settings'


function main() {
	draw()
	const speech = new Recognition()
	const highlightImages = initialiseVoiceDescription(speech)
	const highlightClickables = initialiseVoiceControl(speech);


	[highlightClickables, highlightImages].forEach((fn) => {
		// window.addEventListener('scroll', throttle(fn, 50))
		window.addEventListener('mouseup', fn)
	})
}

document.addEventListener('DOMContentLoaded', main)
