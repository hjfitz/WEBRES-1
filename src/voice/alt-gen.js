const base = 'https://uksouth.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en'
const key = 'e37d9dd4b20a46b5957953415cf6397d' // todo: move this to process.env

const fetchOpts = url => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key': key,
	},
	body: JSON.stringify({ url }),
})

export default async function getImageDescription(src) {
	try {
		const data = await fetch(base, fetchOpts(src)).then(r => r.json())
		const { text } = data.description.captions[0]
		console.log(text)
		return text
	} catch (err) {
		console.warn('err', err)
		return 'unable to decode image'
	}
}
