/** Class representing speech recognition */
export default class SpeechRecog {
	constructor(commands = [], lang = 'en-US') {
		// Wrapper for vendor prefixes
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		this.recognition = new window.SpeechRecognition()

		// setup speech recognition
		this.recognition.lang = lang
		this.recognition.interimResults = true
		// bind the result handler for parsing the results
		this.handleResult = this.handleResult.bind(this)

		// add a handler for results
		this.recognition.addEventListener('result', this.handleResult)
		// make sure it's continuous
		this.recognition.addEventListener('end', this.recognition.start)
		this.recognition.start()

		// setup custom commands
		this.commandList = commands

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
		// cast results to array
		const transcript = [...results]
		// make the transcript readable
		const parsed = transcript.map(result => result[0].transcript).join('')
		// writeme:
		// by returning indexOf + 1 in contains, we get two abilities:
		// first, if it isn't in the transcript it's 0 which is falsy
		// the position of the words can be compared (maybe a job for compromise?)
		const ret = { transcript: parsed, contains: word => parsed.indexOf(word) + 1 }
		if (!results[0].isFinal) this.dispatch('interim', ret)
		// if it's final, emit a custom event with the parsed transcript
		// accessible from e.transcript
		if (results[0].isFinal) {
			// check if we allow commands, and if we do - run them
			this.handleCommands(parsed)
			this.dispatch('end', ret)
		}
	}

	/**
   * If commands are allowed, go through the list of commands and run the command
   * If the parameter contains one of the triggers, run the associated function
   * @param {String} voiceCommand A string to match to a command
   */
	handleCommands(voiceCommand) {
		Object
			.keys(this.commandList)
			.filter(voiceCommand.match)
			.map(command => this.commandList[command]())
	}

	/**
   * Adds a listener with a type and an associated function, to run on that event
   * See this.dispatch
   * @param {String} type Type of event to listen for
   * @param {Function} cb Function to run on the event
   */
	addEventListener(type, cb) {
		this.eventListeners.push({ type, cb })
	}

	/**
   * Dispatch an 'event'. Go through the list of event listeners
   * If the type is the same as the parameter passed, invoke that callback
   * @param {string} type The type of event
   * @param {object} data Data to be passed to the callback
   */
	dispatch(type, data) {
		this.eventListeners
			.filter(listener => type === listener.type)
			.map(listener => listener.cb(data))
	}
}
