import Joi from "joi";

export const retrieveEmployeesForOneNodeSchema = Joi.object({
    node_id: Joi.string().required()
});

export const retrieveManagersForOneNodeSchema = Joi.object({
    node_id: Joi.string().required()
});

export const retrieveEmployeesForNodeWithDescendantsSchema = Joi.object({
    node_id: Joi.string().required()
});

export const retrieveManagersForNodeWithDescendantsSchema = Joi.object({
    node_id: Joi.string().required()
});