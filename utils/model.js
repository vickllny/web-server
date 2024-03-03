const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    define: {
        underscored: true //数据库字段使用下划线命名方式
    }
});

const User = sequelize.define('chat_user', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  dailyTokenQuota: { type: Sequelize.INTEGER, defaultValue: 1000 }
});

const Authentication = sequelize.define('chat_authentication', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  userId: {
    type: Sequelize.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  provider: Sequelize.ENUM('wechat', 'phone', 'github', 'google', 'alipay'),
  identifier: {type: Sequelize.STRING, unique: true} // 例如电话号码、电子邮件地址或第三方应用的用户ID
});

const Membership = sequelize.define('chat_membership', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  userId: {
    type: Sequelize.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  level: Sequelize.ENUM('silver', 'gold', 'platinum'),
  monthlyTokenQuota: Sequelize.INTEGER,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE
});

const TokenTransaction = sequelize.define('chat_token_transaction', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    userId: {
        type: Sequelize.UUID,
        references: {
        model: User,
        key: 'id'
        }
    },
    type: Sequelize.ENUM('grant', 'purchase', 'consume'),
    amount: Sequelize.INTEGER,
    transactionDate: Sequelize.DATE
});
  

const Payment = sequelize.define('chat_payment', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  userId: {
    type: Sequelize.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: Sequelize.DECIMAL(10, 2),
  method: Sequelize.ENUM('wechat', 'alipay'),
  status: Sequelize.ENUM('pending', 'completed', 'failed'),
  paymentDate: Sequelize.DATE
});


User.hasMany(Authentication, { foreignKey: 'userId' });
User.hasOne(Membership, { foreignKey: 'userId' });
User.hasMany(TokenTransaction, { foreignKey: 'userId' });
User.hasMany(Payment, { foreignKey: 'userId' });

Authentication.belongsTo(User, { foreignKey: 'userId' });
Membership.belongsTo(User, { foreignKey: 'userId' });
TokenTransaction.belongsTo(User, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });


const init = async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}
}

init();





module.exports = { User, Authentication, Membership, TokenTransaction, Payment };