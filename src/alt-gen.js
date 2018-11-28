const base = 'https://uksouth.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en'
const key = 'e37d9dd4b20a46b5957953415cf6397d' // todo: move this to process.env

export default function requestImgData(src) {
	return fetch(base, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': key,
		},
		body: JSON.stringify({
			url: src,
		}),
	})
		.then(r => r.json())
		.then(data => data.description.captions[0].text)
		.catch((err) => {
			console.log('error!', err)
			return 'unable to decode'
		})
}
