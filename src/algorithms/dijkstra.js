export class Dijkstra {

    /*
        @param:
            graph list: Lista de nodos del grafo
            start Node: Nodo de inicio del algoritmo de Dijkstra
        @return:
            index_row int: Indice del nodo a buscar
    */
    getRowIndex(graph, start) { 
        return graph.indexOf(start);
    }

    /*
        @param:
            index_row int: Indice del nodo a buscar
            column_index_start int: Indice de la columna a partir de la cual se van a marcar las columnas restantes como null
            dijkstra_matrix list: Matriz de Dijkstra
        @return:
            dijkstra_matrix matriz: Matriz de Dijkstra con las columnas restantes marcadas como null
    */
    paddingDefinitiveRow(index_row, column_index_start, dijkstra_matrix) {
        for (let j = column_index_start; j < dijkstra_matrix[index_row].length; j++) {
            dijkstra_matrix[index_row][j] = null;
        }
        
        return dijkstra_matrix;
    }

    /*
        @param:
            index_row int: Indice del nodo a buscar
            dijkstra_matrix list: Matriz de Dijkstra
        @return:
            true | false: Si la fila es definitiva o no
    */
    isDefinitiveRow(index_row, dijkstra_matrix) {
        for (let j = 0; j < dijkstra_matrix[index_row].length; j++) {
            if (dijkstra_matrix[index_row][j] !== undefined && 
                dijkstra_matrix[index_row][j]['isDefinitive'] === true) {
                return true;
            }
        }

        return false;
    }

    /*
        @param:
            index_row int: Indice del nodo a buscar
            start_node Node: Nodo de inicio del algoritmo de Dijkstra
            graph_length int: Longitud del grafo
        @return:
            dijkstra_matrix matriz: Matriz de Dijkstra inicializada
    */
    initializeMatrix(index_row, start_node, graph_length) {
        let dijkstra_matrix = Array.from({length: graph_length}, () => 
            Array.from({length: graph_length}, () => undefined)
        );

        // Inicializar celda definitiva
        dijkstra_matrix[index_row][0] = {'weight': 0, 'node': start_node, 'isDefinitive': true};

        // Marcar columnas restantes con null por el caso de inicio
        dijkstra_matrix = this.paddingDefinitiveRow(index_row, 1, dijkstra_matrix);
        
        return dijkstra_matrix;

    }

    /*
        @param:
            dijkstra_matrix matrix: Matriz de Dijkstra
            graph_length int: Longitud del grafo
        @return:
            [index_row int, min_node object]: Indice del nodo definitivo y el nodo con el peso minimo
    */
    getDefinitiveNode(dijkstra_matrix, graph_length) {
        let index_row = 0;
        let min_node = null;
        
        // Obtener nodo definitivo
        for (let i = 0; i < graph_length; i++) {
            
            if (!this.isDefinitiveRow(i, dijkstra_matrix)) {
                
                for (let j = 0; j < graph_length; j++) {
                    if (dijkstra_matrix[i][j] !== undefined) {
                        if (min_node == null) {
                            index_row = i;
                            min_node = dijkstra_matrix[i][j];
                        }

                        else if (dijkstra_matrix[i][j]['weight'] < min_node['weight']) {
                            index_row = i;
                            min_node = dijkstra_matrix[i][j];
                        }
                    }
                }
            }
        }

        return [index_row, min_node];
    }

    /*
        @param:
            dijkstra_matrix matrix: Matriz de Dijkstra
            graph list: Lista de nodos del grafo
            start Node: Nodo de inicio del algoritmo de Dijkstra
            end Node: Nodo de fin del algoritmo de Dijkstra
        @return:
            path Set: Conjunto de nodos que forman el camino desde el nodo de inicio hasta el nodo de fin
    */
    getPath(dijkstra_matrix, graph ,start, end) {
        let path = [];
        path.push(end);
        
        while(path[path.length - 1] !== start) {

            let index_row = this.getRowIndex(graph, path[path.length - 1]);
      

            for (let j = 0; j < graph.length; j++) {
                if (dijkstra_matrix[index_row][j] !== null && 
                    dijkstra_matrix[index_row][j] !== undefined && 
                    dijkstra_matrix[index_row][j]['isDefinitive'] === true) {
                    
                    path.push(dijkstra_matrix[index_row][j]['node']);

                }
            }
            
        }

        return new Set(path.reverse().map(node => node.label));
    }

    /*
        @param:
            dijkstra_matrix matrix: Matriz de Dijkstra
        @return:
            matrix: Matriz de Dijkstra traducida a un formato legible
    */
    translateDijkstraMatrix(dijkstra_matrix) { 
        const definitive = '*';
        const infinity = '\u221E';
        
        // Hacer copia de la matriz para no modificar la original
        const matrix = dijkstra_matrix.map(row => row.slice());
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === undefined) {
                    matrix[i][j] = infinity;
                } 
                else if (matrix[i][j] === null) {
                    matrix[i][j] = definitive;
                } 
                else {
                    matrix[i][j] = `[${matrix[i][j]['weight']}, ${matrix[i][j]['node'].label}]`;
                }
            }
        }

        return matrix;
    }

    /*
        @param:
            graph list: Lista de nodos del grafo
            start Node: Nodo de inicio del algoritmo de Dijkstra
        @return:
            dijkstra_matrix matriz: Matriz de Dijkstra
    */
    buildDijkstraMatrix(graph, start) { 
        let row_index = this.getRowIndex(graph, start);
        let dijkstra_matrix = this.initializeMatrix(row_index, start, graph.length);

        
        for (let j = 0; j < graph.length - 1; j++) {
            for (let i = 0; i < graph.length; i++) { 
                
                if (!this.isDefinitiveRow(i, dijkstra_matrix)) {
                    // Obtener arista si existe conexion entre los dos nodos
                    let edge = graph[row_index].findNode(graph[i]);
                    
                    if (edge !== undefined) { 
                        
                        dijkstra_matrix[i][j] = {
                            'weight': dijkstra_matrix[row_index][j]['weight'] + edge.weight,
                            'node': graph[row_index],
                            'isDefinitive': false
                        }
                           
                    }

                }
                
            }
            
            // Nueva fila de dijkstra_matrix y nodo minimo
            const definitive_node = this.getDefinitiveNode(dijkstra_matrix, graph.length);
            row_index = definitive_node[0];
            const min_node = definitive_node[1];

            // Definir nodo definitivo
            dijkstra_matrix[row_index][j + 1] = min_node;
            dijkstra_matrix[row_index][j + 1]['isDefinitive'] = true;

            // Marcar columnas restantes con null si es definitivo
            dijkstra_matrix = this.paddingDefinitiveRow(row_index, j + 2, dijkstra_matrix);

        }

        return dijkstra_matrix;
    }
}


