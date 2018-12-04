/** Class representing speech recognition */
export default class SpeechRecog {
	constructor() {
		// Wrapper for vendor prefixes
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		this.recognition = new window.SpeechRecognition()

		// setup speech recognition
		this.recognition.lang = 'en-US'
		this.recognition.interimResults = true
		// bind the result handler for parsing the results

		// add a handler for results
		this.recognition.addEventListener('result', this.handleResult.bind(this))

		// hack to make sure it's continuous in firefox??
		this.recognition.addEventListener('end', this.recognition.start)
		this.recognition.start()

		// set up event listeners
		// list of objects of form [{ 'eventType', callback() }]
		this.eventListeners = []
	}

	/**
   * Everytime there's a result from the speech recognition, parse it
   * Dispatch an event based with that parsed data
   * Handle any commands, if there exist any
   * @param {Object} event Event from speech recognition
   */
	handleResult({ results }) {
		console.log(arguments)
		// cast results to array
		const transcript = [...results]
		// make the transcript readable
		const parsed = transcript.map(result => result[0].transcript).join('')
		// writeme:
		// by returning indexOf + 1 in contains, we get two abilities:
		// first, if it isn't in the transcript it's 0 which is falsy
		// the position of the words can be compared (maybe a job for compromise?)
		const ret = { transcript: parsed, contains: word => parsed.indexOf(word) + 1 }
		this.dispatch('interim', ret)
		console.log('interim:', parsed)
		// if it's final, emit a custom event with the parsed transcript
		// accessible from e.transcript
		if (results[0].isFinal) {
			console.log('dispatching end result', ret)
			this.dispatch('end', ret)
		}
	}


	/**
   * Adds a listener with a type and an associated function, to run on that event
   * See this.dispatch
   * @param {String} type Type of event to listen for
   * @param {Function} cb Function to run on the event
   */
	addEventListener(type, cb) {
		const events = ['interim', 'end']
		if (events.includes(type)) {
			this.eventListeners.push({ type, cb })
		} else {
			console.warn(`error, event listener should be one of ${events.join(', ')}`)
		}
	}

	/**
   * Dispatch an 'event'. Go through the list of event listeners
   * If the type is the same as the parameter passed, invoke that callback
   * @param {string} type The type of event
   * @param {object} data Data to be passed to the callback
   */
	dispatch(type, data) {
		this.eventListeners.forEach((listener) => {
			if (listener.type === type) listener.cb(data)
		})
	}
}
