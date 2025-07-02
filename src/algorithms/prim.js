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
        let tree = [];
        let visited_nodes = [];
        let current_node = graph[0];

        while(true) {

            let minEdge = null;
            for (let edge of current_node.edges) {
                if (!visited_nodes.includes(edge.node)) { 
                    if (minEdge == null) {
                        minEdge = edge;
                    }
                    else if (edge.weight < minEdge.weight) {
                        minEdge = edge;
                    }
                }
            }
            
            // Si estamos en el ultimo nodo y no hay más aristas, salimos del bucle
            if (minEdge == null) break;

            let node = new Node(current_node.label);
            let nextNode = new Node(minEdge.node.label);

            node.addEdge(new Edge(nextNode, minEdge.weight));
            nextNode.addEdge(new Edge(node, minEdge.weight));

            tree.push(node);
            
            visited_nodes.push(current_node);

            current_node = minEdge.node;    
        }

        return tree;
    }
}


