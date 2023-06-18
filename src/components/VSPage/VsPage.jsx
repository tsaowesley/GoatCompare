import PropTypes from 'prop-types';
import React, {
  useState,
  SetStateAction, useEffect,
} from 'react';
import { compose } from 'redux';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import i18n from "../../i18n";

import Players from '../Players/Players'

import crownSvg from '../../img/crown.png';
import pointerSvg from '../../img/pointer.png';
import pointerDarkSvg from '../../img/pointer-dark.png';
import './VsPage.scss';

const VsPage = ({
  isDarkMode,
  players,
  searchValue,
  setHasPlayer,
  setHasTopbarDescription,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [secondPlayer, setSecondPlayer] = useState(null);

  const dataPairs = {
    'FG%': 'field_goals_pct',
    '3P%': 'three_points_pct',
    'FT%': 'free_throws_pct',
    'REB': 'rebounds',
    'AST': 'assists',
    'BLK': 'blocks',
    'STL': 'steals',
    'TO': 'turnovers',
    'PTS': 'points',
  };
  const createDataDom = (title, firstValue, secondValue) => {
    const hasComparingValue = typeof firstValue === 'number' && typeof secondValue === 'number';
    return (
      <div className="data-row-container" key={title}>
        <div className="image-container">
          {hasComparingValue && ((title === 'TO' && firstValue < secondValue) || (title !== 'TO' && firstValue > secondValue)) && (
            <img alt="" className="crown-img" src={crownSvg} />
          )}
        </div>
        {hasComparingValue && (
          <div className="value first-value">
            {`${firstValue}${title.includes('%') ? '%' : ''}`}
          </div>
        )}
        <div className="title">
          {title}
        </div>
        {hasComparingValue && (
          <div className="value second-value">
            {`${secondValue}${title.includes('%') ? '%' : ''}`}
          </div>
        )}
        <div className="image-container">
          {hasComparingValue && ((title === 'TO' && firstValue > secondValue) || (title !== 'TO' && firstValue < secondValue)) && (
            <img alt="" className="crown-img" src={crownSvg} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`vs-page ${isDarkMode && "dark"}`}>
      {selectedPlayer ? (
        <Players
          players={players}
          searchValue={searchValue}
          updateTargetPlayer={(player) => {
            if (selectedPlayer === 'first') {
              setFirstPlayer(player);
              setHasPlayer(secondPlayer ? 'both' : 'first');
            }
            if (selectedPlayer === 'second') {
              setHasPlayer(firstPlayer ? 'both' : 'second');
              setSecondPlayer(player);
            }
            setHasTopbarDescription(true);
            setSelectedPlayer(null);
          }}
        />
      ) : (
        <>
          <div className="avatars-container">
            <div className="avatar-container first">
              <div
                className="avatar"
                onClick={() => {
                  setHasTopbarDescription(false);
                  setSelectedPlayer('first');
                }
                }>
                {firstPlayer ? (
                  <img alt="" className="avatar-player-img" src={firstPlayer.img} />
                ) : (
                  <img alt="" className="avatar-img" src={isDarkMode ? pointerDarkSvg : pointerSvg} />
                )}
              </div>
              <div className="text">
                {firstPlayer ? firstPlayer.full_name : i18n.t('Player one')}
              </div>
            </div>
            <div className="avatar-container">
              <div
                className="avatar"
                onClick={() => {
                  setHasTopbarDescription(false);
                  setSelectedPlayer('second');
                }
                }>
                {secondPlayer ? (
                  <img alt="" className="avatar-player-img" src={secondPlayer.img} />
                ) : (
                  <img alt="" className="avatar-img" src={isDarkMode ? pointerDarkSvg : pointerSvg} />
                )}
              </div>
              <div className="text">
                {secondPlayer ? secondPlayer.full_name : i18n.t('Player two')}
              </div>
            </div>
          </div>
          <div className="data-container">
            {Object.entries(dataPairs).map((dataPair) => createDataDom(
              dataPair[0],
              firstPlayer?.[dataPair[1]],
              secondPlayer?.[dataPair[1]],
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isDarkMode: state.isDarkMode,
});

VsPage.propTypes = {
  isDarkMode: PropTypes.bool,
};

VsPage.defaultProps = {
  isDarkMode: false,
  players: [],
};

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(VsPage);
