import PropTypes from 'prop-types';
import React, {
  useState,
  useEffect,
} from 'react';
import { compose } from 'redux';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import './Players.scss';

const Players = ({
  hasTargetPlayer,
  isDarkMode,
  players,
  searchValue,
  sortingDep,
  updateTargetPlayer,
}) => {
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [dataPairs, setDataPairs] = useState({
    'FG%': 0,
    '3P%': 0,
    'FT%': 0,
    'REB': 0,
    'AST': 0,
    'BLK': 0,
    'STL': 0,
    'TO': 0,
    'PTS': 0,
  });

  useEffect(() => {
    if (!hasTargetPlayer) {
      setTargetPlayer(null);
      setDataPairs({
        'FG%': 0,
        '3P%': 0,
        'FT%': 0,
        'REB': 0,
        'AST': 0,
        'BLK': 0,
        'STL': 0,
        'TO': 0,
        'PTS': 0,
      });
    }
  }, [hasTargetPlayer]);

  const createDataDom = (title, value) => {
    return (
      <div
        className="data-row-container"
        key={title}
        onClick={() => {
          setDataPairs((prevDataPairs) => {
            const newDataPair = { ...prevDataPairs };
            delete newDataPair[title];
            return newDataPair;
          })
        }}
      >
        <div className="title">
          {title}
        </div>
        <div className="value">
          {`${value}${title.includes('%') ? '%' : ''}`}
        </div>
        <div className="empty-dom"></div>
      </div>
    );
  };

  return (
    <div className={`players-page ${targetPlayer && 'personal'} ${isDarkMode && "dark"}`}>
      {sortingDep && (
        <div className={`sorting-dep ${sortingDep}`}>
          {sortingDep}
        </div>
      )}
      {targetPlayer ? (
        <>
          <div className="player-container">
            <div className="avatar-container read-only">
              <img alt="" className="avatar" src={targetPlayer.img} />
            </div>
            <div className="name">{targetPlayer.full_name}</div>
          </div>
          <div className="data-container">
            {Object.entries(dataPairs).map((dataPair) => createDataDom(dataPair[0], dataPair[1]))}
          </div>
        </>
      ) : (
        [...players]
          .filter(
            (player) => {
              if (searchValue) {
                return player.full_name.toUpperCase().includes(searchValue.toUpperCase());
              }
              return true;
            })
          .sort((a, b) => {
          if (sortingDep === 'AST') {
            return b.assists - a.assists;
          }
          if (sortingDep === 'PTS') {
            return b.points - a.points;
          }
          return false;
        }).map((player, index) => (
            <div className="player-container" key={player.full_name}>
              {!!sortingDep && (
                <div className={`ranking size-${index}`}>
                  {index + 1}
                </div>
              )}
              <div
                className="avatar-container"
                onClick={() => {
                  setTargetPlayer(player);
                  updateTargetPlayer(player);
                  setDataPairs({
                    'FG%': player.field_goals_pct,
                    '3P%': player.three_points_pct,
                    'FT%': player.free_throws_pct,
                    'REB': player.rebounds,
                    'AST': player.assists,
                    'BLK': player.blocks,
                    'STL': player.steals,
                    'TO': player.turnovers,
                    'PTS': player.points,
                  });
                }}
              >
                {player?.img && (
                  <img alt="" className="avatar" src={player?.img} />
                )}
              </div>
              <div className="name">{player.full_name}</div>
            </div>
          ))
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isDarkMode: state.isDarkMode,
});

Players.propTypes = {
  isDarkMode: PropTypes.bool,
  hasTargetPlayer: PropTypes.bool,
  target: PropTypes.object,
};

Players.defaultProps = {
  isDarkMode: false,
  hasTargetPlayer: false,
  players: [],
};

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(Players);
