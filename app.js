/**
 * Created by jayantbhawal on 16/3/16.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/scrape", function (req, res) {
	var data = req.body;
	var url = data.url;
	var type = data.type;
	var selectors = data.selectors.split("\n");
	var params = data.params;
	var heads = JSON.parse(data.heads);
	heads["User-Agent"] = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36";
	if (type == "post") {
		request.post({
			url: url,
			headers:heads,
			form: params
		}, function (err, httpResponse, body) { /* ... */
			if(err){
				res.send(err);
			}
			else{
				var $ = cheerio.load(body);

				var responseArray = [];

				selectors.forEach(function (select, i) {
					responseArray.push($(select).text());
				});

				res.send(responseArray);
			}
		});
	}
});
app.use(express.static(__dirname));
var port = process.env.PORT || "9000";

app.listen(port,"0.0.0.0", function(){
    console.log("Server running on port "+port);
});
