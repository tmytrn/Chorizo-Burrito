var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_KEY,
  access_token_secret: process.env.TWIT_ACCESS_SECRET
});

const cleanTweets = (tweets) => {
  let obj = {};
  obj.links = [];
  obj.pics = [];

  for (i = 0; i < tweets.length; i++) {
    if (tweets[i].entities.media) {
      let media = JSON.stringify(tweets[i].entities.media);
      let img = JSON.parse(media.substring(1, media.length - 1));
      let imgLink = img.media_url_https
      let cleanTweet = tweets[i].text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      if (cleanTweet.includes('—')) {
        cleanTweet = cleanTweet.replace('—', '');
        let element = {
          description: cleanTweet,
          link: imgLink,
        }
        obj.pics.push(element);
      }
    } else {
      if (tweets[i].entities) {
        //let url = tweets[i].entities.urls[0].url;
        let cleanText = tweets[i].text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        if (cleanText.includes('—') && !(tweets[i].entities.urls.length == 0)) {
          console.log(tweets[i].entities);
          cleanText = cleanText.replace('—', '');
          let url = tweets[i].entities.urls[0].url;
          let link = {
            url: url,
            text: cleanText
          }
          obj.links.push(link);

        }
      }
    }
  }
  return obj;
}

const params = { exclude_replies: true, count: 60 }

/* GET home page. */
router.get('/', function (req, res, next) {

  client.get('statuses/home_timeline', params, function (error, tweets, response) {
    if (!error) {
      const obj = cleanTweets(tweets);
      res.render('index', { title: 'Chorizzo', tweets: obj.links, pictures: obj.pics });

    }
    else {
      console.log(error);
    }
  });


});

module.exports = router;
