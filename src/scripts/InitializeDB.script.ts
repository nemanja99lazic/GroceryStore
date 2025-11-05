import { MongoDBDatabase } from "../database/MongoDBDatabase";
import { IOffice } from "../entities/Office";
import { IStore } from "../entities/Store";
import { Utils } from "../utils/Utils";

type HierarchyTreeNode =  IOffice | 
            IStore | 
            {
                type: string
            };
            
async function main(): Promise<number> {
    const mongoDBDatabase = new MongoDBDatabase();

    await mongoDBDatabase.setup();

    try {
        console.log("Hierarchy tree initialization started.");

        const numberOfCreatedUsers = await mongoDBDatabase.getDatabase().collection('users').countDocuments();

        if (numberOfCreatedUsers === 0) {
            await mongoDBDatabase.getDatabase().collection('users').insertOne({
                name: 'admin',
                username: 'admin',
                password: await Utils.hashPassword('admin'),
                type: "manager",
                workplaceId: "Srbija"
            });
        }

        await mongoDBDatabase.getDatabase().collection('hierarchy_tree').deleteMany();

        await mongoDBDatabase.getDatabase().collection<HierarchyTreeNode>('hierarchy_tree').insertMany([
            {
                _id: "Srbija",
                name: "Srbija",
                type: "office",
                childrenIds: ["Vojvodina", "GradBeograd"],
            },
            {
                _id: "Vojvodina",
                name: "Vojvodina",
                type: "office",
                childrenIds: ["Severnobackiokrug", "Juznobackiokrug"],
            },
            {
                _id: "GradBeograd",
                name: "Grad Beograd",
                type: "office",
                childrenIds: ["NoviBeograd", "Vracar"],
            },
            {
                _id: "Severnobackiokrug",
                name: "Severnobacki okrug",
                type: "office",
                childrenIds: ["Subotica"],
            },
            {
                _id: "Juznobackiokrug",
                name: "Juznobacki okrug",
                type: "office",
                childrenIds: ["NoviSad"],
            },
            {
                _id: "NoviBeograd",
                name: "Novi Beograd",
                type: "office",
                childrenIds: ["Bezanija"],
            },
            {
                _id: "Vracar",
                name: "Vracar",
                type: "office",
                childrenIds: ["Neimar", "Crvenikrst"],
            },
            {
                _id: "Subotica",
                name: "Subotica",
                type: "office",
                childrenIds: ["Radnja1"],
            },
            {
                _id: "NoviSad",
                name: "Novi Sad",
                type: "office",
                childrenIds: ["Detelinara", "Liman"],
            },
            {
                _id: "Bezanija",
                name: "Bezanija",
                type: "office",
                childrenIds: ["Radnja6"],
            },
            {
                _id: "Neimar",
                name: "Neimar",
                type: "office",
                childrenIds: ["Radnja7"],
            },
            {
                _id: "Crvenikrst",
                name: "Crveni krst",
                type: "office",
                childrenIds: ["Radnja8", "Radnja9"],
            },
            {
                _id: "Radnja1",
                name: "Radnja 1",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja6",
                name: "Radnja 6",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja7",
                name: "Radnja 7",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja8",
                name: "Radnja 8",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja9",
                name: "Radnja 9",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Detelinara",
                name: "Detelinara",
                type: "office",
                childrenIds: ["Radnja2", "Radnja3"],
            },
            {
                _id: "Liman",
                name: "Liman",
                type: "office",
                childrenIds: ["Radnja4", "Radnja5"],
            },
            {
                _id: "Radnja2",
                name: "Radnja 2",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja3",
                name: "Radnja 3",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja4",
                name: "Radnja 4",
                type: "store",
                childrenIds: [],
            },
            {
                _id: "Radnja5",
                name: "Radnja 5",
                type: "store",
                childrenIds: [],
            },
        ]
        );

        console.log("Hierarchy tree initialization finished.");
    } catch (error: any) {
        console.error(
            {
                message: `An error happened during hierarchy tree initialization: ${error?.message ?? "UNKNOWN ERROR"}`,
                stack: error?.stack,
                statusCode: error?.statusCode
            }
        );

        return 1;
    } finally {
        await mongoDBDatabase.closeClient();
    }

    return 0;
}

main().then((res) => process.exit(res));