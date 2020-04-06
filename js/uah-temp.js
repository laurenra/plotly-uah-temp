/**
 * TODO: make a "Share Link" button that queries the DOM <g class="traces">
 *     under <g class="groups"> under <g class="legend"> under the
 *     <div id="uah-temp-time-series"> to get which ones are selected
 *     (style="opacity: 1" instead of style="opacity: 0.5) and builds a URL
 *     with query parameters.
 * TODO: figure out how to create plots, legends, and matching URL query parameters
 *     automatically from data headers.
 * TODO: figure out how to use command line R to get UAH data, convert to a
 *     time series (TS) to run statistical operations on it like decomposition,
 *     linear trends, etc., then populate columns with smoothing, linear trends, etc.
 */

// var serverRoot = 'http://localhost:8888';
// var serverRoot = 'http://yburbs.com/plotly-practice-1';

var serverPath = location.pathname; // "/plotly-practice-1/practice1.html"
var pathOnly = serverPath.substr(0, location.pathname.lastIndexOf("/"));
var serverRoot = location.protocol + "//" + location.host + pathOnly;

/**
 * Create a URL query generator ("Copy Link" button) for the graph.
 */

uahTempTimeSeriesGlobal();
uahTimeSeriesTest();

/* Current Plotly.js version */
console.log( Plotly.BUILD );


/**
 * Check query parameters to see if plot line is displayed.
 *
 * urlParm = URL query string (gAll, nhAll, tOcean, etc.)
 *
 * defaultDisplay = true:   null, &parm, &parm=1  return true   (show plot line)
 *                          &parm=0               returns false (don't show plot line)
 *
 * defaultDisplay = false:  &parm, &parm=1        return true   (show plot line)
 *                          null, &parm=0         return false  (don't show plot line)
 */
function displayPlotLine( urlParm = '', defaultDisplay = true ) {
    var displayLine;

    /* Get URL query parameters to figure out what plots to show. */
    var urlQuery = new URLSearchParams(window.location.search);

    if (defaultDisplay == true) {
        // displayLine = urlQuery.get(urlParm) ? (urlQuery.get(urlParm) == 0) ? 'hide' : 'show' : 'show';
        displayLine = urlQuery.get(urlParm) ? (urlQuery.get(urlParm) == 0) ? false : true : true;
    }
    else {
        // displayLine = urlQuery.get(urlParm) == 1 ? 'show' : (urlQuery.get(urlParm) == '') ? 'show' : 'hide';
        displayLine = urlQuery.get(urlParm) == 1 ? true : (urlQuery.get(urlParm) == '') ? true : false;
    }

    // var urlgAllT = urlQuery.get('gAll') ? 'true' : 'false';           // &gAll=1 true,  &gAll=0 true,  &gAll FALSE, (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == null) ? 'true' : 'false'; // &gAll=1 FALSE, &gAll=0 FALSE, &gAll FALSE, (na) true
    // var urlgAllT = (urlQuery.get('gAll') == '') ? 'true' : 'false';   // &gAll=1 FALSE, &gAll=0 FALSE, &gAll true,  (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == 0) ? 'true' : 'false';    // &gAll=1 FALSE, &gAll=0 true,  &gAll true,  (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == 1) ? 'true' : 'false';    // &gAll=1 true,  &gAll=0 FALSE, &gAll FALSE, (na) FALSE

    return displayLine;
}


/**
 * UAH Global Satellite Temperature
 *
 * url query parameters show/hide plot lines
 *
 * ga, gl, go = global All, Land, Oceans
 */
function uahTempTimeSeriesGlobal() {

    /**
     * Global temp
     * no param: visible = true
     * gAll:     visible = true
     * gAll=0:   visible = 'legendonly'
     * gAll=1:   visible = true
     */

    // var gAllDisplay = displayPlotLine('gAll', true);
    // var tAllDisplay = displayPlotLine('tAll', false);

    /* Get data and build plot(s). */
    // Plotly.d3.csv("http://localhost:8888/data/uah-monthly.csv", function(err, rows){
    // Plotly.d3.csv(serverRoot + "/data/uahncdc_lt_6.0_monthly.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/uah-monthly-global.csv", function(err, rows){
        // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
        // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var yearsArray = unpack(rows, 'Date');
        var yaLen = yearsArray.length;
        var yaFirst = yearsArray[0];
        var yaLast = yearsArray[yaLen - 1];
        var dateFirst = new Date(yaFirst);
        var dateLast = new Date(yaLast);
        // console("First date:" + dateFirst.)


        var traceGlobal = {
            type: "scatter",
            mode: "lines",
            name: 'Global Average',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Global'),
            visible: displayPlotLine('ga', true) ? true : 'legendonly',
            // visible: urlParms.get('gAll') ?
            // line: {color: '#008000'}
            line: {color: '#555555'}
            // line: {color: '[rgb(171,0,16)]'}
        };


        var traceGLand = {
            type: "scatter",
            mode: "lines",
            name: 'Global Land Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Land'),
            visible: displayPlotLine('gl', false) ? true : 'legendonly',
            line: {color: '#af6700'}
        };

        var traceGOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Global Ocean Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Ocean'),
            visible: displayPlotLine('go', false) ? true : 'legendonly',
            line: {color: '#0083e0'}
        };


        var data = [traceGlobal,traceGLand,traceGOcean];

        var config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'custom_image',
                height: 500,
                width: 1300,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        var layout = {
            // title: 'UAH Temperature Time Series',
            title: {
                text: 'UAH Temperature Time Series',
                font: {
                    size: 17,
                    // color: 'LightSeaGreen'
                    color: 'MediumSeaGreen'
                    // color: 'DarkSeaGreen'
                    // color: 'SeaGreen'
                    // color: 'AquaMarine'
                    // color: 'MediumAquaMarine'
                },
                x: 0.5,
                y: 1.15
            },
            annotations: [{
                text: '(December, 1978&#8211;present)',
                font: {
                    size: 13
                    // color: '#eb6600'
                },
                showarrow: false,
                x: 0.56,
                y: 1.15,
                xref: 'paper',
                yref: 'paper'
            }],
            xaxis: {
                // title: 'Year (December 1978&ndash;present)'
                title: 'Date'
                // title: 'Year (December 1978&#x2013;present)'
            },
            yaxis: {
                title: 'Temperature &deg;C'
            }
        };

        Plotly.newPlot('uah-temp-series-global', data, layout, config);

    })
}


/**
 * UAH Global Satellite Temperature
 *
 * url query parameters show/hide plot lines
 *
 * ga, gl, go = global All, Land, Oceans
 */
function uahTimeSeriesTest() {

    /**
     * Global temp
     * no param: visible = true
     * gAll:     visible = true
     * gAll=0:   visible = 'legendonly'
     * gAll=1:   visible = true
     */

    // var gAllDisplay = displayPlotLine('gAll', true);
    // var tAllDisplay = displayPlotLine('tAll', false);

    /* Get data and build plot(s). */
    // Plotly.d3.csv("http://localhost:8888/data/uah-monthly.csv", function(err, rows){
    // Plotly.d3.csv(serverRoot + "/data/uahncdc_lt_6.0_monthly.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/uah.global.ts.csv", function(err, rows){
        // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
        // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var yearsArray = unpack(rows, 'index');
        var yaLen = yearsArray.length;
        var yaFirst = yearsArray[0];
        var yaLast = yearsArray[yaLen - 1];
        var dateFirst = new Date(yaFirst);
        var dateLast = new Date(yaLast);
        // console("First date:" + dateFirst.)


        var traceGlobal = {
            type: "scatter",
            mode: "lines",
            name: 'Global Average',
            x: unpack(rows, 'index'),
            y: unpack(rows, 'value'),
            visible: displayPlotLine('ga', true) ? true : 'legendonly',
            // visible: urlParms.get('gAll') ?
            // line: {color: '#008000'}
            line: {color: '#555555'}
            // line: {color: '[rgb(171,0,16)]'}
        };


        var data = [traceGlobal];

        var config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'custom_image',
                height: 500,
                width: 1300,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        var layout = {
            // title: 'UAH Time Series Test',
            title: {
                text: 'UAH Temperature Time Series',
                font: {
                    size: 17,
                    // color: 'Coral'
                    color: 'Salmon'
                    // color: 'LightSalmon'
                    // color: 'DarkSalmon'
                },
                x: 0.5,
                y: 1.15
            },
            annotations: [{
                text: '(December, 1978&#8211;present)',
                font: {
                    size: 13
                    // color: '#eb6600'
                },
                showarrow: false,
                align: 'center',
                x: 0.5,
                y: 1.15,
                xref: 'paper',
                yref: 'paper'
            }],
            xaxis: {
                // title: 'Year (December 1978&ndash;present)'
                title: 'Date'
                // title: 'Year (December 1978&#x2013;present)'
            },
            yaxis: {
                title: 'Temperature &deg;C'
            }
        };

        Plotly.newPlot('uah-time-series-test', data, layout, config);

    })
}

