import path from 'path';
import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import uuid from 'uuid';
import { createStore, compose, applyMiddleware } from 'redux';

import serverActionBroker from 'vclub/redux/middlewares/serverActionBroker';
import sideEffectProcessor from 'vclub/redux/middlewares/sideEffectProcessor';
import { initialize } from 'vclub/redux/club/init';
import { memberEnter, memberLeave } from 'vclub/redux/club/members';
import reducer from 'vclub/redux/clubReducer';
import initialState from 'vclub/redux/initialClubState';


const serverPort = process.env.PORT || 3000;
const publicDir = path.resolve(__dirname, 'public');
const app = express();
const httpServer = new http.Server(app);
const io = ioServer(httpServer, { path: '/vclub-socket' });

const storeEnhancer = compose(
  applyMiddleware(serverActionBroker(io),
  sideEffectProcessor({ context: { ioServer: io } })),
);

const store = createStore(reducer, initialState, storeEnhancer);

app.set('port', serverPort);
app.use(express.static(publicDir));

app.get('/club', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'club.html'));
});

app.get('*', (req, res) => {
  res.redirect('/club');
});

io.on('connection', (socket) => {
  socket.on('auth', (authData) => {
    const user = {
      id: uuid.v4(),
      name: authData.name,
      master: !!authData.master,
    };

    store.dispatch(memberEnter(user));

    socket.join('members');

    if (user.master) {
      socket.join('masters');
    }

    const exit = () => {
      const memberLeaveAction = memberLeave(user.id);

      socket.broadcast.emit('dispatch', memberLeaveAction);
      store.dispatch(memberLeaveAction);
    };
    socket.on('disconnect', exit);
    socket.on('logOut', exit);

    socket.on('dispatch', action => store.dispatch(action));

    socket.emit('dispatch', initialize(store.getState(), user));
  });
});

httpServer.listen(app.get('port'), () => {
  process.stdout.write(`The server is running at http://localhost:${serverPort}\n`);
});
