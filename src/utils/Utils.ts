import bcrypt from "bcrypt";
import { AnySchema } from "joi";
import { BadRequestError } from "../errors/BadRequestError";

export class Utils {
    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async arePasswordsEqual(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plaintextPassword, hashedPassword);
    }

    public static validateSchema(schema: AnySchema, value: any): void {
        const result = schema.validate(
            value,
            {
                allowUnknown: true
            }
        );

        if (result.error) {
            throw new BadRequestError(result.error.message);
        }
    }
}