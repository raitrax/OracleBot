const { DataTypes, Model } = require('sequelize');

module.exports = class leagues extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
            },
            roleId: {
                type: DataTypes.STRING,
            }
        }, {
            tableName: 'leagues',
            timestamps: true,
            sequelize
        });
    }
}