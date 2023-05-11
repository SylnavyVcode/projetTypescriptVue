<template>
  <div class="container">
    <div class="row">
      <div class="col text-center fw-bold">The second graph</div>
      <div id="svg1"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      duration: 250,
    };
  },
  methods: {
    async chart() {
      // Données pour le graphique
      const data = {
        name: "A",
        children: [
          {
            name: "B",
            children: [{ name: "C" }, { name: "D" }, { name: "E" }],
          },
          {
            name: "F",
            children: [{ name: "G" }, { name: "H" }],
          },
        ],
      };

      // Dimensions du graphique
      const width = innerWidth;
      const height = innerHeight;

      // Fonction pour créer l'arbre
      const treeLayout = d3.tree().size([height*0.5, width*0.5]);

      // Fonction pour dessiner les liens
      const linkLayout = d3
        .linkVertical()
        .x((d) => d.y)
        .y((d) => d.x);

      // Création de la racine de l'arbre
      const rootNode = d3.hierarchy(data);
      rootNode.x0 = height / 2;
      rootNode.y0 = 0;

      // Fonction pour mettre à jour le graphique
      function update(source) {
        // Calcul de la disposition de l'arbre
        const treeData = treeLayout(rootNode);

        // Obtention de la liste de tous les nœuds
        const nodes = treeData.descendants();

        // Obtention de la liste de tous les liens
        const links = treeData.links();

        // Sélection de l'élément SVG pour le graphique
        const svg = d3.select("#svg1").append('svg').attr('width', width).attr('height', height);

        // Groupe pour les liens
        const linkGroup = svg
          .selectAll("g.link")
          .data(links, (d) => d.target.id);

        // Création des nouveaux liens
        const linkEnter = linkGroup.enter().append("g").attr("class", "link");
        linkEnter
          .append("path")
          .attr("d", linkLayout)
          .style("fill", "none")
          .style("stroke", "#ccc");

        // Mise à jour des liens existants
        const linkUpdate = linkEnter.merge(linkGroup);
        linkUpdate.transition().duration(500).attr("d", linkLayout);

        // Suppression des liens inutiles
        const linkExit = linkGroup
          .exit()
          .transition()
          .duration(500)
          .attr("d", linkLayout)
          .remove();

        // Groupe pour les nœuds
        const nodeGroup = svg.selectAll("g.node").data(nodes, (d) => d.id);

        // Création des nouveaux nœuds
        const nodeEnter = nodeGroup
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${source.y0},${source.x0})`);
        nodeEnter
          .append("circle")
          .attr("r", 6)
          .style("fill", "#fff")
          .style("stroke", "#ccc")
          .on("click", toggleNode);
        nodeEnter
          .append("text")
          .attr("x", 9)
          .attr("y", 3)
          .style("font-size", "12px")
          .style("font-family", "sans-serif")
          .text((d) => d.data.name);

        // Mise à jour des nœuds existants
        const nodeUpdate = nodeEnter.merge(nodeGroup);
        nodeUpdate
          .transition()
          .duration(500)
          .attr("transform", (d) => `translate(${d.y},${d.x})`);

        // Suppression des nœuds inutiles

        const nodeExit = nodeGroup
          .exit()
          .transition()
          .duration(500)
          .attr("transform", (d) => translate(`${source.y},${source.x}`))
          .remove();

        // Mise à jour de la position des nœuds enfants lors du clic sur un nœud parent
        nodes.forEach((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });

        // Fonction pour cacher ou afficher les descendants d'un nœud
        function toggleNode(d) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        }
      }

      // Appel initial pour dessiner le graphique
      update(rootNode);
    },
  },
  mounted() {this.chart()},
};
</script>

<style></style>
