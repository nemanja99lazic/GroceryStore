import { UserType } from "./User.type";

export interface IUser {
    name: string;
    username: string;
    password: string;
    type: UserType;
    workplaceId: string;
}