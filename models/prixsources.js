const { DataTypes, Model } = require('sequelize');

module.exports = class prixsources extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            item: {
                type: DataTypes.STRING,
            },
            prix: {
                type: DataTypes.INTEGER,
            }
        }, {
            tableName: 'prixsources',
            timestamps: true,
            sequelize
        });
    }
}