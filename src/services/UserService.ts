import { UserStorage } from "../database/UserStorage";
import { IUser } from "../entities/user/User";
import { UserType } from "../entities/user/User.type";
import { Utils } from "../utils/Utils";

export class UserService {
    private userStorage: UserStorage;

    public constructor(userStorage: UserStorage) {
        this.userStorage = userStorage;
    }

    public async createUser(name: string, username: string, password: string, type: UserType, workplaceId: string): Promise<void> {
        password = await Utils.hashPassword(password);

        const existingUser = await this.userStorage.getUser(username);

        if (existingUser) {
            throw new Error("There is already a user with the same username.");
        }

        const user = {
            name,
            username,
            password,
            type,
            workplaceId
        }

        await this.userStorage.createUser(user);
    }

    public async deleteUser(username: string): Promise<void> {
        await this.userStorage.deleteUser(username);
    }

    public async updateUser(updatedUser: Partial<IUser>): Promise<boolean> {
        if (!updatedUser.username) {
            return false;
        }

        const existingUser = await this.userStorage.getUser(updatedUser.username);

        if (!existingUser) {
            return false;
        }

        if (updatedUser.password) {
            updatedUser.password = await Utils.hashPassword(updatedUser.password);
        }

        const updatedName = updatedUser?.name ?? existingUser.name;
        const updatedPassword = updatedUser?.password ?? existingUser.password;
        const updatedType = updatedUser?.type ?? existingUser.type;
        const updatedWorkplaceId = updatedUser?.workplaceId ?? existingUser.workplaceId;

        await this.userStorage.updateUser({
            username: updatedUser.username,
            name: updatedName,
            password: updatedPassword,
            type: updatedType,
            workplaceId: updatedWorkplaceId
        });

        return true;
    }

    public async getUser(username: string): Promise<IUser | null> {
        return await this.userStorage.getUser(username);
    }

    public async getEmployeesForNode(nodeId: string): Promise<Omit<IUser, "password">[]> {
        return await this.userStorage.getUsersForNodes([nodeId], "employee");
    }

    public async getManagersForNode(nodeId: string): Promise<Omit<IUser, "password">[]> {
        return await this.userStorage.getUsersForNodes([nodeId], "manager");
    }

    public async getEmployeesForNodes(nodeIds: string[]): Promise<Omit<IUser, "password">[]> {
        return await this.userStorage.getUsersForNodes(nodeIds, "employee");
    }

    public async getManagersForNodes(nodeIds: string[]): Promise<Omit<IUser, "password">[]> {
        return await this.userStorage.getUsersForNodes(nodeIds, "manager");
    }
}