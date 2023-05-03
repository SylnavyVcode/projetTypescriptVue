<template>
    <div id="svg2"></div>
</template>

<script>
import * as d3 from "d3";
import report from "../components/data/reports.json";
import { renderTimeEntriesAction } from "../interval";
import { ListTag } from "../lib";
export default {
  data() {
    return {
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
      dbase: [
        {
          name: "Top Level",
          parent: "null",
          children: [
            {
              name: "Level 2: A",
              parent: "Top Level",
              children: [
                {
                  name: "Son of A",
                  parent: "Level 2: A",
                },
                {
                  name: "Daughter of A",
                  parent: "Level 2: A",
                },
              ],
            },
            {
              name: "Level 2: B",
              parent: "Top Level",
            },
          ],
        },
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
        path: "",
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
          };

          if (!JSON.stringify(this.list1).includes(model.name)) {
            this.secondList.push(model);
            this.list1.push(model);
          }
        }
      });

      // load children 2
      this.secondList.forEach((element) => {
        let modelTag = [];
        let entrieTimeInf = [];
        let entrieTimeMoy = [];
        let entrieTimeSup = [];

        modelTag = this.report.report.entries.filter((el) => {
          return el.request.url.includes(element.path);
        });
        console.log("Data", modelTag);

        // reconstruction du tag
        const LIST_TAG = [];

        modelTag.forEach((item) => {
          if (item.time < 100) {
            // Step 1

            const model = {
              name: item.request.url.substring(8, 32),
              parent: element.name,
              amount: 0,
              path: element.path,
            };
            LIST_TAG.push(model);

            this.list1.push(model);
          }
        });
      });

      return this.list1;
    },
    chart2() {
      const margin = {top: 10, right: 120, bottom: 10, left: 40};
      const width = innerWidth - margin.top - margin.left;
     
      const dy = width / 6;
      const dx = 10;

      const svg = d3
        .select("#svg2")
        .append("svg")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .style("user-select", "none");

      const data = d3.hierarchy(this.dbase[0]);

      data.x0 = dy / 2;
      data.y0 = 0;

      const tree = d3.tree().size([dx, dy])

      const gLink = svg
        .append("g")
        .attr("width", innerWidth-300)
        .attr("height", innerHeight-200)
        .attr("transform", "translate(50, 50)")
        .attr("fill", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

      const gNode = svg
        .append("g")
        .attr("width", innerWidth-300)
        .attr("height", innerHeight-200)
        .attr("transform", "translate(50, 50)")
        .style("cursor", "pointer")
        .style("pointer-events", "all");

      // the children of the graph
      data.descendants().forEach((base, i) => {
        base.id = i;
        base._children = base.children;
        if (base.depth && base.data.name.length !== 7) {base.children = null};
      });

      const color = d3.scaleOrdinal(["green", "darkorange", "bluesky", "blue"]);

      // Update Data
      const update = (source) => {
        // remove current nodes
        // svg.selectAll(".node").remove();
        // svg.selectAll(".link").remove();
        // svg.selectAll("rect").remove();
        // svg.selectAll("text").remove();

        // color.domain(data.map((d) => d.departement));

        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        console.log(duration);

        const diagonal = d3.linkHorizontal().x(d => d.y)

        const nodes = data.descendants().reverse();
        const links = data.links()
        console.log(links);

        tree(data);
        console.log("tree des données", tree(data));

        let left = data;
        let right = data;

        data.eachBefore(node => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        })
        
        const height = right.x - left.x + margin.top + margin.bottom

        const transition = svg.transition()
        .duration(duration)
        .attr("width", innerWidth-margin.top)
        .attr("height", innerHeight-margin.bottom);

        // Update the nodes
        const node = gNode.selectAll("g")
        .data(nodes, d => d.id)
        console.log(node);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0}, ${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d)=> {
          d.children = d.children ? null : d._children;
          update(d)
        });
        // console.log("node Enter Data", nodeEnter);

        nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")

        // TRANSITION NODES TO THEIR NEW POSITION.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d=> `translate(${d.y}, ${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1)

        // TRANSITION EXITING NODES TO THE PARENT'S NEW POSITION.
        const nodeExit = node.merge(nodeEnter).transition(transition)
        .attr("transform", d=> `translate(${source.y}, ${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)

        // update the links...
        const link = gLink.selectAll("path")
        .data(links, d => d.target.id)

        console.log(link);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
        .attr("d", d=> {
          const el = {x:source.x0, y:source.y0};
          return diagonal({source:el}, {target:el});
        });

        // transition links to their new position.
        link.merge(linkEnter).transition(transition)
        .attr("d", diagonal)

        // transition existing nodes to the parent's new position.
        link.exit().transition(transition).remove()
        .attr("d", d=> {
          const el = {x:source.x, y:source.y};
          return diagonal({source:el}, {target:el});
        });

        // stash the old positions for transition.
        data.eachBefore(d => {
          d.x0 = d.x;
          d.y0 = d.y;
        })

      };
      update(data);
    },
  },
  mounted() {
    this.chart2();
  },
};
</script>

<style>
/* .circle{
  fill: url("../assets/gtm.png");
} */
</style>
