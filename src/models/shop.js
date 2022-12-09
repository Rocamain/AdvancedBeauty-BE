const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      this.hasMany(models.Booking, {
        foreignKey: 'shop_id',
      });
    }
  }

  Shop.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'shop_id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      shopName: {
        type: DataTypes.STRING,
        field: 'shop_name',
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Validation on shopName cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on shopName cannot be Boolean',
          },
          len: {
            args: [[4, 20]],
            msg: 'Validation on shopName min:4, max:20',
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Validation on city cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on city cannot be true or false',
          },
          len: {
            args: [[4, 20]],
            msg: 'Validation on city min:4, max:20',
          },
        },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Validation on street cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on street cannot be Boolean',
          },
          len: {
            args: [[4, 20]],
            msg: 'Validation on street min:4, max:20',
          },
        },
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Validation on postcode cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on postcode cannot be Boolean',
          },
          len: {
            args: [[5, 28]],
            msg: 'Validation on postcode min:5, max:28',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          let string = value + '';
          string = string.replace(/\s/g, '');
          if (string.length === 9) {
            const split = string.match(/.{3}/g);
            const join = split.join(',').replaceAll(',', ' ');
            this.setDataValue('phone', join);
          } else {
            const err = new Error();
            err.status = 400;
            err.msg = 'Bad request: Validation on phone, must be 9 numbers';
            throw err;
          }
        },
        validate: {
          notEmpty: { msg: 'Validation on phone cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on phone cannot be Boolean',
          },
          is: {
            args: /^([0-9 ]+){11}$/,
            msg: 'Validation on mobile format not valid, must be numbers',
          },
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          let string = value + '';
          string = string.replace(/\s/g, '');
          if (string.length === 9) {
            const split = string.match(/.{3}/g);
            const join = split.join(',').replaceAll(',', ' ');
            this.setDataValue('phone', join);
          } else {
            const err = new Error();
            err.status = 400;
            err.msg = 'Bad request: Validation on phone, must be 9 numbers';
            throw err;
          }
        },
        validate: {
          notEmpty: { msg: 'Validation on phone cannot be empty string' },
          notIn: {
            args: [[false, true]],
            msg: 'Validation on phone cannot be Boolean',
          },
          is: {
            args: /^([0-9 ]+){11}$/,
            msg: 'Validation on mobile format not valid, must be numbers',
          },
        },
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Shop',
      tableName: 'shops',
    }
  );
  return Shop;
};
