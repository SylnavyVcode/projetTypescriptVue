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
      gta: 0,
      gtm: 0,
      gtxi: 0,
      adob: 0,
      acquisio: 0,
      acxiom: 0,
      addThi: 0,
      adenti: 0,
      gtOthers: 0,
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
        path: "",
      };
      this.list1.push(model);

      // load children 1
      this.report.report.entries.forEach((entrie, i) => {
        let label = null;

        label = ListTag.filter((tag, index) => {
          return entrie.request.url.includes(tag.path);
        });

        if (label.length != 0) {
          const model = {
            name: label[0].libelle,
            parent: "Load Page",
            amount: this.report.report.entries[i].time,
            path: label[0].path,
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

      let googleTagMag = 0;
      let googleTagAnal = 0;
      let xitiTag = 0;
      let adob = 0;
      let others = 0;
      let Acquisio = 0;
      let Acxiom = 0;
      let AddThi = 0;
      let Adenti = 0;
      for (let index = 0; index < this.taglist1.length; index++) {
        switch (true) {
          case this.taglist1[index].path.includes(
            "https://www.googletagmanager.com"
          ):
            this.gtm = ++googleTagMag;
            break;
          case this.taglist1[index].path.includes(
            "https://www.google-analytics.com"
          ):
            this.gta = ++googleTagAnal;
            break;
          case this.taglist1[index].path.includes("https://logs1412.xiti.com"):
            this.gtxi = ++xitiTag;
            break;
          case this.taglist1[index].path.includes("adobe"):
            this.adobe = ++adob;
            break;
          case this.taglist1[index].path.includes("http://adentifi"):
            this.adenti = ++Adenti;
            break;
          case this.taglist1[index].path.includes("http://r.dlx.addthis"):
            this.addThi = ++AddThi;
            break;
          case this.taglist1[index].path.includes("http://p.acxiom-online"):
            this.acxiom = ++Acxiom;
            break;
          case this.taglist1[index].path.includes("http://www.acquisio"):
            this.acquisio = ++Acquisio;
            break;
          default:
            this.gtOthers = ++others;
        }
        // acquisio
        // acxiom
        // addThi
        // adenti
      }

      // // load children 2
      // this.secondList.forEach((element) => {
      //   let modelTag = [];

      //   modelTag = this.report.report.entries.filter((el) => {
      //     return el.request.url.includes(element.path);
      //   });

      //   // reconstruction du tag
      //   const LIST_TAG = [];

      //   modelTag.forEach((item) => {
      //     if (item.time < 300) {
      //       // Step 1
      //       const model = {
      //         name: item.request.url.substring(8, 32),
      //         parent: element.name,
      //         amount: item.time,
      //         path: element.path,
      //         entrie : ListTag.filter((tag)=>{
      //         return this.report.report.entries[0].request.url.includes(tag.path)

      //       })
      //       };

      //       if (!JSON.stringify(LIST_TAG).includes(model.name)) {
      //         LIST_TAG.push(model);

      //         this.list1.push(model);
      //         console.log(LIST_TAG);
      //       }
      //     }
      //   });

      //   const NextTagList = [];
      //   LIST_TAG.forEach((item) => {
      //     modelTag.forEach((value) => {
      //       if (value.time >= 300 && value.time < 600) {
      //         if (value.request.url.includes(item.name)) {
      //           const model = {
      //             name: value.request.url.substring(11, 28),
      //             parent: value.request.url.substring(8, 32),
      //             amount: value.time,
      //             path: item.path,
      //             entrie : ListTag.filter((tag)=>{
      //         return this.report.report.entries[0].request.url.includes(tag.path)

      //       })
      //           };
      //           if (!JSON.stringify(NextTagList).includes(model.name)) {
      //             NextTagList.push(model);
      //             this.list1.push(model);
      //           }
      //         }
      //       }
      //     });
      //   });

      //   // Children 3 [600 - 900]
      //   const listBase = [];
      //   NextTagList.forEach((value) => {
      //     modelTag.forEach((item) => {
      //       if (item.time >= 600 && item.time < 900) {
      //         if (item.request.url.includes(value.name)) {
      //           // Step 1
      //           const model = {
      //             name: item.request.url.substring(9, 33),
      //             parent: item.request.url.substring(11, 28),
      //             amount: item.time,
      //             path: item.path,
      //             entrie : ListTag.filter((tag)=>{
      //         return this.report.report.entries[0].request.url.includes(tag.path)

      //       })
      //           };

      //           listBase.push(model);
      //           console.log("listBase", listBase);

      //           this.list1.push(model);
      //           console.log(this.list1);
      //         }
      //       }
      //     });
      //   });
      // });

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

        const gtmanager = "src/assets/gtm.ico";
        const gtanal = "src/assets/ga.ico";
        const loadpage = "src/assets/globe.ico";
        const others = "src/assets/tag.ico";


        //  descendants
        this.list1.forEach((element) => {
          ListTag.forEach((list)=>{
            if(list.libelle.includes(element.name)){
            element.ico = list.icon
            }
          })
        });
        console.log(this.list1);

        //  descendants
        // this.list1.forEach((element) => {
        //   // step 1
        //   switch (true) {
        //     case element.name == "Load Page":
        //       element.ico = loadpage;
        //       break;
        //     case element.name == "Google Tag Manager":
        //       element.ico = gtmanager;
        //       break;
        //     case element.name == "Google Analytics":
        //       element.ico = gtanal;
        //       break;

        //     default:
        //       element.ico = others;
        //       break;
        //   }
        // });

        enterNodes
          .append("image")
          .attr("xlink:href", (d, i, n) => {
            if (d.data.name.includes("Google Tag Manager")) {
              return gtmanager;
            } else if (d.data.name.includes("Google Analytics")) {
              return gtanal;
            } else if (d.data.name.includes("Load Page")) {
              return loadpage;
            } else {
              return others;
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
            switch (true) {
              case d.data.name.includes("Google Tag Manager"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<p><span><img src="src/assets/gtm.ico" width="17" alt="" srcset=""> : We found   ${this.gtm} tag(s) of Google Analytics</span></p>
          
          <strong>Description :</strong> <br>
          Tag Manager container can override any manually coded tags on a site or app, including tags from Google Ads, Google Analytics, Floodlight, and third-party tags. Learn how to use Tag Manager with Analytics Academy!... </p>
            according to: https://support.google.com/tagmanager/`
                  )
                  .style("left", event.pageX - 120 + "px")
                  .style("top", event.pageY - 200 + "px");
                break;

              case d.data.name.includes("Google Analytics"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<p><span><img src="src/assets/ga.ico" width="17" alt="" srcset=""> : We found   ${this.gta} tag(s) of Google Analytics</span></p>
          
          <strong>Description :</strong> <br>
          <p>The Google tag lets you send data from your website to linked Google product destinations to help you measure the effectiveness of your website and ads. The Google tag is currently only accessible and configurable from Google Ads and Google Analytics... </p>

          according to: https://support.google.com/analytics/`
                  )
                  .style("left", event.pageX - 120 + "px")
                  .style("top", event.pageY - 220 + "px");
                break;

              case d.data.name.includes("Acquisio"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<h3>we found   ${this.acquisio} tag(s) of Acquisio </h3>

          <p>From search engine and social media marketing to programmatic buying, our team of experts helps you electrify and simplify managing... </p>

          according to: https://www.acquisio.com/fr/`
                  )
                  .style("left", event.pageX - 80 + "px")
                  .style("top", event.pageY - 170 + "px");
                break;

              case d.data.name.includes("Acxiom"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<h3>we found   ${this.acxiom} tag(s) of Acxiom </h3>

          <p>Acxiom's data and technology transform marketing – giving our clients the power to manage audiences, personalize customer experiences and create profitable .... </p>

          according to: https://www.acxiom.com/`
                  )
                  .style("left", event.pageX - 80 + "px")
                  .style("top", event.pageY - 170 + "px");
                break;

              case d.data.name.includes("AddThis"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<h3>we found   ${this.addThi} tag(s) of AddThis </h3>

          <p>Ready-made solution: AddThis tracking recipe for your Google Tag Manager container. Download it, import and configure in minutes... </p>

          according to: https://www.analyticsmania.com/google-tag-manager-recipes/addthis/`
                  )
                  .style("left", event.pageX - 80 + "px")
                  .style("top", event.pageY - 170 + "px");
                break;

              case d.data.name.includes("Adentifi"):
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(
                    `<h3>we found   ${this.adenti} tag(s) of Adentifi </h3>`
                  )
                  .style("left", event.pageX - 80 + "px")
                  .style("top", event.pageY - 170 + "px");
                break;

              default:
                div.transition().duration(200).style("opacity", 0.9);
                div
                  .html(`${this.report.report.pages[0].title}`)
                  .style("left", event.pageX + 30 + "px")
                  .style("top", event.pageY - 20 + "px");
                break;
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
