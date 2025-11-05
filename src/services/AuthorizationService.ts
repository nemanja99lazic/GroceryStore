import { HierarchyTreeStorage } from "../database/HierarchyTreeStorage";
import { UserStorage } from "../database/UserStorage";
import { IUser } from "../entities/user/User";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class AuthorizationService {
    private hierarchyTreeStorage: HierarchyTreeStorage;
    private userStorage: UserStorage;

    public constructor(hierarchyTreeStorage: HierarchyTreeStorage, userStorage: UserStorage) {
        this.hierarchyTreeStorage = hierarchyTreeStorage;
        this.userStorage = userStorage;
    }

    public async canCreateUser(loggedUser: IUser, toBeCreatedUser: IUser): Promise<void> {
        if (loggedUser.type === "employee") {
            throw new UnauthorizedError("Unauthorized - Employee can't create users");
        }

        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, toBeCreatedUser.workplaceId);

        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canDeleteUser(loggedUser: IUser, usernameToBeDeleted: string): Promise<void> {
        if (loggedUser.type === "employee") {
            throw new UnauthorizedError("Unauthorized - Employee can't delete users");
        }
        
        const toBeDeleted = await this.userStorage.getUser(usernameToBeDeleted);

        if (toBeDeleted === null) {
            return;
        }

        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, toBeDeleted.workplaceId);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canUpdateUser(loggedUser: IUser, username: string): Promise<void> {
        if (loggedUser.type === "employee") {
            throw new UnauthorizedError("Unauthorized - Employee can't update users");
        }

        const userFromDb = await this.userStorage.getUser(username);

        if (userFromDb === null) {
            return;
        }

        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, userFromDb.workplaceId);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canGetUser(loggedUser: IUser, username: string): Promise<void> {
        const userFromDb = await this.userStorage.getUser(username);

        if (userFromDb === null) {
            return;
        }

        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, userFromDb.workplaceId);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canRetrieveEmployeesForOneNode(loggedUser: IUser, nodeIdToReach: string): Promise<void> {
        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, nodeIdToReach);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canRetrieveManagersForOneNode(loggedUser: IUser, nodeIdToReach: string): Promise<void> {
        if (loggedUser.type === "employee") {
            throw new UnauthorizedError("Unauthorized - Employee can't retrieve managers");
        }
        
        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, nodeIdToReach);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canRetrieveEmployeesForNodeWithDescendants(loggedUser: IUser, nodeIdToReach: string): Promise<void> {
        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, nodeIdToReach);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }

    public async canRetrieveManagersForOneNodeWithDescendants(loggedUser: IUser, nodeIdToReach: string): Promise<void> {
        if (loggedUser.type === "employee") {
            throw new UnauthorizedError("Unauthorized - Employee can't retrieve managers");
        }
        
        const reachable = await this.hierarchyTreeStorage.pathExistsInHierarchyTree(loggedUser.workplaceId, nodeIdToReach);
    
        if (!reachable) {
            throw new UnauthorizedError("Unauthorized");
        }
    }
}