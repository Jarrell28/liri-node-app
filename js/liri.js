require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");


var command = process.argv[2];

switch (command) {
    case "concert-this":
        var artist = process.argv.slice(3).join(" ");
        concertThis(artist);
        break;

    case "spotify-this-song":
        var track = process.argv.slice(3).join(" ");
        spotifyThis(track);
        break;

    case "movie-this":
        var movie = process.argv.slice(3).join(" ") ? process.argv.slice(3).join(" ") : "Mr. Nobody";
        movieThis(movie);
        break;

    case "do-what-it-says":
        doThis();
        break;

    default:
        console.log("Insert a valid command");
}

function concertThis(artist) {
    var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandsUrl).then(function (response) {
        if (response.data.length) {
            var events = response.data;
            console.log("Getting information for concerts...");
            console.log("----------------------");

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
}

function spotifyThis(track) {
    spotify.search({ type: 'track', query: track, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var trackData = data.tracks.items;
        console.log("Getting information for songs...");
        console.log("----------------------");
        trackData.forEach(track => {
            var song = track.name;
            var songPreview = track.preview_url ? track.preview_url : "No available Link";
            var album = track.album.name;

            var artists = [];
            track.artists.forEach(function (artist) {
                artists.push(artist.name);
            })
            // console.log(trackData);
            console.log("Artist(s): " + artists.join(","));
            console.log("Song: " + song);
            console.log("Preview Link: " + songPreview);
            console.log("Album: " + album);
            console.log("----------------------");
        })



    });
}

function movieThis(movie) {
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movie;

    axios.get(movieURL).then(function (response) {
        console.log("Getting information for movie...");
        console.log("----------------------");
        var movieData = response.data;

        var title = movieData.Title;
        var year = movieData.Year;
        var imdbRating = movieData.imdbRating;
        var rottenRating = movieData.Ratings.filter(rating => rating.Source === 'Rotten Tomatoes');
        rottenRating.length ? rottenRating = rottenRating[0].Value : rottenRating = "No Rating Posted";
        var country = movieData.Country;
        var language = movieData.Language;
        var plot = movieData.Plot;
        var actors = movieData.Actors;

        console.log("Title: " + title);
        console.log("Year: " + year);
        console.log("IMBD Rating: " + imdbRating);
        console.log("Rotten Tomatoes Rating: " + rottenRating);
        console.log("Country: " + country);
        console.log("Language: " + language);
        console.log("Plot: " + plot);
        console.log("Actors: " + actors);
    })
}

function doThis() {
    fs.readFile('../random.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        var content = data.split(",");

        switch (content[0]) {
            case "concert-this":
                concertThis(content[1]);
                break;
            case "movie-this":
                movieThis(content[1]);
                break;
            case "spotify-this-song":
                spotifyThis(content[1]);
                break;
        }

    });
}