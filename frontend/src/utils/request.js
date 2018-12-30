import fetch from 'dva/fetch';
import CONFIG from '../utils/config';
import { notification } from 'antd'
const base = CONFIG.BASE;

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
/**
* Requests a URL, returning a promise.
*
* @param  {string} url       The URL we want to request
* @param  {object} [options] The options we want to pass to "fetch"
* @return {object}           An object containing either "data" or "err"
*/
function request(url, options = {}) {
    return fetch(base + url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => (data))
        .catch(err => {
            notification["error"]({
                message: `${err.response ? err.response.status : "未知错误"}`,
                description: `${url} ${err.response ? err.response.statusText : "未知错误"}`
            })
            return err.response.json();
        });
}


export default {
    request: request,
    get(url, data) {
        if (data) {
            return request(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
        } else {
            return request(url)
        }
    },
    post(url, data) {
        return request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    },
    put(url, data) {
        return request(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    },
    delete(url, data) {
        return request(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    },

}