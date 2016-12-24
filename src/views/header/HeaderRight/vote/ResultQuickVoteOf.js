import React, { PropTypes } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import setPropTypes from 'recompose/setPropTypes';

import { toggleModal } from 'vclub/redux/club/vote';

import likeIcon from './icon/like.png';
import dislikeIcon from './icon/dislike.png';

import style from './ResultQuickVoteOf.css';


const enhance = compose(
  connect(state => ({
    user: state.auth.user,
    ...state.vote,
  })),
  setPropTypes({
    dispatch: PropTypes.func,
    showModalVote: PropTypes.bool,
  }),
  withHandlers({
    onToggleClick: (props) => () => {
      const { dispatch } = props;
      dispatch(toggleModal());
    },
  }),
);

function ResultQuickVoteOf(props) {
  const {
    className,
    showModalVote,
    onToggleClick,
    pros,
    cons,
  } = props;

  return (
    <div>
      <button
        className={className}
        onClick={onToggleClick}
      >
        &#63;
      </button>
      {showModalVote && (
        <section className={style.section}>
          <div className={style.containerVote}>
            <h2>Опрос</h2>
            <div className={style.vote}>
              <div className={style.resultVote}>
                <img src={likeIcon} alt="like" width={30} />
                <span>{pros.length}</span>
              </div>
              <div className={style.resultVote}>
                <img src={dislikeIcon} alt="dislike" width={30} />
                <span>{cons.length}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
/*eslint-disable */
ResultQuickVoteOf.propTypes = {
  className: PropTypes.string,
  showModalVote: PropTypes.bool,
  onToggleClick: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    master: PropTypes.bool.isRequired,
  }).isRequired,
  pros: PropTypes.arrayOf(PropTypes.string).isRequired,
  cons: PropTypes.arrayOf(PropTypes.string).isRequired,
};
/*eslint-enable */
export default enhance(ResultQuickVoteOf);
