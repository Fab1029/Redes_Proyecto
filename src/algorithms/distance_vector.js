export class DistanceVector {
    /*
        @param:
            graph list: Lista de nodos del grafo
        @return:
            iterations dict: Diccionario de iteraciones de vector distancia
    */
    initIterationsDistanceVector(graph) {
        let iterations = {};
        // Inicializar desde una iteracion de reconocimiento
        // de vector distancia de nodos
        iterations[0] = {};
        for (let j = 0; j < graph.length; j++) {
            const currentNode = graph[j];
            const currentLabel = currentNode.label;
            
            iterations[0][currentLabel] = Array.from({ length: graph.length }, () => [Infinity, null]);
        
            for (let i = 0; i < graph.length; i++) {
                const nodeIteration = graph[i];
                const labelNodeIteration = nodeIteration.label;

                if (currentNode === nodeIteration) {
                    iterations[0][currentLabel][i][0] = 0;
                    iterations[0][currentLabel][i][1] = currentLabel;
                }
                else if (currentNode.findNode(nodeIteration) !== undefined) { 
                    iterations[0][currentLabel][i][1] = labelNodeIteration;
                    iterations[0][currentLabel][i][0] = currentNode.findNode(nodeIteration).weight;
                }
            }
        }

        return iterations;
    }

    /*
        @param:
            graph list: Lista de nodos del grafo
            iterations dict: Diccionario de iteraciones de vector distancia
            iteration int: Iteración actual de vector distancia
        @return:
            iterations dict: Diccionario de iteraciones de vector distancia
    */
    getNextIterationDistanceVector(graph, iterations, iteration) {
        iterations[iteration] = {};

        for (const node of graph) {
            // Copiar la iteración anterior
            iterations[iteration][node.label] = iterations[iteration - 1][node.label].map(arr => [...arr]);

            for(let i = 0; i < graph.length; i++) {

                for(const edge of node.edges) {
                    const neighborTable = iterations[iteration - 1][edge.node.label];

                    if(neighborTable[i][0] < iterations[iteration][node.label][i][0]) {
                        iterations[iteration][node.label][i][1] = edge.node.label;
                        iterations[iteration][node.label][i][0] = neighborTable[i][0] + edge.weight;
                    }
                }
            }
        }

        return iterations;
    }

}