import axios from 'axios';
import jwtDecode from "jwt-decode";
import {LOGIN_API, USERS_API} from "../config";

/**
 *
 */
function setup() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > (new Date().getTime())) {
            setAxiosToken(token);
        }
    }
}

/**
 *
 * @param {string} token
 */
function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = "Bearer " + token;
}

/**
 *
 * @param credentials
 * @returns {Promise<AxiosResponse<any>>}
 */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);

            setAxiosToken(token);
        });
}

/**
 *
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 *
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > (new Date().getTime())) {
            return true
        }
    }

    return false;
}

function register(user) {
    return axios.post(USERS_API, user);
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated,
    register
};