import { HierarchyTreeStorage } from "../database/HierarchyTreeStorage";
import { MongoDBDatabase } from "../database/MongoDBDatabase";
import { UserStorage } from "../database/UserStorage";
import { RestAPI } from "../rest-api/RestAPI";
import { AuthorizationService } from "../services/AuthorizationService";
import { TraversalService } from "../services/TraversalService";
import { UserService } from "../services/UserService";

export async function bootstrap(): Promise<void> {
    const mongoDBDatabase = new MongoDBDatabase();
    await mongoDBDatabase.setup();

    const storages = {
        hierarchyTreeStorage: new HierarchyTreeStorage(mongoDBDatabase),
        userStorage: new UserStorage(mongoDBDatabase)
    }

    const services = {
        userService: new UserService(storages.userStorage),
        authorizationService: new AuthorizationService(storages.hierarchyTreeStorage, storages.userStorage),
        traversalService: new TraversalService(storages.hierarchyTreeStorage)
    }

    const restAPI = new RestAPI(services);
    restAPI.setup();
    restAPI.listen();
}