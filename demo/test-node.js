const fetch = require('node-fetch');
const FormData = require('form-data');
// methods to get alt tags for images
const apiKey = '58b25aaf-63b8-4f8f-a72e-540361530012'; // yeah yeah
const baseUrl = 'https://api.deepai.org/api/densecap';


async function getImageAlt(url) {
  const form = new FormData();
  form.append('image', url);
  const data = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Api-Key': apiKey },
    body: form,
  }).then(r => r.json());
  console.log(data.output.captions[0].caption);
  return data;
}

getImageAlt('https://placeimg.com/640/480/animals').then(console.log);
