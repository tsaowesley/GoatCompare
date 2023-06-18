import { eachLimit } from 'async';
import axios from "axios";
import PropTypes from 'prop-types';
import React, {
  useEffect, useRef,
  useState,
} from 'react';
import { compose } from 'redux';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import { createChangeDarkMode, createChangeLanguage } from "./actions/login";
import Login from "./components/Login/Login";
import Players from "./components/Players/Players";
import VsPage from "./components/VSPage/VsPage";
import i18n from './i18n'
import './styles/App.scss';

import basketballSvg from './img/basketball.png';
import searchSvg from './img/search.svg';
import returnSvg from './img/return.svg';
import returnDarkSvg from './img/return-dark.svg';

const playerInfos = [
  { /// Lebron
    id: '0afbe608-940a-4d5d-a1f7-468718c67d91',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png',
  },
  { /// Curry
    id: '8ec91366-faea-4196-bbfd-b8fab7434795',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201939.png',
  },
  { /// Giannis
    id: '6c60282d-165a-4cba-8e5a-4f2d9d4c5905',
    img: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3032977.png&w=350&h=254',
  },
  { /// Anthony
    id: 'ea8826b8-1f76-4eab-b61e-ffcb176880f3',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203076.png',
  },
  { /// Nikola
    id: 'f2625432-3903-4f90-9b0b-2e4f63856bb0',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203999.png',
  },
  { /// Derrick
    id: '48341095-ae5a-4d61-bcc8-1b0ceed870b2',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201565.png',
  },
  { /// Nick
    id: 'd323405a-4655-4261-b0fa-9524523143a1',
    img: 'http://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201156.png',
  },
  { /// Lance
    id: '01e8f44f-f1ee-4d3a-86bd-c29d597ba9bd',
    img: 'http://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202362.png',
  },
  { /// Kyle
    id: '4fae86e2-4f99-4247-af85-d917b4389d31',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628398.png',
  },
  { /// Russel
    id: '74a45eed-f2b0-4886-ae71-d04cf7d59528',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201566.png',
  },
  { /// James
    id: 'a52b2c84-9c3d-4d6e-8a3b-10e75d11c2bc',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201935.png',
  },
  { /// Kevin
    id: '53f2fa48-e61b-49fb-843d-8a3e872257eb',
    img: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201142.png',
  },
];


const App = ({
  apiKey,
  changeDarkMode,
  changeLanguage,
  isDarkMode,
  language,
  token,
}) => {
  const [hasTopbarDescription, setHasTopbarDescription] = useState(false);
  const [hasMenuDetails, setHasMenuDetails] = useState(false);
  const [hasPlayer, setHasPlayer] = useState('none');
  const [hasReturnButton, setHasReturnButton] = useState(false);
  const [hasSortingDropdown, setHasSortingDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortingDep, setSortingDep] = useState(null);
  const [page, setPage] = useState('login');
  /// teams[0].total.field_goals_pct
  /// teams[0].total.three_points_pct
  /// teams[0].total.free_throws_pct
  /// teams[0].average.rebounds
  /// teams[0].average.assists
  /// teams[0].average.blocks
  /// teams[0].average.steals
  /// teams[0].average.turnovers
  /// teams[0].average.points
  const [players, setPlayers] = useState([]);
  const isMounted = useRef(false);
  const hostname = window.location.hostname.includes('localhost') ? '/api/' : 'https://api.sportradar.com/nba/trial/v8/en/players/';

  useEffect(() => {
    isMounted.current = true;
    return (() => {
      isMounted.current = false;
    })
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (token) {
      getPlayers();
      setPage('players');
    }
  }, [token]);

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const getPlayers = async () => {
    await eachLimit(
      playerInfos,
      1,
      async (playerInfo) => {
        try {
          const playerInfoResult = await axios.get(`${hostname}${playerInfo.id}/profile.json?api_key=${token}`);
          await delay(600);
          const convertToPercentage = (inputNumber) => {
            return Number((inputNumber * 100).toFixed(2));
          }
          if (isMounted.current) {
            setPlayers((prevPlayers) => {
              if (!prevPlayers.some((prevPlayer) => prevPlayer.full_name === playerInfoResult?.data?.full_name)) {
                return [...prevPlayers, {
                  full_name: playerInfoResult?.data?.full_name,
                  field_goals_pct: typeof(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.field_goals_pct) === 'number'
                    && convertToPercentage(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.field_goals_pct),
                  three_points_pct: typeof(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.three_points_pct) === 'number'
                    && convertToPercentage(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.three_points_pct),
                  free_throws_pct: typeof(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.free_throws_pct) === 'number'
                    && convertToPercentage(playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.total?.free_throws_pct),
                  rebounds: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.rebounds,
                  assists: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.assists,
                  blocks: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.blocks,
                  steals: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.steals,
                  turnovers: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.turnovers,
                  points: playerInfoResult?.data?.seasons?.[0]?.teams?.[0]?.average?.points,
                  img: playerInfo.img,
                }]
              }
              return prevPlayers;
            });
          }
        } catch {
          await delay(600);
        }
      },
    );
  };

  const updateTargetPlayer = () => {
    setHasReturnButton(true);
  }

  const createPage = () => {
    switch (page) {
      case 'vsPage':
        return (
          <VsPage
            players={players}
            searchValue={searchValue}
            setHasPlayer={(currentHasPlayer) => {
              setHasPlayer(currentHasPlayer)}
            }
            setHasTopbarDescription={(currentHasTopbarDescription) => {
              setHasTopbarDescription(currentHasTopbarDescription);
            }}
          />
        )
      case 'players':
        return (
          <Players
            hasTargetPlayer={hasReturnButton}
            players={players}
            searchValue={searchValue}
            sortingDep={sortingDep}
            updateTargetPlayer={updateTargetPlayer}
          />
        );
      case 'login':
      default:
        return (
          <Login />
        );
    }
  }

  const createSortingDropdown = (value) => (
    <div
      className="sorting-dropdown"
      key={value}
      onClick={() => {
        setSortingDep(value);
        setHasSortingDropdown(false);
      }}
    >
      {i18n.t(`Sort by ${value}`)}
    </div>
  );

  return (
    <div className={`app font ${isDarkMode && "dark"}`}>
      <div className="topbar">
        {!!token ? (
          hasTopbarDescription && hasPlayer !== 'both' ? (
            <div className="description">
              {i18n.t(`Please choosing Player by clicking the point image`, { number: hasPlayer === 'first' ? i18n.t('two') : i18n.t('one')})}
            </div>
          ) : (
            hasPlayer === 'both' ? <div className="empty-dom"></div> : (
              <div className="searchbar">
                <img alt="" className="searchbar-image" src={searchSvg} />
                <input
                  className="searchbar-text"
                  placeholder={i18n.t('Search')}
                  onChange={(e) => {
                    setSearchValue(e.currentTarget.value);
                  }}
                  value={searchValue}
                />
              </div>
            )
          )
        ) : <div className="empty-dom"></div>}
        <div className="right-container">
          {!!token && (
            hasMenuDetails || hasReturnButton || page === 'vsPage' ? (
              <div className="return-container" onClick={() => {
                if (hasMenuDetails) {
                  setHasMenuDetails(false);
                  return;
                }
                if (page === 'vsPage') {
                  setHasTopbarDescription(false);
                  setPage('players');
                  setHasPlayer('none');
                  return;
                }
                if (hasReturnButton) {
                  setHasReturnButton(false);
                }
              }
              }>
                <img alt="" className="return" src={isDarkMode ? returnDarkSvg : returnSvg} />
              </div>
            ) : (
              <div className="tabs">
                <div
                  className="tab vs-container"
                  onClick={() => {
                    setHasTopbarDescription(true);
                    setPage('vsPage');
                    setSearchValue('');
                    setSortingDep(null);
                  }
                  }>
                  <div className="tab-text">
                    {i18n.t('VS')}
                  </div>
                  <img alt="" className="tab-image vs" src={basketballSvg} />
                </div>
                {!!sortingDep ? (
                  <div className="return-container" onClick={() => {
                    if (hasReturnButton) {
                      setHasReturnButton(false);
                      return;
                    }
                    if (sortingDep) {
                      setSortingDep(null);
                    }
                  }
                  }>
                    <img alt="" className="return" src={isDarkMode ? returnDarkSvg : returnSvg} />
                  </div>
                ): (
                  <div
                    className="tab sort-container"
                    onClick={() => {
                      setHasSortingDropdown((prevHasSortingDropdown) => !prevHasSortingDropdown);
                    }}
                  >
                    <div className="tab-text">
                      {i18n.t('SORT')}
                    </div>
                    {hasSortingDropdown && (
                      <div className="clicked-container">
                        <div className="clicked"></div>
                      </div>
                    )}
                    <img alt="" className="tab-image sort" src={basketballSvg} />
                  </div>
                )}
              </div>
            )
          )}
          <div className="menu" onClick={() => setHasMenuDetails((prevHasMenuDetails) => !prevHasMenuDetails)}>
            <div className="menu-container">
              <div className="menu-content"></div>
              <div className="menu-content"></div>
              <div className="menu-content"></div>
            </div>
          </div>
        </div>
      </div>
      {hasSortingDropdown && (
        <div className="dropdown-container">
          {['AST', 'PTS'].map((sortingString) => createSortingDropdown(sortingString))}
          <div className="mask-content"></div>
        </div>
      )}
      {hasMenuDetails && (
        <div className="mask">
          <div className="settings-container">
            <div className="settings-content">
              <div className="title">
                {i18n.t('Dark Mode')}
              </div>
              <div
                className={`toggle ${isDarkMode ? 'dark' : 'light'}`}
                onClick={() => {
                  changeDarkMode(!isDarkMode);
                }
              }>
                <div className="target"></div>
              </div>
            </div>
            <div className="settings-content">
              <div className="title">
                {i18n.t('Language')}
              </div>
              <div className="selector-container">
                <div
                  className={`selector ${language === 'zh-TW' && "active"}`}
                  onClick={() => {
                    if (changeLanguage) {
                      changeLanguage('zh-TW')
                    }
                  }
                }>
                  繁體中文&nbsp;
                </div>
                <div className="selector">/</div>
                <div
                  className={`selector ${language === 'en' && "active"}`}
                  onClick={() => {
                    if (changeLanguage) {
                      changeLanguage('en')
                    }
                  }
                  }>
                  &nbsp;English
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(hasSortingDropdown || hasMenuDetails) && (
        <div className="mask-content"></div>
      )}
      {createPage()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isDarkMode: state.isDarkMode,
  language: state.language,
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  changeDarkMode: (isDarkMode) => dispatch(createChangeDarkMode(isDarkMode)),
  changeLanguage: (language) => dispatch(createChangeLanguage(language)),
});

App.propTypes = {
  apiKey: PropTypes.string,
  changeDarkMode: PropTypes.func,
  changeLanguage: PropTypes.func,
  isDarkMode: PropTypes.bool,
  language: PropTypes.string,
  token:  PropTypes.string,
};

App.defaultProps = {
  apiKey: '',
  changeDarkMode: null,
  changeLanguage: null,
  isDarkMode: false,
  language: 'en',
  token: '',
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(App);
