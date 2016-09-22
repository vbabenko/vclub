/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-env jest */
import initialState from 'vclub/redux/initialClubState';
import reducer, {
  CHANGE_ROOM, changeRoom,
} from '../rooms';

// action creator
test('changeRoom action creates proper action', () => {
  const nextRoom = 'CHAT';
  const expectedAction = {
    type: CHANGE_ROOM,
    payload: nextRoom,
  };
  expect(changeRoom(nextRoom)).toEqual(expectedAction);
});

// reducer
test('reducer returns initial state', () => {
  const { rooms: roomsInitialState } = initialState;
  expect(reducer(undefined, {}))
    .toEqual(roomsInitialState);
});

test('reducer should handle CHANGE_ROOM', () => {
  const { rooms: roomsInitialState } = initialState;

  let nextRoom = 'CHAT';
  if (roomsInitialState.currentRoom === 'CHAT') {
    nextRoom = 'VIDEO';
  }

  const expectedState = {
    ...roomsInitialState,
    currentRoom: nextRoom,
  };

  expect(reducer(roomsInitialState, changeRoom(nextRoom))).toEqual(expectedState);
});

test('reducer should return the same state if action\'s payload already in the state', () => {
  const { rooms: roomsInitialState } = initialState;

  const currentRoom = roomsInitialState.currentRoom;
  expect(reducer(roomsInitialState, changeRoom(currentRoom))).toBe(roomsInitialState);
});