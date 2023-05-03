<template>
  <div>
    <div id="svg" class="pt-5"></div>
    <div id="svg2"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
// import {tip as tep} "d3-tip";
import report from "./data/reports.json";
import { renderTimeEntriesAction } from "../interval";
import { ListTag } from "../lib";
export default {
  data() {
    return {
      taglist1: [],
      entry: [],
      taglist3: [],
      listImag: [],
      list1: [],
      listTable: [],
      secondList: [],
      thirdList: [],
      report: report,
      db: [
        { name: "news", parent: "" },

        { name: "tech", parent: "news" },
        { name: "sport", parent: "news" },
        { name: "music", parent: "news" },

        { name: "ai", parent: "tech", amount: 5 },
        { name: "coding", parent: "tech", amount: 5 },
        { name: "tablets", parent: "tech", amount: 3 },
        { name: "laptops", parent: "tech", amount: 6 },
        { name: "d3", parent: "tech", amount: 3 },
        { name: "gaming", parent: "tech", amount: 3 },

        { name: "football", parent: "sport", amount: 6 },
        { name: "hockey", parent: "sport", amount: 3 },
        { name: "baseball", parent: "sport", amount: 5 },
        { name: "tenis", parent: "sport", amount: 6 },
        { name: "f1", parent: "sport", amount: 1 },

        { name: "house", parent: "music", amount: 3 },
        { name: "rock", parent: "music", amount: 4 },
        { name: "punk", parent: "music", amount: 5 },
        { name: "jazz", parent: "music", amount: 2 },
        { name: "pop", parent: "music", amount: 3 },
        { name: "classical", parent: "music", amount: 5 },
      ],
    };
  },
  methods: {
    buildLabelTag() {
      // le temps des tags avec une dates inferieure à la date de debut des actions (tests) auront pour parent load page
      // [this.report.report.entries.startedDateTime < this.report.report.check.stats.starts]
      // if (new Date(entrie.startedDateTime).getTime() < new Date(this.report.report.check.stats.start).getTime()) {
      //     console.log(entrie);
      //   }
      // if (el.time < 500) {
      //   console.log("Valeurs < 500 : ", el);
      //   return el.request.url.includes(element.path);
      // };
    },
    buildtree() {
      // load parent
      const model = {
        name: "Load Page",
        parent: "",
        amount: this.report.report.pages[0].startedDateTime,
        path: "",
        entrie : []
        
      };
      this.list1.push(model);

      // load children 1
      this.report.report.entries.forEach((entrie, i) => {
        let label = null;

        label = ListTag.filter((tag, index) => {
          return entrie.request.url.includes(tag.path);
        });
        // console.log("Valeur du label", label);

        if (label.length != 0) {
          const model = {
            name: label[0].libelle,
            parent: "Load Page",
            amount: this.report.report.entries[i].time,
            path: label[0].path,
            entrie : []
          };

          //  List pour compter les tags retrouvés
          this.taglist1.push(model);

          if (!JSON.stringify(this.list1).includes(model.name)) {
            this.secondList.push(model);
            this.list1.push(model);
          }
        }
      });

      console.log(this.taglist1);

      // load children 2
      this.secondList.forEach((element) => {
        let modelTag = [];

        modelTag = this.report.report.entries.filter((el) => {
          return el.request.url.includes(element.path);
        });
        console.log("Data", modelTag);

        // reconstruction du tag
        const LIST_TAG = [];

        modelTag.forEach((item) => {
          if (item.time < 300) {
            // Step 1
            const model = {
              name: item.request.url.substring(8, 32),
              parent: element.name,
              amount: item.time,
              path: element.path,
              entrie : []
            };

            if (!JSON.stringify(LIST_TAG).includes(model.name)) {
              LIST_TAG.push(model);

              this.list1.push(model);
              console.log(LIST_TAG);
            }
            // LIST_TAG.push(model);

            // this.list1.push(model);
          }
        });
        // console.log("tag list",LIST_TAG);

        const NextTagList = [];
        LIST_TAG.forEach((item) => {
          modelTag.forEach((value) => {
            if (value.time >= 300 && value.time < 600) {
              if (value.request.url.includes(item.name)) {
                const model = {
                  name: value.request.url.substring(11, 28),
                  parent: value.request.url.substring(8, 32),
                  amount: value.time,
                  path: item.path,
                  entrie : []
                };
                if (!JSON.stringify(NextTagList).includes(model.name)) {
                  NextTagList.push(model);
                  this.list1.push(model);
                }
              }
            }
          });
        });

        // Children 3 [600 - 900]
        const listBase = [];
        NextTagList.forEach((value) => {
          modelTag.forEach((item) => {
            if (item.time >= 600 && item.time < 900) {
              if (item.request.url.includes(value.name)) {
                // Step 1
                const model = {
                  name: item.request.url.substring(9, 33),
                  parent: item.request.url.substring(11, 28),
                  amount: item.time,
                  path: item.path,
                  entrie : []
                };

                listBase.push(model);
                console.log("listBase", listBase);

                this.list1.push(model);
                console.log(this.list1);
              }
            }
          });
        });
      });

      console.log("data list", this.list1);
      return this.list1;
    },

    // chart() {
    //   const svg = d3
    //     .select("#svg")
    //     .append("svg")
    //     .attr("width", innerWidth)
    //     .attr("height", innerHeight / 2);

    //   const group = svg.append("g").attr("width", 800).attr("height", 400);
    //   // var alphabet = group.append("g");
    //   // for (var i = 0; i < 26; ++i) {
    //   //   alphabet
    //   //     .append("text")
    //   //     .attr("x", 200 + i * 25)
    //   //     .attr("y", 50)
    //   //     .attr("font-family", "Courier")
    //   //     .attr("font-size", "40px")
    //   //     .text(String.fromCharCode(65 + Math.random() * 26));
    //   // }
    //   // alphabet
    //   //   .selectAll("text")
    //   //   .transition()
    //   //   .ease(d3.easeLinear)
    //   //   .duration(10000)
    //   //   .tween("text", function () {
    //   //     var currentValue = this.textContent.charCodeAt(0);
    //   //     var i = d3.interpolateRound(currentValue, 90); // 90 = Z
    //   //     return function (t) {
    //   //       this.textContent = String.fromCharCode(i(t));
    //   //     };
    //   //   });

    //   const random = d3.randomUniform(4, 150);
    //   console.log(random());

    //   // BarChar sample 1
    //   var xBar = d3.scaleBand().range([0, 400]).padding(0.1);
    //   var yBar = d3.scaleLinear().range([200, 0]);

    //   const data = [
    //     { name: "Sylnavy", value: 200 },
    //     { name: "valmy", value: 60 },
    //     { name: "TONY", value: 450 },
    //     { name: "Davy", value: 300 },
    //     { name: "J'aime", value: 180 },
    //     { name: "Aniel", value: 56 },
    //     { name: "Jean", value: 556 },
    //     { name: "Mardoché", value: 256 },
    //     { name: "Pierre", value: 100 },
    //     { name: "Dvy", value: 300 },
    //     { name: "J'ime", value: 180 },
    //     { name: "Aiel", value: 56 },
    //     { name: "Jan", value: 556 },
    //     { name: "Madoché", value: 256 },
    //     { name: "Pirre", value: 100 },
    //   ];
    //   //   // var data = getRandomData(4, 150);
    //   //   xBar.domain(data.map((d) => d.name));
    //   //   yBar.domain([0, 400]);

    //   //   group
    //   //     .selectAll(".bar")
    //   //     .data(data)
    //   //     .enter()
    //   //     .append("rect")
    //   //     .attr("class", "bar")
    //   //     .attr("x", (d) => xBar(d.name))
    //   //     .attr("width", xBar.bandwidth())
    //   //     .attr("height", (d) => yBar(d.value))
    //   //     .attr("y", (d) => 300 - yBar(d.value));

    //   //   console.log("Valmy");
    //   //   // var data = getRandomData(4, 150);
    //   //   xBar.domain(data.map((d) => d.name));
    //   //   group
    //   //   .selectAll("rect")
    //   // .data(data)
    //   // .transition()
    //   // .duration(1000)
    //   // .attr("y", 200)
    //   // .attr("height", 0)
    //   // .transition()
    //   // .duration(1000)
    //   // .attr("y", d => yBar(d.value))
    //   // .attr("height", d => 200 - yBar(d.value));
    //   //     // .selectAll("rect")
    //   //     // .data(data)
    //   //     // .transition()
    //   //     // .duration(1000)
    //   //     // .attr("y", (d) => yBar(d.value))
    //   //     // .attr("height", (d) => 200 - yBar(d.value));
    //   //   console.log("Sylnavy");
    //   // Line Chart sample 1

    //   var xLine = d3.scaleBand().range([0, 800]).padding(0.5);
    //   var yLine = d3.scaleLinear().range([200, 0]);
    //   var line = d3
    //     .line()
    //     .x((d) => xLine(d.name))
    //     .y((d) => yLine(d.value));
    //   // var data = getRandomData(100, 150);
    //   xLine.domain(data.map((d) => d.name));
    //   yLine.domain(d3.extent(data, (d) => d.value));

    //   var linePath = svg
    //     .append("path")
    //     .datum(data)
    //     .attr("d", line)
    //     .style("fill", "none")
    //     .style("stroke", "#3498db")
    //     .style("stroke-width", "1px")
    //     .attr("transform", "translate(150, 0)");

    //   var linePathLength = linePath.node().getTotalLength();
    //   console.log(linePathLength);
    //   linePath
    //     .attr("stroke-dasharray", linePathLength)
    //     .attr("stroke-dashoffset", linePathLength)
    //     .transition()
    //     .duration(4000)
    //     .ease(d3.easeLinear)
    //     .attr("stroke-dashoffset", 0);
    // },

    chart2() {
      const svg = d3
        .select("#svg")
        .append("svg")
        .attr("width", innerWidth)
        .attr("height", innerHeight);

      const group = svg
        .append("g")
        .attr("width", "100%")
        .attr("height", 800)
        .attr("transform", "translate(50, 50)");

      // data strat
      const strat = d3
        .stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent);

      // const tree = d3.tree().size([400, 300]);
      const tree = d3.tree().size([200, 300]);

      const colour = d3.scaleOrdinal([
        "green",
        "darkorange",
        "bluesky",
        "blue",
      ]);

      const div = d3
        .select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);

      // Update Data
      const update = (data) => {
        // remove current nodes
        group.selectAll(".node").remove();
        group.selectAll(".link").remove();
        group.selectAll("text").remove();

        colour.domain(data.map((d) => d.departement));

        // get updated root Node data
        const rootNode = strat(data);

        // TREE data
        const treeData = tree(rootNode);

        // Get nodes selection and join data
        const nodes = group.selectAll(".node").data(treeData.descendants());

        // GET LINK SELECTION and join data
        const links = group.selectAll(".link").data(treeData.links());

        // enter new links
        links
          .enter()
          .append("path")
          .transition()
          .duration(1000)
          .attr("class", "link")
          .attr("fill", "none")
          .attr("stroke", "#aaa")
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3
              .linkVertical()
              .x((d) => d.x)
              .y((d) => d.y)
          );

        const enterNodes = nodes
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
          .on("click", (d, i, n) => {});

        enterNodes
          .append("circle")
          .attr("r", "14")
          .attr("fill", "white")
          .style("stroke", "black")
          .style("cursor", "pointer")
          .style("stroke-width", 0.75);

        //  descendants
        this.list1.forEach((element) => {
          // step 1
          if (element.name == "Load Page") {
            element.ico = "src/assets/globe.ico";
          }
          if (
            element.name == "Google Tag Manager" ||
            element.name == "www.googletagmanager.com" ||
            element.name == ".googletagmanager"
          ) {
            element.ico = "src/assets/gtm.ico";
          }
          if (
            element.name == "Google Analytics" ||
            element.name == "www.google-analytics.com" ||
            element.name == ".google-analytics"
          ) {
            element.ico = "src/assets/ga.ico";
          }
        });

        const gtmanager = "src/assets/gtm.ico";
        const gtanal = "src/assets/ga.ico";
        const loadpage = "src/assets/globe.ico";

        enterNodes
          .append("image")
          .attr("xlink:href", (d, i, n) => {
            if (
              d.data.name.includes("googletagmanager") ||
              d.data.name.includes("Google Tag Manager")
            ) {
              return gtmanager;
            } else if (
              d.data.name.includes("google-analytics") ||
              d.data.name.includes("Google Analytics")
            ) {
              return gtanal;
            } else {
              return loadpage;
            }
          })
          .attr("x", -8)
          .attr("y", -8)
          .attr("width", 17)
          .attr("height", 17)
          .style("cursor", "pointer");

        // group
        //   .selectAll("image")
        //   .on("mouseover", function (event, d) {
        //     div.transition().duration(200).style("opacity", 0.9);
        //     div
        //       .html("Name : " + d.data.name)
        //       .style("left", event.pageX + 10 + "px")
        //       .style("top", event.pageY - 50 + "px");
        //   })
        //   .on("mouseout", function (event, d) {
        //     div.transition().duration(500).style("opacity", 0);
        //   });

        group
          .selectAll("image")
          .on("mouseover", function (event, d) {
            if (
              d.data.name.includes("googletagmanager") ||
              d.data.name.includes("Google Tag Manager")
            ) {
              console.log(d);
              div.transition().duration(200).style("opacity", 0.9);
              div
              .html(`<h3>we have found   ${d.data.entrie.length} tag(s) of Google Tag Manager </h3>
                  <br>
                  <p>A Tag Manager container can override any manually coded tags on a site or app, including tags from Google Ads, Google Analytics, Floodlight, and third-party tags. Learn how to use Tag Manager with Analytics Academy!... </p>
                  <br>
                  according to: https://support.google.com/tagmanager/`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 50 + "px");
            } else if (
              d.data.name.includes("google-analytics") ||
              d.data.name.includes("Google Analytics")
            ) {
              div.transition().duration(200).style("opacity", 0.9);
              div
                .html(`<h3>we have found   ${d.data.entrie.length} tag(s) of Google Analytics </h3>

                <br>
                <p>The Google tag lets you send data from your website to linked Google product destinations to help you measure the effectiveness of your website and ads. The Google tag is currently only accessible and configurable from Google Ads and Google Analytics... </p>

                <br>
                according to: https://support.google.com/analytics/`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 50 + "px");
            } else {
              div.transition().duration(200).style("opacity", 0.9);
              div
                .html(`${report.report.pages[0].title}`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 50 + "px");
            }
          })
          .on("mouseout", function (event, d) {
            div.transition().duration(500).style("opacity", 0);
          });
      };

      update(this.buildtree());
    },
  },
  mounted() {
    // this.chart();
    this.chart2();
  },
};
</script>

<style>
.chart-tooltip {
  position: absolute;
  opacity: 0.8;
  z-index: 1000;
  text-align: left;
  border-radius: 4px;
  border: 1px solid #070707;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  padding: 8px;
  color: #ffffff;
  font-weight: bold;
  background-color: rgb(13, 7, 104);
  font: 12px sans-serif;
  font-style: italic;
  max-width: 300px;
}

.chart-tooltip h3{
  font-size: 14px;
  text-align: center;
}
.chart-tooltip p{
  font-size: 12px;
  text-align: justify;
}


</style>
