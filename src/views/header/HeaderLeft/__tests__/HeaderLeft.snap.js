import React from 'react';
import renderer from 'react-test-renderer';
import HeaderLeft from '../HeaderLeft';

const roomsNames = ['SHARING', 'VIDEO', 'CHAT', 'WHITEBOARD'];
const currentRoomName = 'VIDEO';

test('<HeaderLeft /> renders correctly', () => {
  const dispatchSpy = jest.fn();
  const rendered = renderer.create(
    <HeaderLeft
      currentRoomName={currentRoomName}
      roomsNames={roomsNames}
      dispatch={dispatchSpy}
    />
  );
  expect(rendered.toJSON()).toMatchSnapshot();
});
