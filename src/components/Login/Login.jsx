import axios from "axios";
import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';
import { compose } from 'redux';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import { createChangeToken} from "../../actions/login";
import i18n from "../../i18n";

import Players from '../Players/Players'
import './Login.scss';

const Login = ({
  changeToken,
  isDarkMode,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const testToken = async () => {
    try {
      await axios.get(`/api/0afbe608-940a-4d5d-a1f7-468718c67d91/profile.json?api_key=${token}`);
      await delay(600);
      changeToken(token);
    } catch {
      setErrorMessage('token invalid');
    }
  };

  const register = () => {
    const users = JSON.parse(localStorage.getItem('users'));
    console.log(users);
    if (users.some((user) => user.username === username)) {
      
    }
  };

  return (
    <div className={`login-page ${isDarkMode && "dark"}`}>
      <div className="input-container">
        <div className="title">
          {i18n.t('Username')}
        </div>
        <input
          className="username"
          placeholder={i18n.t('Username')}
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          value={username}
        />
      </div>
      <div className="input-container">
        <div className="title">
          {i18n.t('Password')}
        </div>
        <input
          className="password"
          placeholder={i18n.t('Password')}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          value={password}
        />
      </div>
      {!isRegistering && (
        <div className="input-container">
          <div className="title">
            {i18n.t('Token')}
          </div>
          <input
            className="token"
            placeholder={i18n.t('Token')}
            onChange={(e) => {
              setToken(e.currentTarget.value);
            }}
            value={token}
          />
        </div>
      )}
      <div
        className="button confirm"
        onClick={() => {
          if (isRegistering) {
            /// Saving data to localStorage
            register();
            return;
          }
          testToken();
        }}
      >
        {i18n.t('Confirm')}
      </div>
      <div
        className="button register"
        onClick={() => {
          setIsRegistering(true);
        }}
      >
        {i18n.t('Register')}
      </div>
      <div className="error-message">
        {i18n.t(errorMessage)}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isDarkMode: state.isDarkMode,
});

const mapDispatchToProps = (dispatch) => ({
  changeToken: (token) => dispatch(createChangeToken(token)),
});

Login.propTypes = {
  isDarkMode: PropTypes.bool,
};

Login.defaultProps = {
  isDarkMode: false,
  changeToken: null,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(Login);
