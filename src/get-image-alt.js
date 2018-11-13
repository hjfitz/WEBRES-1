// methods to get alt tags for images
const apiKey = '58b25aaf-63b8-4f8f-a72e-540361530012'; // yeah yeah
const baseUrl = 'https://api.deepai.org/api/densecap';


export async function getImageAlt(url) {
  const form = new FormData();
  form.append('image', url);
  const data = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Api-Key': apiKey },
    body: form,
  }).then(r => r.json());
  return data;
}

export function addImageAlts() {
  [...document.getElementsByTagName('img')].forEach((imgDOM) => {
    if (!imgDOM.alt) return;
    console.log(imgDOM);
    getImageAlt().then(console.log);
  });
}
