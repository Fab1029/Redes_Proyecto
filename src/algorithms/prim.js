import { Node } from "../model/node.js";
import { Edge } from "../model/edge.js";

export class PRIM {

    /*
        @param:
            graph list: Lista de nodos del grafo
        @return:
            tree list: Lista de nodos que forman el árbol de expansión mínima
    */    
    getTree(graph) {
        // Tree estructura {from, to, weight}
        let tree = [];
        let visited_nodes = [];

        visited_nodes.push(graph[0]);

        while (visited_nodes.length < graph.length) {
            
            let nodeEnd = null;
            let min_edge = {from: null, to: null, weight: Infinity};
            
            for (let node of visited_nodes) {

                for (let edge of node.edges) {

                    if (!visited_nodes.includes(edge.node)) {

                        if (edge.weight < min_edge.weight) {
                            nodeEnd = edge.node;
                            min_edge.from = node.label;
                            min_edge.to = edge.node.label;
                            min_edge.weight = edge.weight;
                        }
                    }
                }
            }

            tree.push(min_edge);
            visited_nodes.push(nodeEnd);
        }
        return tree;
    }
}


