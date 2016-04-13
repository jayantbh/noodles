/**
 * Created by jayantbhawal on 14/4/16.
 */

var clr;
window.onload = function () {
	document.getElementById("url").value = localStorage["url"] || "http://example.com";
	document.getElementById("type").value = localStorage["type"] || "post";
	document.getElementById("selectors").value = localStorage["selectors"] || "title\nh1";
	document.getElementById("params").value = localStorage["params"] || "key1=val1";
	document.getElementById("heads").value = localStorage["heads"] || '{"Referer":"http://somewebsite.com"}';
	document.getElementById("min").value = localStorage["min"] || "0";
	document.getElementById("max").value = localStorage["max"] || "1";
	document.getElementById("delay").value = localStorage["delay"] || "500";

	if(window.Notification && Notification.permission !== "granted" && Notification.permission !== "denied"){
		alert("Noodles will ask for your permission to enable browser notifications.\nThis should not be annoying at all " +
			"as it'll only notify you if a scraping task you left running has completed in the background.");
		Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
			switch(status){
				case "granted": console.log("Notifications allowed."); break;
				case "denied": console.log("Notifications denied."); break;
			}
		});
	}
};
function isAtBottom(){
	console.log(document.body.offsetHeight - (document.body.scrollTop + window.innerHeight))
	return document.body.offsetHeight - (document.body.scrollTop + window.innerHeight) <= 150;
}
function goToBottom(){
	document.body.scrollTop = window.innerHeight;
}
function stopScraping(){
	if(clr){
		clearInterval(clr);
		clr = null;
		document.getElementById("go-scrape").innerText = "SCRAPE!";
	}
}
function scrape() {
	if(clr){
		stopScraping();
	}
	else{
		document.getElementById("go-scrape").innerText = "STOP SCRAPING!";
		document.getElementById("output").innerHTML = "";

		var urlEl = document.getElementById("url");
		var typeEl = document.getElementById("type");
		var selectEl = document.getElementById("selectors");
		var paramEl = document.getElementById("params");
		var headEl = document.getElementById("heads");
		var min = localStorage["min"] = document.getElementById("min").value;
		var max = localStorage["max"] = document.getElementById("max").value;
		var delay = localStorage["delay"] = document.getElementById("delay").value;

		var total = (max-min+1);

		var url = localStorage["url"] = urlEl.value;
		var type = localStorage["type"] = typeEl.value;
		var selectors = localStorage["selectors"] = selectEl.value;
		var params = localStorage["params"] = paramEl.value;
		var headers = localStorage["heads"] = headEl.value;

		var err = false;

		if (urlEl.validity.valid && url.length) {
			document.getElementById("urlerr").classList.add("hide");
		}
		else {
			document.getElementById("urlerr").classList.remove("hide");
			err = true;
		}
		if (typeEl.validity.valid && type.length) {
			document.getElementById("typerr").classList.add("hide");
		}
		else {
			document.getElementById("typerr").classList.remove("hide");
			err = true;
		}
		if (selectEl.validity.valid) {
			document.getElementById("selerr").classList.add("hide");
		}
		else {
			document.getElementById("selerr").classList.remove("hide");
			err = true;
		}

		if (!err) {
			var scrapeJSON = {
				url: url,
				type: type,
				selectors: selectors,
				params: params,
				heads: headers
			};

			var count = 0;
			function callScraper() {
				var request = new XMLHttpRequest();
				request.open('POST', '/scrape', true);
				request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				request.send(JSON.stringify(scrapeJSON));

				request.onreadystatechange = function () {
					if (request.readyState == 4 && request.status == 200) {
						var scrapeData = JSON.parse(request.responseText).map(function(el,i){return(el.replace(/\n|\t/g,""))});

						var row = document.createElement("tr");
						scrapeData.forEach(function(v,i){
							if(v){
								var col = document.createElement("td");
								col.innerHTML = v;
								row.appendChild(col);
							}
						});
						if(row.hasChildNodes){
							document.getElementById("output").appendChild(row);
							count++;
							if(count == total){
								document.getElementById("go-scrape").innerText = "Scraping Complete. "+count+" items scraped.";

								if(window.Notification && Notification.permission !== "denied") {
									var n = new Notification('Noodles!', {
										body: 'Task for scraping '+count+' items is complete.',
										icon: 'logo.png' // optional
									});
								}
							}
							else{
								document.getElementById("go-scrape").innerText = "STOP SCRAPING! ("+count+"/"+total+" done)";
							}
							if(isAtBottom()){
								goToBottom();
							}
						}
					}
				};
			}

			var iter = params.match(/\{(.+)\}/)
			if (iter && iter[1]) {
				var l = iter[1].length;

				clr = setInterval(function () {
					var replacement = "";
					if (min.toString().length < l) {
						var diff = l - min.toString().length;
						while (diff--) {
							replacement += "0";
						}
						replacement += min;
					}
					else {
						replacement += min;
					}
					scrapeJSON.params = params.replace(iter[0], replacement);

					callScraper();
					min++;
					if (min > max) {
						stopScraping();
					}

				}, delay);
			}
			else {
				callScraper();
			}
		}
	}
}

function applyPreset(preset){
	switch(preset){
		case "wbut":
			document.getElementById("url").value = "http://wbutech.net/show-result1516.php";
			document.getElementById("type").value = "post";
			document.getElementById("selectors").value = "#lblContent > table:nth-child(2) > tbody > tr:nth-child(2) > th:nth-child(1)\n#lblContent > table:nth-child(8) > tbody > tr:nth-child(1) > td";
			document.getElementById("params").value = "semno=5&rectype=1&rollno=300001130{##}";
			document.getElementById("heads").value = '{"Referer":"http://wbutech.net/result_odd1516.php"}';
			document.getElementById("min").value = "1";
			document.getElementById("max").value = "33";
			document.getElementById("delay").value = "500";
			break;
		case "cbse":
			document.getElementById("url").value = "http://resultsarchives.nic.in/cbseresults/cbseresults2015/class12/cbse122015_all.asp";
			document.getElementById("type").value = "post";
			document.getElementById("selectors").value = "body > div:nth-child(7) > table:nth-child(2) tr:nth-child(1) > td:nth-child(2)\nbody > div:nth-child(7) > table:nth-child(2) tr:nth-child(2) > td:nth-child(2)\nbody > div:nth-child(7) > div > center > table tr:nth-child(2) > td:nth-child(5)\nbody > div:nth-child(7) > div > center > table tr:nth-child(3) > td:nth-child(5)\nbody > div:nth-child(7) > div > center > table tr:nth-child(4) > td:nth-child(5)\nbody > div:nth-child(7) > div > center > table tr:nth-child(5) > td:nth-child(5)\nbody > div:nth-child(7) > div > center > table tr:nth-child(6) > td:nth-child(5)\nbody > div:nth-child(7) > div > center > table tr:nth-child(9) > td:nth-child(2) > b:nth-child(1)\nbody > div:nth-child(7) > div > center > table tr:nth-child(10) > td:nth-child(2) > b:nth-child(1)\nbody > div:nth-child(7) > div > center > table tr:nth-child(11) > td:nth-child(2) > b:nth-child(1)\nbody > div:nth-child(7) > div > center > table tr:nth-child(12) > td:nth-child(2) > b:nth-child(1)";
			document.getElementById("params").value = "regno=56756{##}&B1=Submit";
			document.getElementById("heads").value = '{"Referer":"http://resultsarchives.nic.in/cbseresults/cbseresults2015/class12/cbse122015_all.htm"}';
			document.getElementById("min").value = "1";
			document.getElementById("max").value = "99";
			document.getElementById("delay").value = "100";
			break;
	}
}
