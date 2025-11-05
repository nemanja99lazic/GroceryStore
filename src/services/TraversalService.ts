import { HierarchyTreeStorage } from "../database/HierarchyTreeStorage";

export class TraversalService {
    private hierarchyTreeStorage: HierarchyTreeStorage;

    public constructor(hierarchyTreeStorage: HierarchyTreeStorage) {
        this.hierarchyTreeStorage = hierarchyTreeStorage;
    }

    public async isReachable(startNodeId: string, targetNodeId: string): Promise<boolean> {
        return await this.hierarchyTreeStorage.pathExistsInHierarchyTree(startNodeId, targetNodeId);
    }

    public async getOneNodeWithDescendatsIds(nodeId: string): Promise<string[]> {
       return await this.hierarchyTreeStorage.getNodeWithDescendants(nodeId);
    }
}