const { Sequelize, DataTypes } = require('sequelize');

// Update these variables with your actual MySQL credentials
const sequelize = new Sequelize('refferal_program', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Mail = sequelize.define('Mail', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields
});

const initDb = async () => {
    await sequelize.sync({ alter: true }); // Use alter to add columns to existing table
};

module.exports = { sequelize, Mail, initDb };
