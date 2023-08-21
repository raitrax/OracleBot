const { DataTypes, Model } = require('sequelize');

module.exports = class artefacts extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            lvl: {
                type: DataTypes.INTEGER,
            },
            dionesium: {
                type: DataTypes.INTEGER,
            },
            quantum: {
                type: DataTypes.INTEGER,
            },
            paradox: {
                type: DataTypes.INTEGER,
            },
            xp: {
                type: DataTypes.INTEGER,
            }
        }, {
            tableName: 'artefacts',
            timestamps: true,
            sequelize
        });
    }
}