/**
 * Created by jayantbhawal on 16/3/16.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/scrape", function (req, res) {
	var data = JSON.parse(req.body);
	var url = data.url;
	var type = data.type;
	var selectors = data.selectors;

	if(type == "post"){

	}
});

app.listen("9000");
