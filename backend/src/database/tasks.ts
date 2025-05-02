import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database/dbConfig";
import TASK_STATUSES from "../constants/stringConstants";

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
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(TASK_STATUSES.TO_DO, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.DONE),
        defaultValue: TASK_STATUSES.TO_DO,
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false
});

export default tasks;