const express = require('express');
const path = require('path');

const server = express();
server.use((req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});
[path.join(process.cwd(), 'demo'), path.join(process.cwd(), 'dist')].forEach(dir => server.use(express.static(dir)));
server.listen(8080, () => console.log('server listening on http://web.dev:8080'));
