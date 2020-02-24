const Sequelize = require('sequelize');

/* INIT DATABASE */

const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: './db/chat.sqlite',
});

/* INIT CHAT TABLE WITH MESSAGE */

const Chat = sequelize.define('chats', {
  message: Sequelize.TEXT,
  nickname: Sequelize.TEXT,
  room: Sequelize.TEXT,
}, {
  timestamps: true,
});

// toJSON method is automatically called when the object is serialized in Koa
Chat.prototype.toJSON = function toJSON() {
  return {
    // Id and timestamps are generated automatically
    id: this.id,
    createdAt: this.createdAt,

    // Message was added on the POST request
    message: this.message,
    nickname: this.nickname,
    room: this.room,
  };
};

/* EXPORT CHAT OBJECT */

exports.sync = (options) => sequelize.sync(options);

exports.Chat = Chat;
