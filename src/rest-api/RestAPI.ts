import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Config } from "../config/Config";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AuthorizationService } from "../services/AuthorizationService";
import { TraversalController } from "../controllers/TraversalController";
import { TraversalService } from "../services/TraversalService";

interface IServices {
    userService: UserService,
    authorizationService: AuthorizationService,
    traversalService: TraversalService
}

export class RestAPI {
    private app: express.Express;
    private server!: http.Server;
    private isSetup: boolean;
    private services: IServices;
    private authMiddleware: AuthMiddleware;

    public constructor (services: IServices) {
        this.app = express();
        this.services = services;
        this.authMiddleware = new AuthMiddleware(services.userService);
        this.isSetup = false;
    }

    public listen(): void {
        if (!this.isSetup) {
            throw new Error("You haven't called setup() before listen()");
        }

        const config = Config.getRestAPIConfig();

        this.server = this.app.listen(config.httpPort, () => {
            console.log(`The app is listening on port ${config.httpPort}`);
        })
    }

    public setup(): void {
        this.useMiddlewares();
        this.hookUpRoutes();
        this.isSetup = true;
    }

    private useMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(this.useAuthMiddleware.bind(this))
    }

    private hookUpRoutes() {
        const userController = new UserController(this.services.userService, this.services.authorizationService);
        const traversalController = new TraversalController(this.services.userService, this.services.authorizationService, this.services.traversalService);
        
        this.app.get("/user", (req, res) => { userController.getUser(req, res) });
        this.app.post("/user/create", (req, res) => { userController.createUser(req, res) });
        this.app.delete("/user/delete", (req, res) => { userController.deleteUser(req, res) });
        this.app.patch("/user/update", (req, res) => { userController.updateUser(req, res) });

        this.app.get("/managers-for-node", (req, res) => { traversalController.retrieveManagersForOneNode(req, res) });
        this.app.get("/employees-for-node", (req, res) => { traversalController.retrieveEmployeesForOneNode(req, res) });
        this.app.get("/managers-for-node-with-descendants", (req, res) => { traversalController.retrieveManagersForOneNodeWithDescendants(req, res) });
        this.app.get("/employees-for-node-with-descendants", (req, res) => { traversalController.retrieveEmployeesForOneNodeWithDescendants(req, res) });
    }

    private async useAuthMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            await this.authMiddleware.auth(req, res);
        } catch(err: any) {
            return res.status(401).send(err.message);
        }

        next();
    }
}