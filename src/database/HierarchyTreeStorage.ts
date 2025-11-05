import { Db, ObjectId } from "mongodb";
import { MongoDBDatabase } from "./MongoDBDatabase";
import { IOffice } from "../entities/Office";
import { IStore } from "../entities/Store";

type HierarchyTreeNode =  IOffice | 
            IStore | 
            {
                type: string
            };

export class HierarchyTreeStorage {
    private db: Db;

    public constructor(db: MongoDBDatabase) {
        this.db = db.getDatabase();
    }

    public async pathExistsInHierarchyTree(startId: string, targetId: string): Promise<boolean> {
        const result = await this.db.collection("hierarchy_tree").aggregate<{_id: string, pathExists: boolean}>([
            {
                $match: {
                    _id: startId
                }
            },
            {
                $graphLookup: {
                    from: "hierarchy_tree",
                    startWith: "$childrenIds",
                    connectFromField: "childrenIds",
                    connectToField: "_id",
                    as: "path"
                }
            },
            {
                $addFields: {
                    pathExists: {
                        $or: [
                            { $in: [targetId, "$path._id"] },
                            { $eq: ["$_id", targetId] }
                        ]
                    }
                }
            },
            {
                $project: { _id: 1, pathExists: 1 }
            }
        ]).toArray();

        return result.length > 0 && result[0]?.pathExists === true;
    }

    public async getNodeWithDescendants(nodeId: string): Promise<string[]> {
        const result = await this.db.collection("hierarchy_tree").aggregate<{_id: string, descendantsIds: string[]}>([
            {
                $match: {
                    _id: nodeId
                }
            },
            {
                $graphLookup: {
                    from: "hierarchy_tree",
                    startWith: "$childrenIds",
                    connectFromField: "childrenIds",
                    connectToField: "_id",
                    as: "path"
                }
            },
            {
                $project: { _id: 1, descendantsIds: "$path._id" }
            }
        ]).toArray();

        if (result.length == 0 || !result[0]) {
            return [];
        }

        const nodeWithDescendats = [result[0]._id, ...result[0].descendantsIds];

        return nodeWithDescendats;
    }
}