import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database/dbConfig";

/**
 * Sequelize model definition for the tasks table
 */
const tasks = sequelize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Pending", "Ongoing", "Completed"),
        defaultValue: "Pending",
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false
});

export default tasks;