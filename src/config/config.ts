import { Dialect } from "sequelize/types";

export const config = {
    database: {
        username: process.env.DB_USERNAME || 'myuser',
        password: process.env.DB_PASSWORD || 'mypassword',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'mydatabase',
        dialect: 'postgres' as Dialect,
    },
    loggingLevel: process.env.LOGGING_LEVEL || 'debug',
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
}