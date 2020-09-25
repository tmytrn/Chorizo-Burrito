var express = require("express");
var router = express.Router();
let Twitter = require("twitter");
const fetch = require("node-fetch");
const redis = require("redis");
var SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const REDIS_PORT = process.env.REDIS_URL || 6379;

const cachePort = redis.createClient(REDIS_PORT);

var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_KEY,
  access_token_secret: process.env.TWIT_ACCESS_SECRET,
});

let spotifyApi = new SpotifyWebApi({
  clientId: "0d0814d91f8a4b61b09fb602ed6dea6b",
  clientSecret: "f9d22b486ce544feb3be2242cd1939a7",
});

// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
//   }
// );

let links, pics;

/* GET home page. */
router.get("/", cache, getTweets);

//  async function getPlaylist(req, res, next){
//   spotifyApi.getPlaylist('53SJ6SSjNYgJQftjhBk3Er').then(
//     function(data) {
//       // console.log(data.body.tracks.items);
//       let tracks = data.body.tracks.items;
//       for(i =0; i < tracks.length; i++){
//         console.log(tracks[i].track.name);
//       }
//       next();
//     },
//     function(err) {
//       console.error(err);
//     }
//   );
//   }

async function getTweets(req, res, next) {
  try {
    console.log("Fetching Data...");

    const params = { exclude_replies: true, count: 200 };
    const response = await client.get("statuses/home_timeline", params);
    // const data = await response.json();
    tweets = cleanTweets(response);

    cachePort.setex("home", 100, JSON.stringify(tweets));

    links = tweets.links;
    pics = tweets.pics;

    res.render("index", {
      title: "Chorizo Burrito",
      tweets: links,
      pictures: pics,
    });
  } catch (e) {
    console.log(e);
  }
}

function cache(req, res, next) {
  cachePort.get("home", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      data = JSON.parse(data);
      // console.log(data);
      links = data.links;
      pics = data.pics;
      res.render("index", {
        title: "Chorizo Burrito",
        tweets: links,
        pictures: pics,
      });
    } else {
      next();
    }
  });
}

function cleanTweets(tweets) {
  let obj = {};
  obj.links = [];
  obj.pics = [];

  for (i = 0; i < tweets.length; i++) {
    if (tweets[i].text.includes("—") && !tweets[i].text.includes("RT")) {
      let tweet = tweets[i].text;
      let cleanText = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
      cleanText = cleanText.replace("—", "");
      if (tweets[i].entities.media) {
        obj.pics.push(picturePost(tweets[i], cleanText));
      } else {
        obj.links.push(linkPost(tweets[i], cleanText));
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
  let sourceLink = "https://twitter.com/" + screenName + "/status/" + source;
  let element = {
    source: sourceLink,
    description: cleanText,
    link: imgLink,
    author: author,
    screen_name: screenName,
  };
  return element;
};

function linkPost(tweet, cleanText) {
  if (!tweet.entities.urls.length == 0) {
    // console.log(tweet.user.screen_name);
    let url = tweet.entities.urls[0].url;
    let author = tweet.user.profile_image_url;
    let source = tweet.id_str;
    let screenName = tweet.user.screen_name;
    let sourceLink = "https://twitter.com/" + screenName + "/status/" + source;
    let display_url = tweet.entities.urls[0].display_url;

    let element = {
      source: sourceLink,
      url: url,
      text: cleanText,
      author: author,
      display_url: display_url,
    };
    return element;
  }
}

async function lookUp(url) {
  const lookUpKey = process.env.LINK_PREVIEW_KEY;
  const site = "https://api.linkpreview.net";
  const apiEndPoint = site + "/?key=" + lookUpKey + "&q=" + url;
  let imageURL;

  let options = {
    headers: {
      q: apiEndPoint,
      key: lookUpKey,
    },
  };

  const response = await fetch(apiEndPoint, options);

  const data = await response.json();
  console.log(data.description);
  const image = data.image;
  // console.log(image);

  return image;
}

module.exports = router;
