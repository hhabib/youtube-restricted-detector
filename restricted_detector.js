var fs = require('fs'),
    filedata = fs.read('youtube_urls_incognito.txt'), // read the file into a single string
    urls = JSON.parse(filedata) // parse the data containing urls into an array
var url_results = [];
var page = require('webpage').create();

// Function for retrieving the "unavailable-message" string of a YouTube video
//     "Content warning" is the string for videos blocked in restricted mode.
function processURL(url, callback) {
    // console.log('Processing URL: ' + url);
    page.open(url, function(status) {
        // console.log('Opening URL: ' + url);
        if (status === "success") {
            console.log('Success: ' + url);
            var restrictedText = page.evaluate(function() {
                return document.getElementById("unavailable-message").innerText.trim();
            });
            url_results.push({ url: url, response: restrictedText });
            console.log(restrictedText);
            callback();
        } 
    });
}

// Recursive function to iterate through the URLs and process them
function processNextURL() {
    const url = urls.pop();
    console.log('URLS Remaining: ' + urls.length)
    // console.log('Next URL: ' + url);
    if (!url) exit(); // Base case
    processURL(url, processNextURL.bind(this));
}

function main() {
    processNextURL();
    
}

// Function to return the results and exit
function exit() {
    console.log(JSON.stringify(url_results));
    console.log("Total urls processed: ", url_results.length);
    phantom.exit(0);
}

main();
