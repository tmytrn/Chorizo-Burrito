var express = require('express');
var router = express.Router();
let Twitter = require('twitter');
var request = require('request-promise');
const redis = require('redis');

require('dotenv').config();

const REDIS_PORT = process.env.REDIS_URL || 6379;

const cachePort = redis.createClient(REDIS_PORT);

var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_KEY,
  access_token_secret: process.env.TWIT_ACCESS_SECRET
});

let links, pics;

async function getTweets(req, res, next){
  try{
    console.log('Fetching Data...');

    const params = { exclude_replies: true, count: 200 }
    const response = await client.get('statuses/home_timeline', params);
    // const data = await response.json();
    tweets = cleanTweets(response);

    cachePort.setex('home', 3600, JSON.stringify(tweets));

    links = tweets.links;
    pics = tweets.pics;
    res.render('index', { title: 'Chorizo Burrito', tweets: links, pictures: pics });
  }
  catch(e){
    console.log(e);
  }

}

function cache(req, res, next) {
  cachePort.get('home', (err, data) => {
    if (err) throw err;

    if (data !== null) {
      data = JSON.parse(data);
      console.log(data);
      links = data.links;
      pics = data.pics;
      res.render('index', { title: 'Chorizo Burrito', tweets: links, pictures: pics });
    } else {
      next();
    }
  });
}



/* GET home page. */
router.get('/',cache, getTweets);

const cleanTweets = (tweets) => {
  let obj = {};
  obj.links = [];
  obj.pics = [];

  for (i = 0; i < tweets.length; i++) {
    if (tweets[i].text.includes('—') && !(tweets[i].text.includes('RT'))) {
      let tweet = tweets[i].text;
      let cleanText = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      cleanText = cleanText.replace('—', '');
      if (tweets[i].entities.media) {
        obj.pics.push(picturePost(tweets[i], cleanText))
      }
      else {
        obj.links.push(linkPost(tweets[i], cleanText))
      }

    }
  }
  return obj;
}

const picturePost = (tweet, cleanText) => {
  let media = JSON.stringify(tweet.entities.media);
  let img = JSON.parse(media.substring(1, media.length - 1));
  let imgLink = img.media_url_https;
  let source = tweet.id_str;
  let author = tweet.user.profile_image_url;
  let screenName = tweet.user.screen_name;
  let sourceLink = 'https://twitter.com/' + screenName + '/status/' + source;
  // console.log(tweet);
  let element = {
    source: sourceLink,
    description: cleanText,
    link: imgLink,
    author: author,
    screen_name: screenName
  }
  return element;
}

const linkPost = (tweet, cleanText) => {
  if (!tweet.entities.urls.length == 0) {
    // console.log(tweet.user.screen_name);
    let url = tweet.entities.urls[0].url;
    let author = tweet.user.profile_image_url;
    let source = tweet.id_str;
    let screenName = tweet.user.screen_name;
    let sourceLink = 'https://twitter.com/' + screenName + '/status/' + source;

    let element = {
      source: sourceLink,
      url: url,
      text: cleanText,
      author: author
    }
    return element;

  }
}

const lookUp = (url) => {
  const lookUpKey = process.env.LINK_PREVIEW_KEY;
  const site = 'https://api.linkpreview.net';
  const apiEndPoint = site + '/?key=' + lookUpKey + '&q=' + url;

  let options = {
    method: "GET",
    uri: apiEndPoint,
    json: true,
    headers: {
      q: apiEndPoint,
      key: lookUpKey,
    }
  }

  return new request(options)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);

    })

}


module.exports = router;
