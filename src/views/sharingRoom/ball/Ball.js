import React, { PropTypes } from 'react';
import ball from './icon/tennis-ball.svg';
import styles from './Ball.css';


function Ball(props) {
  const { ballPosition, members } = props;
  const userIsOut = members.every(user => user.id !== ballPosition);
  const displayBall = userIsOut || ballPosition === null;

  return (
    <div className={styles.containerBall}>
      {displayBall && (
        <button className={styles.btnBall}>
          <img src={ball} alt="ball" width={30} />
        </button>
      )}
    </div>
  );
}

Ball.propTypes = {
  ballPosition: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    master: PropTypes.bool.isRequired,
  }).isRequired).isRequired,
};

export default Ball;
