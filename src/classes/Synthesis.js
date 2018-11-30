export default class TextToSpeech {
	constructor() {
		this.synth = window.speechSynthesis
		this.voiceList = this.synth.getVoices();
		[this.voice] = this.voiceList
	}

	/**
	 * Say a thing
	 * @param {string} text Thing to say
	 */
	say(text) {
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.voice = this.voice
		this.synth.speak(utterance)
	}
}
