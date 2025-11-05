import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { Utils } from "../utils/Utils";

export class AuthMiddleware {
    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    public async auth(request: Request, _response: Response): Promise<void> {
        const authorizationParts = (request.headers?.authorization ?? "").split(" ");
        
        if (authorizationParts.length !== 2) {
            throw new Error("Unauthorized");
        }

        const encodedCredentials = authorizationParts[1]!;

        const credentials = Buffer.from(encodedCredentials, "base64").toString("utf8");

        const [username, password] = credentials.split(":");

        if (!username || !password) {
            throw new Error("Unauthorized");
        }

        const userFromDb = await this.userService.getUser(username);

        if (!userFromDb) {
            throw new Error("Unauthorized - user with the username doesn't exist.");
        }

        const matchedPasswords = await Utils.arePasswordsEqual(password, userFromDb.password);

        if (!matchedPasswords) {
            throw new Error("Unauthorized - wrong password,");
        }

        request.body = {
            ...request.body,
            loggedUser: userFromDb
        };
    }
}