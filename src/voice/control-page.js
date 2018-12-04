import nlp from 'compromise'
import { h, q, createFloaterPositioning } from '../util'


// take selector(s) and return an Array of nodes with that selector

function highlightClickables() {
	// remove any highlights so as not to duplicate
	q('.webres-injected-link.red').forEach(elem => document.body.removeChild(elem))

	q('a').forEach((link, idx) => {
		const elem = h('span', '', 'webres-injected-link red')
		elem.appendChild(h('p', idx + 1))
		elem.dataset.linkIndex = (idx + 1)
		elem.dataset.link = link // by assigning <a> to dataset, implicitly pull out href
		elem.dataset.tagType = link.tagName.toLowerCase()
		createFloaterPositioning(link, elem)
		document.body.appendChild(elem)
	})
}

function clickLink(number) {
	const [elem] = q(`[data-link-index='${number}']`)
	if (!elem) return
	// if (elem.dataset.tagType === 'a')
	window.location = elem.dataset.link
	// else if (elem.dataset.tagType === 'button')
}

function checkClick(result) {
	// todo: make this configurable
	const verbs = ['click', 'open', 'launch', 'go to', 'goto']
	const { transcript } = result
	verbs.forEach((verb) => {
		if (!result.contains(verb)) return
		const parsed = nlp(transcript).values().toNumber().out()
		clickLink(Number(parsed.trim()))
	})
}

function checkNav(transcript) {
	if (transcript.contains('go back') || transcript.contains('go backward')) window.history.go(-1)
	else if (transcript.contains('go forward')) window.history.go(1)
}

export default function initialiseVoiceControl(speech) {
	console.log('speech initialised')
	setTimeout(highlightClickables, 100)

	speech.addEventListener('interim', (result) => {
		checkClick(result)
		checkNav(result)
	})
	return highlightClickables
}
