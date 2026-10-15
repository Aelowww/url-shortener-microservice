// URL Shortener Microservice - freeCodeCamp Back End Development and APIs
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: false })); // read form posts
app.use(express.json());

// in-memory store: short_url number -> original URL
const urls = [];

app.get('/', (req, res) => {
  res.send('<h1>URL Shortener Microservice</h1>' +
    '<form action="/api/shorturl" method="POST">' +
    '<input name="url" placeholder="https://www.freecodecamp.org" required> ' +
    '<button type="submit">Shorten</button></form>');
});

app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// only accept well-formed http(s) URLs
function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// POST /api/shorturl -> { original_url, short_url } or { error: 'invalid url' }
app.post('/api/shorturl', (req, res) => {
  const original = req.body.url;
  if (!original || !isValidUrl(original)) {
    return res.json({ error: 'invalid url' });
  }

  let index = urls.indexOf(original);
  if (index === -1) {
    urls.push(original);
    index = urls.length - 1;
  }

  res.json({ original_url: original, short_url: index + 1 });
});

// GET /api/shorturl/:short -> redirect to the original URL
app.get('/api/shorturl/:short', (req, res) => {
  const original = urls[Number(req.params.short) - 1];
  if (!original) {
    return res.json({ error: 'No short URL found for the given input' });
  }
  res.redirect(original);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
