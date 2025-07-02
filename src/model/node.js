export class Node {
    constructor(label) {
        this.edges = [];
        this.label = label;
    }

    /*
        @param:
            edge Edge: Arista que se va a agregar al nodo
        @return:
            None
    */
    addEdge(edge) {
        this.edges.push(edge);
    }

    /*
        @param:
            node Node: Nodo al que se va a eliminar la arista
        @return:
            None
    */
    deleteEdge(node) {
        this.edges = this.edges.filter(edge => edge.node !== node);
    }

    /*
        @param:
            node Node: Nodo que se va a buscar
        @return:
            edge Edge: Arista que contiene el nodo especificado, o undefined si no se encuentra
    */
    findNode(node) {
        // Devolver edge que contiene el nodo especificado
        return this.edges.find(edge => edge.node === node);
    }

    /*
        @param:
            None
        @return:
            edge Edge: Arista que tiene el peso mínimo entre todas las aristas del nodo
    */
    findEdgeMinWeight() {
        let minEdge = null;
        
        for (let edge of this.edges) { 
            if (minEdge == null) {
                minEdge = edge;
            }
            else if (edge.weight < minEdge.weight) {
                minEdge = edge;
            }
        }
        // Devolver la arista con el peso mínimo
        return minEdge;
    }

}

