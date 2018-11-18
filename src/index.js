'use strict';

const request = require('request-promise')
const cheerio = require('cheerio')
const ytdl = require('youtube-dl')

const parseSubs = (xml) => {
  const $ = cheerio.load(xml, {decodeEntities: false, xml: true});
  var subs = [];
  $('p').each(function(i, elem) {
    var r = {
      begin: $(this).attr('begin'),
      end: $(this).attr('end'),
      text: $(this).text()
    }
    const regex = /^([\d]{2})\:([\d]{2})\:([\d.]+)$/
    const beginMatch = r.begin.match(regex),
          endMatch = r.end.match(regex)
    var start = 0,
          end = 0
    if (beginMatch[1] && beginMatch[2] && beginMatch[3] && endMatch[1] && endMatch[2] && endMatch[3]) {
      start = parseFloat(beginMatch[3]) + parseInt(beginMatch[2]) * 60 + parseInt(beginMatch[1]) * 3660
      end = parseFloat(endMatch[3]) + parseInt(endMatch[2]) * 60 + parseInt(endMatch[1]) * 3660
      if (end > start) {
        r.start = Math.round(start * 1000) / 1000
        r.dur = Math.round((end - start) * 1000) / 1000
      }
    }
    subs.push(r)
  })
  return subs
}

exports.getSubtitles = (params) => new Promise(function (resolve, reject) {
  const videoID = params.videoID || ''
  const lang = params.lang || 'en'
  if (videoID) {
    const options = ['--write-sub', '--write-auto-sub', '--sub-format=ttml', '--sub-lang=' + lang]
    ytdl.getInfo(videoID, options, function(err, info) {
      if (err) {
        reject(err)
      } else {
        var src = false
        if (info && info.requested_subtitles && info.requested_subtitles[lang]) {
          src = info.requested_subtitles[lang]
        } else if (info && info.automatic_captions && info.automatic_captions[lang] && typeof info.automatic_captions[lang] === 'object') {
          src = info.automatic_captions[lang].find( cur => cur.ext === 'ttml' )
        }
        if (src && src.url && src.ext === 'ttml') {
          request({
            url: src.url,
            headers: {
              //Host: 'www.youtube.com',
              'User-Agent': info.http_headers['User-Agent'] || 'Mozilla/5.0 (X11; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
              Accept: info.http_headers['Accept'] || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': lang,
              Connection: 'keep-alive',
              'Cache-Control': 'max-age=0'
            }
          }).then(function (xml) {
            resolve(parseSubs(xml))
          }).catch(function (reason) {
            reject(reason)
          })
        } else {
          reject(new Error (`Subs for videoID=${videoID} and lang=${lang} not found`))
        }
      }
    })
  } else {
    reject(new Error ('videoID required in params'))
  }
})
