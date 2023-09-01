const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Users = require("../models/User").Users; // import {Category} from "../model/Category";

module.exports = new EntitySchema({
    name: "Users",
    target: Users,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        email: {
            type: "varchar",
            require: true
        },
        password: {
            type: "varchar",
            require: true
        }
    }
});