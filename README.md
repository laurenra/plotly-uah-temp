# UAH Global Temperature plotted in Plotly

Show UAH Global Temparature time series in Plotly; global, global land,
global ocean from global satellite temperature measurements posted at
the [Global Temperature Report website](https://www.nsstc.uah.edu/climate/)
of the University of Alabama Huntsville (UAH) Earth System Science Center.

Raw data is here:

https://www.nsstc.uah.edu/data/msu/v6.0/tlt/uahncdc_lt_6.0.txt

Note: **plotly-latest.min.js** is loaded from a CDN. It's fairly large, about
3.5 MB. You could download it to the **js/lib** directory for faster loading
for development, if you want. Modify the `<script>` tag in the HTML files.
The source is https://cdn.plot.ly/plotly-latest.min.js.

## Run it

Run the Python simple HTTP server from project root directory to view the HTML pages

Linux/Mac python3
```shell
python3 -m http.server
```
Linux/Mac python (old)
```shell
python -m SimpleHTTPServer
```
Windows python
```shell
python -m http.server
```
The default port is 8000. View it by going to [localhost:8000](http://localhost:8000)
in a browser, which will show a directory listing. You can click on the .html
files to show them. If you want a different port, like 8888, just add the port
number to the command like this:

Linux/Mac python3
```shell
python3 -m http.server 8888
```

- Access the page in a browser at http://localhost:8888/uah-temp.html.
- You can reference everything in the project local directory as subdirectories
  and files under http://localhost:8000.
- Stop the server with Ctrl+C.
- If your changes don't appear, force the browser to refresh from the server.
  In Chrome, use Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

## Update the data source .csv files with R scripts
The **uah-monthly-global.csv** used by the Plotly Javascript library to generate 
plots pulls data from the UAH website. To get the latest data, use the .R script, 
**get-uah-data-global.R** in the **/r** directory.

1. Install R from https://cran.rstudio.com/
2. Install RStudio from https://posit.co/download/rstudio-desktop/

You could use an R command console to run the scripts but RStudio is far more
convenient.

In RStudio:

1. File > Open and locate **get-uah-data-global.R**.
2. Run each line of the script by clicking Run (Cmd+Return Mac, Ctrl+Enter Windows).

### Description of process to get data and transform it into the final .CSV

1. Create a custom function called **moveme** to be used to reorder columns later.
   (Functions must load before they are used in the script.)
2. Install the RCurl package and include the RCurl library to use the getURL function.
3. Get the raw data (uahncdc_lt_6.0.txt) from the UAH URL.
4. Use a RegEx search to remove the descriptive text at the top and bottom,
   leaving just the column header names and the columns and rows of data.
5. Convert the text data into data frames that R can manipulate. Read only the 
Year, Mo, and 3 columns of temperature data (Variables, vectors, and data frames are 
removed along the way with **rm()** when they are no longer needed.)
6. Create custom column names.
7. Convert the Year and Month columns to a Date column. The date is the first day
   of the month.
8. Remove the Year and Month columns by making a table that is a subset of the original.
9. Move the Date column to be first.
10. Write the .csv file. **You'll have to modify the directory**.

## Create deployment tarball

To simplify deploying to a web server, use the **make-deployment-tar** 
script to create a tarball with all the files required.

1\. Run the script. 

```shell script
./make-deployment-tar
```

2\. Copy **uah-temp.tar** to the server.

3\. Extract the files.

```shell script
tar xvf uah-temp.tar
```

Update the script when you add files to the project that are 
required for deployment. 

## Tutorials and Reference

[Plotly JavaScript Reference and Examples](https://plot.ly/javascript/)

[Plotly Time Series in JavaScript](https://plot.ly/javascript/time-series/)

[Plotly JavaScript Function Reference](https://plot.ly/javascript/plotlyjs-function-reference/)

[Plotting CSV Data from Ajax Call](https://plot.ly/javascript/ajax-call/)

[D3 API Reference](https://d3js.org/api)

http://learnjsdata.com/read_data.html

https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js

[Run SimpleHTTPServer to solve CORS error for local files](https://stackoverflow.com/questions/21006647/cannot-import-data-from-csv-file-in-d3)

## Data

[UAH Temperature data (fixed-length)](https://www.nsstc.uah.edu/data/msu/v6.0/tlt/uahncdc_lt_6.0.txt)

