const { DataTypes, Model } = require('sequelize');

module.exports = class Formations extends Model {
    static init(sequelize) {
        return super.init({
            formationsId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            matricule: {
                type: DataTypes.STRING,
                unique: true,
            },
            braquages:{ type: DataTypes.STRING },
            colonneswat: { type: DataTypes.STRING },
            penitencier: { type: DataTypes.STRING },
            henry1: { type: DataTypes.STRING },
            henry2: { type: DataTypes.STRING },
            marie: { type: DataTypes.STRING },
            sierra: { type: DataTypes.STRING },
            poursuite: { type: DataTypes.STRING },
            persecours: { type: DataTypes.STRING }
        }, {
            tableName: 'Formations',
            timestamps: true,
            sequelize
        });
    }
}