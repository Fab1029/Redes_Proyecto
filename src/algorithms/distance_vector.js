class DistanceVector {

    /*
        @param:
            graph list: Lista de nodos del grafo
            indexNode int: Posición del nodo en el grafo
        @return:
            neighbors list: Matriz de vecinos del nodo especificado
    */
    buildNeighborsTableForNode(graph, indexNode) { 
        const node = graph[indexNode];
        let neighbors = Array.from({length: graph.length}, () => Array.from({length: node.edges.length}, () => null));
        
        for (let i = 0; i < graph.length; i++) {
            for (let j = 0; j < node.edges.length; j++) {
                if (graph[i] === node.edges[j].node) {
                    neighbors[i][j] = 0;
                }
                else if (graph[i].findNode(node.edges[j].node) !== undefined) {
                    neighbors[i][j] = graph[i].findNode(node.edges[j].node).weight;
                }

            }
        }

        return neighbors;
    }

    /*
        @param:
            graph list: Lista de nodos del grafo
            matrixNeighbors list: Matriz de vecinos del nodo especificado
            indexNode int: Posición del nodo en el grafo
        @return:
            routingTable list: Tabla de enrutamiento del nodo especificado
    */
    buildRoutingTableForNode(graph, matrixNeighbors, indexNode) {
        const node = graph[indexNode];
        let routingTable = Array.from({length: graph.length}, () => Array.from({length: 2}, () => null));
        
        for (let i = 0; i < graph.length; i++) {
            if (graph[i] === node) {
                routingTable[i][0] = 0;
                routingTable[i][1] = node.label;
            }
            else {
                let minNode = null;
                let minWeight = Infinity;

                for (let j= 0; j < node.edges.length; j++) {
                    if (matrixNeighbors[i][j] !== null && matrixNeighbors[i][j] < minWeight) {
                        minNode = node.edges[j].node;
                        minWeight = matrixNeighbors[i][j];
                    }
                }

                if (minNode !== null) {
                    routingTable[i][1] = minNode.label;
                    routingTable[i][0] = minWeight + node.findNode(minNode).weight;
                }

            }
            
        }

        return routingTable;
    }

}