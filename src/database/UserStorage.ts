import { Db } from "mongodb";
import { IUser } from "../entities/user/User";
import { MongoDBDatabase } from "./MongoDBDatabase";
import { UserType } from "../entities/user/User.type";

export class UserStorage{
    private db: Db;

    public constructor(db: MongoDBDatabase) {
        this.db = db.getDatabase();
    }
    
    public async createUser(user: IUser): Promise<boolean> {
        return (await this.db.collection('users').insertOne(user)).acknowledged;
    }

    public async updateUser(user: IUser): Promise<boolean> {
        return (await this.db.collection('users').updateOne(
            { username: user.username },
            { 
                $set: {
                    name: user.name,
                    password: user.password,
                    type: user.type,
                    workplaceId: user.workplaceId
                }
            }
        )).acknowledged;
    }

    public async deleteUser(username: string): Promise<boolean> {
        return (await this.db.collection('users').deleteOne(
            { username}
        )).acknowledged;
    }

    public async getUser(username: string): Promise<IUser | null> {
        return await this.db.collection<IUser>('users').findOne({username});
    }

    public async getUsersForNodes(nodeIds: string[], userType: UserType): Promise<Omit<IUser, "password">[]> {
        const users = await this.db.collection('users').aggregate<Omit<IUser, "password">>([
            {
                $match: {
                    workplaceId: { $in: nodeIds},
                    type: userType
                }
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    type: 1,
                    workplaceId: 1
                }
            }
        ]
        ).toArray();

        return users;
    }
}