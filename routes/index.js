var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var request = require('request-promise');
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
  let author = tweet.user.profile_image_url;
  let source = tweet.id_str;
  let screenName = tweet.user.screen_name;
  let sourceLink = 'https://twitter.com/' + screenName + '/status/' + source;
  //console.log(tweet);
  let element = {
    source: sourceLink,
    description: cleanText,
    link: imgLink,
    author: author
  }
  return element;
}

const linkPost = (tweet, cleanText) => {
  if (!tweet.entities.urls.length == 0) {
    // console.log(tweet.user.profile_image_url);
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
    uri: apiEndPoint,
    json: true
  }

  return new request(options)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);

    })

}

const params = { exclude_replies: true, count: 200 }

/* GET home page. */
router.get('/', function (req, res, next) {

  client.get('statuses/home_timeline', params)
    .then((tweets) => {
      return cleanTweets(tweets);
    })
    .then((tweets) => {
      let pics = tweets.pics;
      let links = tweets.links;
      //const posts = Promise.all(links.map(lookUp));

      // posts.then((data) => {
      //   let element = {
      //     imgDescription: data.description,
      //     img: data.image,
      //     url: data.url

      //   }
      //   return element;
      // }).then((data) => {

      res.render('index', { title: 'Chorizo Burrito', tweets: links, pictures: pics });

      // })



    })
    .catch((error) => {
      console.log(error);
    })


});


module.exports = router;
