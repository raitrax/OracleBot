const { DataTypes, Model } = require('sequelize');

module.exports = class allies extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            type: {
                type: DataTypes.STRING,
            },
            lvl: {
                type: DataTypes.INTEGER,
            },
            rare: {
                type: DataTypes.INTEGER,
            },
            epique: {
                type: DataTypes.INTEGER,
            },
            legendary: {
                type: DataTypes.INTEGER,
            },
            favor: {
                type: DataTypes.INTEGER,
            }
        }, {
            tableName: 'allies',
            timestamps: true,
            sequelize
        });
    }
}