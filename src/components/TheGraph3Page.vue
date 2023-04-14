<template>
  <div>
    <div id="svg" class="pt-5"></div>
    <div id="svg2"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import report from "./data/reports.json";
import { ListTag } from "../lib";
export default {
  data() {
    return {
      list1: [],
      secondList:[],
      thirdList:[],
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
    buildLabelTag() {},
    buildtree() {
      
      // load parent
      const model = {
        name: "Load Page",
        parent: "",
        amount: this.report.report.pages[0].startedDateTime,
        path:""
      };
      this.list1.push(model);

      // load children 1
      this.report.report.entries.forEach((entrie, i) => {
        let label = null;

        label = ListTag.filter((tag, index) => {
          return entrie.request.url.includes(tag.path);
        });
        // console.log(label);

        if (label.length != 0) {
          const model = {
            name: label[0].libelle,
            parent: "Load Page",
            amount: this.report.report.entries[i].time,
            path: label[0].path
          };
          
          if (!JSON.stringify(this.list1).includes(model.name)) {
            this.secondList.push(model)
            this.list1.push(model);
          }
        }
      });
      
      this.secondList.forEach(element => {
        console.log(element);
        let  modelTag = [];

        modelTag = this.report.report.entries.filter(el => {
          // console.log(el);
          return el.request.url.includes(element.path)
        });

        console.log("Data", modelTag);

        // reconstruction du tag
        const LIST_TAG = []

        console.log("Libelle intries", modelTag);
        
        modelTag.forEach((item) => {
          const model = {
            name: item.request.url.substring(8, 32),
            parent: element.name,
            amount: 0,
          };
          this.list1.push(model);
        })

        
      });

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
        .attr("width", 800)
        .attr("height", 800)
        .attr("transform", "translate(50, 50)");

      // data strat
      const strat = d3
        .stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent);

      const tree = d3.tree().size([700, 800]);

      const colour = d3.scaleOrdinal([
        "green",
        "darkorange",
        "bluesky",
        "blue",
      ]);

      // Update Data
      const update = (data) => {
        // remove current nodes
        group.selectAll(".node").remove();
        group.selectAll(".link").remove();
        group.selectAll("rect").remove();
        group.selectAll("text").remove();

        colour.domain(data.map((d) => d.departement));
        // get updated root Node data
        const rootNode = strat(data);

        // TREE data
        const treeData = tree(rootNode);
        // console.log(treeData);

        // Get nodes selection and join data
        const nodes = group.selectAll(".node").data(treeData.descendants());

        // GET LINK SELECTION and join data
        const links = group.selectAll(".link").data(treeData.links());
        // console.log(links);
        // console.log(treeData.links());

        // enter new links
        links
          .enter()
          .append("path")
          .transition()
          .duration(3000)
          .attr("class", "link")
          .attr("fill", "none")
          .attr("stroke", "#aaa")
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x)
          );

        const enterNodes = nodes
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

        // append rects to enter nodes
        // enterNodes
        //   .append("rect")
        //   .attr("fill", (d) => colour(d.depth))
        //   // .attr("fill", (d) => colour(d.data.departement))
        //   .attr("stroke", "#555")
        //   .attr("transform", (d) => {
        //     let x = -(d.data.name.length * 20) / 2;
        //     return `translate(${x}, -30)`;
        //   })
        //   .attr("stroke-width", 2)
        //   .attr("height", 50)
        //   .attr("width", (d) => d.data.name.length * 20);

        // append name text
        enterNodes
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", (d) => colour(d.depth))
          .style("font-size", 19)
          .text((d) => d.data.name);

        enterNodes;
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

<style></style>
