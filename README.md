# youtube-subs-json

> Get captions as json from youtube by youtube-dl

## Installation

* `> npm install youtube-subs-json`

## Usage

```js

const getSubtitles = require('youtube-subs-json').getSubtitles;

getSubtitles({
  videoID: 'XXXXX', // youtube video id or url
  lang: 'ru' // default: `en`
}).then(function(captions) {
  console.log(captions)
})
```

Captions will be an array of object of this format:

```js
{
  "begin": String, // 00:00:03.419
  "end": String,   // 00:00:10.320
  "start": Number, // 3.419
  "dur": Number,   // 6.901
  "text": String   // some phrase
}
```
