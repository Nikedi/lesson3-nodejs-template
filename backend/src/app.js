const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const database = require('./database');

/* CREATE AND CONF THE WEB SERVER */

const app = new Koa();
module.exports = app;

app.use(logger());

app.use(cors({ credentials: true }));
app.use(bodyParser());

/* METHODS TO RESPOND TO THE ROUTES */

const listChats = async (ctx) => {
  const options = {};

  const chats = await database.Chat.findAll(options);

  const response = {
    results: chats,
  };

  ctx.body = response;
};

const createChat = async (ctx) => {
  const params = ctx.request.body;

  const chat = await database.Chat.create({ message: params.message, nickname: params.nickname, room: params.room });

  ctx.body = chat;
  ctx.status = 201;
};


//Get messages from room specified in url
const listMessages = async (ctx) => {
  const url = ctx.request.url.split("/")
  const roomName = url[url.length-1];

  const messages = await database.Chat.findAll({where: {room:roomName}});

  const response = {
    results: messages,
  };

  ctx.body = response;
};

/* CONFIGURING THE API ROUTES */

const publicRouter = new Router({ prefix: '/api' });

publicRouter.get('/chats', listChats);
publicRouter.post('/chats', createChat);

publicRouter.get('/chats/:roomName', listMessages);

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());
