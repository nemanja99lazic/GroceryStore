import { UserService } from "../services/UserService";
import { Request, Response} from "express";
import { Utils } from "../utils/Utils";
import { createUserSchema, deleteUserSchema, getUserSchema, updateUserSchema } from "../schema-consts/UserSchema.consts";
import { BadRequestError } from "../errors/BadRequestError";
import { IUser } from "../entities/user/User";
import { HierarchyTreeStorage } from "../database/HierarchyTreeStorage";
import { AuthorizationService } from "../services/AuthorizationService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class UserController {
    private userService: UserService;
    private authorizationService: AuthorizationService;

    public constructor(userService: UserService, authorizationService: AuthorizationService) {
        this.userService = userService;
        this.authorizationService = authorizationService;
    }

    public async createUser(request: Request, response: Response): Promise<Response> {
        try {
            Utils.validateSchema(createUserSchema, request.body);

            const name = request.body.name;
            const username = request.body.username;
            const password = request.body.password;
            const type = request.body.type;
            const workplaceId = request.body.workplaceId;

            const userToBeCreated = {
                name,
                username,
                password,
                type,
                workplaceId
            };

            await this.authorizationService.canCreateUser(request.body.loggedUser, userToBeCreated);

            await this.userService.createUser(name, username, password, type, workplaceId);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }

        return response.status(200).send("User created successfully");
    }

    public async deleteUser(request: Request, response: Response): Promise<Response> {
        try {
            Utils.validateSchema(deleteUserSchema, request.body);

            const username = request.body.username;

            await this.authorizationService.canDeleteUser(request.body.loggedUser, username);

            await this.userService.deleteUser(username);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }

        return response.status(200).send("User deleted successfully");
    }

    public async updateUser(request: Request, response: Response): Promise<Response> {
        try {
            Utils.validateSchema(updateUserSchema, request.body);

            const user: Partial<IUser> = {
                username: request.body.username,
                name: request.body.name,
                password: request.body.password,
                type: request.body.type,
                workplaceId: request.body.workplaceId
            }

            await this.authorizationService.canUpdateUser(request.body.loggedUser, request.body.username);

            const updated = await this.userService.updateUser(user);

            if (!updated) {
                return response.status(404).send("User not found or username not passed");
            }
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }

        return response.status(200).send("User updated successfully");
    }

    public async getUser(request: Request, response: Response): Promise<Response> {
        try {
            Utils.validateSchema(getUserSchema, request.query);

            await this.authorizationService.canGetUser(request.body.loggedUser, request.query.username as string);

            const user = await this.userService.getUser(request.query.username as string);

            if (!user) {
                return response.status(404).send("User doesn't exist.");
            }

            const userDto: Partial<IUser> = user;

            delete userDto.password;

            return response.status(200).json(user);
        } catch (error: any) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return response.status(error.getCode()).send(error.getMessage());
            }

            return response.status(500).send(error?.message ?? "Uknown error");
        }
    }
}