import { IUser } from "../entities/user/User";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { retrieveEmployeesForOneNodeSchema, retrieveManagersForNodeWithDescendantsSchema as retrieveManagersForOneNodeWithDescendantsSchema, retrieveManagersForOneNodeSchema, retrieveEmployeesForNodeWithDescendantsSchema } from "../schema-consts/TraversalSchema.consts";
import { AuthorizationService } from "../services/AuthorizationService";
import { TraversalService } from "../services/TraversalService";
import { UserService } from "../services/UserService";
import { Utils } from "../utils/Utils";
import { Request, Response } from "express";

export class TraversalController {
    private userService: UserService;
    private traversalService: TraversalService;
    private authorizationService: AuthorizationService;

    public constructor(userService: UserService, authorizationService: AuthorizationService, traversalService: TraversalService) {
        this.userService = userService;
        this.authorizationService = authorizationService;
        this.traversalService = traversalService;
    }

    public async retrieveEmployeesForOneNode(request: Request, response: Response): Promise<Response> {
        try {
            const loggedUser: IUser = request.body.loggedUser;

            Utils.validateSchema(retrieveEmployeesForOneNodeSchema, request.query);

            const nodeId = request.query.node_id as string;

            await this.authorizationService.canRetrieveEmployeesForOneNode(loggedUser, nodeId);

            const users = await this.userService.getEmployeesForNode(nodeId);

            return response.status(200).json(users);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }
    }

    public async retrieveManagersForOneNode(request: Request, response: Response): Promise<Response> {
        try {
            const loggedUser: IUser = request.body.loggedUser;

            Utils.validateSchema(retrieveManagersForOneNodeSchema, request.query);

            const nodeId = request.query.node_id as string;

            await this.authorizationService.canRetrieveManagersForOneNode(loggedUser, nodeId);

            const users = await this.userService.getManagersForNode(nodeId);

            return response.status(200).json(users);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }
    }

    public async retrieveEmployeesForOneNodeWithDescendants(request: Request, response: Response): Promise<Response> {
        try {
            const loggedUser: IUser = request.body.loggedUser;

            Utils.validateSchema(retrieveEmployeesForNodeWithDescendantsSchema, request.query);

            const nodeId = request.query.node_id as string;

            await this.authorizationService.canRetrieveEmployeesForNodeWithDescendants(loggedUser, nodeId);

            const nodeWithDescendatsIds = await this.traversalService.getOneNodeWithDescendatsIds(nodeId);

            const users = await this.userService.getEmployeesForNodes(nodeWithDescendatsIds);

            return response.status(200).json(users);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }
    }

    public async retrieveManagersForOneNodeWithDescendants(request: Request, response: Response): Promise<Response> {
        try {
            const loggedUser: IUser = request.body.loggedUser;

            Utils.validateSchema(retrieveManagersForOneNodeWithDescendantsSchema, request.query);

            const nodeId = request.query.node_id as string;

            await this.authorizationService.canRetrieveManagersForOneNodeWithDescendants(loggedUser, nodeId);

            const nodeWithDescendatsIds = await this.traversalService.getOneNodeWithDescendatsIds(nodeId);

            const users = await this.userService.getManagersForNodes(nodeWithDescendatsIds);

            return response.status(200).json(users);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }
    }
}