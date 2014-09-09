var http = require("http");
function weatherJob() {



// WOEID for Zurich http://woeid.rosselliot.co.nz
    var woeid = 784794;


    //var query = "select * from weather.forecast WHERE woeid=" + woeid + " and u=c&format=json";
    var query = "select%20*%20from%20weather.forecast%20WHERE%20woeid=784794%20and%20u=%27c%27%20&format=json";

    var options = {
        hostname: 'query.yahooapis.com',
        path: '/v1/public/yql?q=' + query,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };


    var httpReq = http.request(options);

    httpReq.on("response", function (res) {
        var jsonResponse = '';
        // console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            jsonResponse += chunk;

        });

        res.on('end', function () {

            var weatherInfo = JSON.parse(jsonResponse);
            var results = weatherInfo["query"]["results"];

            if (results) {
                var condition = results["channel"]["item"]["condition"];
                var location = results["channel"]["location"];
                send_event("weather", { location: location["city"], temperature: condition["temp"], code: condition["code"], format: "c" });
            }
        })
    });
    httpReq.on('error', function (e) {
        console.error('problem with request: ' + e.message);
    });
    httpReq.end();


}

setInterval(weatherJob, 10 * 1000);
weatherJob();