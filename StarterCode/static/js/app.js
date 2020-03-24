
function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // var url = `/metadata/${sample}`;
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json("samples.json").then ((data)=>{

  var metadata = data.metadata;
  var results = metadata.filter(sampleobject=>sampleobject.id==sample);
  var result = results[0];
    // if (error) return console.log(error);
    
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("p")
      .text(`${key}:${value}`);
  });
      // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.wfreq);
  });
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
 
  d3.json("samples.json").then ((data)=>{

    var sample1 = data.samples;
    var results = sample1.filter(sampleobject=>sampleobject.id==sample);
    var result = results[0];
    // if (error) return console.log(error);
    var otuid=result.otu_ids;
    var otulabels=result.otu_labels;
    var samplevalues=result.sample_values;
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuid,
      y: samplevalues,
      mode:"markers", 
      marker:{
        size: samplevalues,
        color: otuid,
        colorscale: "Rainbow",
        labels: otulabels,
        type: 'scatter',
        opacity: 0.3
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Marker Size',
      xaxis: { title: 'OTU ID' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data1, layout); 

    // @TODO: Build a bar Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      y: otuid.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: samplevalues.slice(0,10).reverse(),
      text: otulabels.slice(0,10),
      type: 'bar',
      orientation: "h"
    }];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot('bar', data, barLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames=data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();