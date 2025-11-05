import { bootstrap } from "./bootstrap/bootstrap";

bootstrap().catch(
    (error: any) => {
        console.error(
            {
                message: `Bootstrap has caught the error: ${error?.message ?? "UNKNOWN ERROR"}`,
                stack: error?.stack,
                statusCode: error?.statusCode
            }
        );
    }
);