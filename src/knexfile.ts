import * as path from "path";
import type { Knex } from "knex";

export const development: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: path.join(__dirname, "dev.sqlite3")
    },
    useNullAsDefault: true
};

export const test: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    },
    seeds: {
        directory: "./tests/seeds"
    }
}; 
