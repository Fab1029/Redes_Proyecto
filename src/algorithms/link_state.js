export class LinkState {

    /*
        @param:
            graph list: Lista de nodos del grafo
        @return:
            nodesPlot list: Lista de nodos segun su estructura para react flow
    */ 
    getPlotNodes(graph) {
        let nodesPlot = [];

        for (let node of graph) {
            const newPlotNode = {
                id: node.label,
                position: { x: Math.random() * 500, y: Math.random() * 500 },
                data: { label: node.label },
                style: {
                    width: '5rem',
                    height: '5rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10rem',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    border: '0.3px solid black'
                },  
                selectable: true
            };

            nodesPlot.push(newPlotNode);
        }

        return nodesPlot;
    }

    /*
        @param:
            graph list: Lista de nodos del grafo
        @return:
            edgesPlot list: Lista de edges segun su estructura para react flow
    */ 
    getEdgesPlot(graph) {
        let edgesPlot = [];

        for (let node of graph) {
            for (let edge of node.edges) {
                const hasEdge = edgesPlot.find((edgePlot) => 
                    (edgePlot.source === node.label && edgePlot.target === edge.node.label) || 
                    (edgePlot.source === edge.node.label && edgePlot.target === node.label)
                );

                if (!hasEdge) {
                    console.log('Entro');
                    const newEdge = {
                        id: `${node.label}-${edge.node.label}`,
                        source:node.label,
                        target:edge.node.label,
                        animated: true,
                        type: 'straight',
                        label: edge.weight.toString()
                    };
                    edgesPlot.push(newEdge);
                }

            }
        }

        return edgesPlot;
    }
}