import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid("employee", "manager").required(),
    workplaceId: Joi.string().required()
});

export const deleteUserSchema = Joi.object({
    username: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    username: Joi.string().required(),
    name: Joi.string().optional(),
    password: Joi.string().optional(),
    type: Joi.string().valid("employee", "manager").optional(),
    workplaceId: Joi.string().optional()
});

export const getUserSchema = Joi.object({
    username: Joi.string().required()
});