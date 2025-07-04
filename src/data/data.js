import { Node } from '../model/node.js'
import { Edge } from '../model/edge.js'

export const loadGraph = () => {
  const data = JSON.parse(localStorage.getItem('graph') || '[]');
  const rawGraph = data.map(n => new Node(n.from));

  // Reconectar aristas
  data.forEach((nodeData) => {
    const fromNode = rawGraph.find(n => n.label === nodeData.from);
    nodeData.edges.forEach(edge => {
      const toNode = rawGraph.find(n => n.label === edge.to);
      if (toNode) {
        fromNode.addEdge(new Edge(toNode, edge.weight));
      }
    });
  });

  return rawGraph;
};

export const loadPloatNodes = () => {
  return JSON.parse(localStorage.getItem('plotNodes') || '[]');
};

export const loadPlotEdges = () => {
  return JSON.parse(localStorage.getItem('plotEdges') || '[]');
};

export const saveGraph = (rawGraph) => {
  const data = rawGraph.map(node => node.toJSON());
  localStorage.setItem('graph', JSON.stringify(data));
};

export const savePlotNodes = (plotNodes) => {
  localStorage.setItem('plotNodes', JSON.stringify(plotNodes));
};

export const savePlotEdges = (plotEdges) => {
  localStorage.setItem('plotEdges', JSON.stringify(plotEdges));
};