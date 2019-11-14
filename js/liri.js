require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");


//Make it so liri.js can take in one of the following commands
//concert-this
//spotify-this-song
//movie-this
//do-what-it-says


var command = process.argv[2];

switch (command) {
    case "concert-this":
        var artist = process.argv.slice(3).join(" ");
        var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(bandsUrl).then(function (response) {
            if (response.data.length) {
                var events = response.data;

                events.forEach(function (event) {
                    console.log("Venue: " + event.venue.name);
                    if (event.venue.region) console.log("Location: " + event.venue.city + ", " + event.venue.region)
                    else console.log("Location: " + event.venue.city);
                    console.log("Date: " + moment(event.datetime).format('MM/DD/YYYY'));
                    console.log("----------------------\n");
                })
            } else {
                console.log("Sorry, No information for that band");
            }

        })

        break;

    case "spotify-this-song":
        var track = process.argv.slice(3).join(" ");
        spotify.search({ type: 'track', query: track, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var trackData = data.tracks.items[0];
            var song = trackData.name;
            var songPreview = trackData.preview_url ? trackData.preview_url : "No available Link";
            var album = trackData.album.name;

            var artists = [];
            trackData.artists.forEach(function (artist) {
                artists.push(artist.name);
            })
            // console.log(trackData);
            console.log("Artist(s): " + artists.join(","));
            console.log("Song: " + song);
            console.log("Preview Link: " + songPreview);
            console.log("Album: " + album);

        });
        break;

    case "movie-this":
        console.log("movie");
        break;

    case "do-what-it-says":
        console.log("what it say");
        break;

    default:
        console.log("Insert a valid command");
}