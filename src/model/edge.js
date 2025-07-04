export class Edge {
    constructor(node, weight) {
        this.node = node; 
        this.weight = weight; 
    }

    toJSON() {
        return {
            to: this.node.label,
            weight: this.weight
        }
    }
}