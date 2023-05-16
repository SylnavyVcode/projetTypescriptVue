<template>
  <div>
    <div id="svg" class="pt-5"></div>
    <div class="container">
      <div class="row">
        <div class="col-6" id="svg2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
// import report from "./data/reports.json";
import report1 from "./data/report1.json";
import { renderTimeEntriesAction } from "../interval";
import { ListTag } from "../lib";
export default {
  data() {
    return {
      taglist1: [],
      tagOrder: 0,
      list1: [],
      secondList: [],
      report: report1,
    };
  },
  methods: {
    buildtree() {
      // load parent
      const model = {
        name: "Load Page",
        parent: "",
        amount: this.report.report.pages[0].startedDateTime,
        entries: [],
        path: "",
      };
      this.list1.push(model);

      // First Children
      ListTag.forEach((tag) => {
        const model = {
          name: tag.libelle,
          parent: "Load Page",
          amount: this.report.report.entries[0].time,
          path: tag.path,
          entries: this.report.report.entries.filter((entrie) => {
            return entrie.request.url.includes(tag.path);
          }),
        };

        this.taglist1.push(model);
       

        if (model.entries.length > 0) {
          if (!JSON.stringify(this.list1).includes(model.name)) {
            this.secondList.push(model);
            this.list1.push(model);
          }
        }
      });
      console.log(this.list1)
      console.log("ListTag 1", this.taglist1)
      return this.list1;
    },

    chart() {
      const width = innerWidth;
      const height = innerHeight;
      const svg = d3
        .select("#svg")
        .append("svg")
        .attr("width", width * 0.8)
        .attr("height", height * 0.5);

      const group = svg
        .append("g")
        .attr("width", width * 0.7)
        .attr("height", height * 0.4)
        .attr("transform", `translate(${width * 0.07}, ${height * 0.05})`);

      // data strat
      const strat = d3
        .stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent);

      // const tree = d3.tree().size([400, 300]);
      const tree = d3.tree().size([width * 0.6, height * 0.4]);

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

        const loadpage = "src/assets/imagesTree/globe.ico";
        const others = "src/assets/imagesTree/tag.ico";

        //  descendants
        this.list1.forEach((element) => {
          ListTag.forEach((list) => {
            if (list.libelle.includes(element.name)) {
              element.ico = list.icon;
              element.html = list.html;
            }
          });
        });
        console.log(this.list1);
        console.log(this.report.report.entries);

        enterNodes
          .append("image")
          .attr("xlink:href", (d, i, n) => {
            for (let index = 0; index < this.list1.length; index++) {
              if (this.list1[index].name.includes(d.data.name)) {
                return d.data.ico;
              }
            }
          })
          .attr("x", -10)
          .attr("y", -10)
          .attr("width", 20)
          .attr("height", 20)
          .style("cursor", "pointer");

        enterNodes
          .append("image")
          .attr("xlink:href", (d, i, n) => {
            if (d.data.name.includes("Load Page")) {
              return loadpage;
            }
          })
          .attr("x", -9)
          .attr("y", -9)
          .attr("width", 20)
          .attr("height", 20)
          .style("cursor", "pointer");

        group
          .selectAll("image")
          .on("mouseover", (event, d) => {
            for (let index = 0; index < this.list1.length; index++) {
              if (this.list1[index].name.includes(d.data.name)) {
                console.log(d.data)
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<p><span><img src=${d.data.ico} width="17" alt="" srcset=""> : We found   ${d.data.entries.length} tag(s) of ${d.data.name}</span></p> ${this.list1[index].html}`
                  )
                  .style("left", event.pageX - 120 + "px")
                  .style("top", event.pageY - 200 + "px");
              } 
              else if (d.data.name.includes("Load Page")) {
                // console.log(this.report.report.pages[0].title);
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(`${this.report.report.pages[0].title}`)
                  .style("left", event.pageX + 40 + "px")
                  .style("top", event.pageY - 10 + "px");
              }
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
    this.chart();
  },
};
</script>

<style>
.chart-tooltip {
  position: absolute;
  opacity: 0.8;
  z-index: 1000;
  text-align: center;
  text-align: left;
  border-radius: 4px;
  border: 1px solid #070707;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  padding: 8px;
  color: #ffffff;
  font-weight: bold;
  background-color: rgb(13, 7, 104);
  font: 10px sans-serif;
  font-style: italic;
  max-width: 250px;
}

.chart-tooltip span,
.chart-tooltip h3 {
  font-size: 11px;
  text-align: center;
}
.chart-tooltip p {
  font-size: 10px;
  text-align: justify;
  margin: 10px 0px;
}
.chart-tooltip p {
  font-size: 10px;
  text-align: justify;
  margin: 10px 0px;
}
</style>
