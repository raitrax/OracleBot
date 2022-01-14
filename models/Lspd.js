const { DataTypes, Model } = require('sequelize');

module.exports = class Lspd extends Model {
    static init(sequelize) {
        return super.init({
            lspdId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            matricule: {
                type: DataTypes.STRING,
                unique: true,
            },
            nom: { type: DataTypes.STRING },
            number:{ type: DataTypes.STRING },
            grade: { type: DataTypes.STRING },
            braquages:{ type: DataTypes.STRING },
            colonneswat: { type: DataTypes.STRING },
            penitencier: { type: DataTypes.STRING },
            henryu: { type: DataTypes.STRING },
            henryd: { type: DataTypes.STRING },
            marie: { type: DataTypes.STRING },
            sierra: { type: DataTypes.STRING },
            poursuite: { type: DataTypes.STRING },
            persecours: { type: DataTypes.STRING }
        }, {
            tableName: 'Lspd',
            timestamps: true,
            sequelize
        });
    }
}