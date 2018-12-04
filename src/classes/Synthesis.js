export default class TextToSpeech {
	constructor() {
		this.synth = window.speechSynthesis
	}

	/**
	 * Say a thing
	 * @param {string} text Thing to say
	 */
	say(text) {
		const utterance = new SpeechSynthesisUtterance(text)
		console.log('saying', text)
		window.speechSynthesis.speak(utterance)
	}
}
