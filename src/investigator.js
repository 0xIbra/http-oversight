const request = require('request-promise-native');
const { extractHttpData, normalizeRequest, normalizeResponse, parseUrl } = require('./utils/utils');

async function httpOrHttps(url) {
    let parsedUrl = parseUrl(url)

    parsedUrl.protocol = 'http:';
    url = parsedUrl.toString();

    let http = await httpAccess(url);

    parsedUrl.protocol = 'https:';
    url = parsedUrl.toString();

    let https = await httpsAccess(url);

    let result = null;
    if (http === true) {
        result = 'http';
    }

    if (https === true) {
        result = 'https';
    }

    if (https === true && http === true) {
        result = 'both';
    }

    return result;
}

async function httpAccess(url) {
    let parsedUrl = parseUrl(url);
    parsedUrl.protocol = 'http:';
    url = parsedUrl.toString();

    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        let data = extractHttpData(url, { response });
        if (data.request != null && data.request.uri != null) {
            if (data.request.uri.startsWith('http://')) {
                return true;
            }
        }

        return false;
    } catch (e) {
        let response = handleRequestErrors(url, e);

        if (response.request != null && response.request.uri != null) {
            if (response.request.uri.startsWith('http://')) {
                return true;
            }
        }

        return false;
    }
}

async function httpsAccess(url) {
    let parsedUrl = parseUrl(url);
    parsedUrl.protocol = 'https:';

    url = parsedUrl.toString();

    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        let data = extractHttpData(url, { response });
        if (data.request != null && data.request.uri != null) {
            if (data.request.uri.startsWith('https://')) {
                return true;
            }
        }

        return false;
    } catch (e) {
        let response = handleRequestErrors(url, e);

        if (response.request != null && response.request.uri != null) {
            if (response.request.uri.startsWith('https://')) {
                return true;
            }
        }

        return false;
    }
}

async function httpToHttps(url) {
    let parsedUrl = parseUrl(url);
    parsedUrl.protocol = 'http:';
    url = parsedUrl.toString();

    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        let redirects = response.request._redirect.redirects;
        for (let i = 0; i < redirects.length; i++) {
            let redirect = redirects[i];

            if (redirect.redirectUri != null && redirect.redirectUri.startsWith('https://')) {
                return true;
            }
        }

        return false;
    } catch (e) {
        if (e.response != null && e.response.request != null) {
            let request = normalizeRequest(url, e.response.request);

            for (let i = 0; i < request.redirects.length; i++) {
                let redirect = request.redirects[i];

                if (redirect.redirectUri != null && redirect.redirectUri.startsWith('https://')) {
                    return true;
                }
            }
        }

        return null;
    }
}

async function ping(url, accept200Only = false) {
    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        return true;
    } catch (e) {
        let res = handleRequestErrors(url, e);

        if (res == null) {
            return false;
        }

        if (res.error === true) {
            return false;
        }

        if (accept200Only === true) {
            return false;
        }

        return true;
    }
}

async function checkHeartbeat(url) {
    let parsed = parseUrl(url);
    url = parsed.toString();

    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        return true;
    } catch (e) {
        let data = handleRequestErrors(url, e);
        if (data.error === true && data.code === 'dns') {
            return false;
        }

        return true;
    }
}

async function getSSLData(url) {
    let parsedUrl = parseUrl(url);
    parsedUrl.protocol = 'https:';
    url = parsedUrl.toString();

    try {
        let response = await request({
            method: 'HEAD',
            uri: url,
            resolveWithFullResponse: true,
            followAllRedirects: true
        });

        response = await normalizeResponse(response);

        if (response.ssl != null) {
            return response.ssl;
        }

        return null;
    } catch (e) {
        let res = handleRequestErrors(e)
        if (res.error === true) {
            return null;
        }

        if (res.response != null && res.response.ssl != null) {
            return res.response.ssl;
        }

        return null;
    }
}

function handleRequestErrors(url, e) {
    if (e == null) {
        return null;
    }

    // # DNS Check
    if (e.error != null && e.error !== '') {
        if (e.error.code === 'ENOTFOUND') {
            return {
                error: true,
                type: 'DNS Lookup',
                code: 'dns',
                errorMessage: 'URL inaccessible. Check if URL is correct.'
            };
        }
    }

    if (e.error === '') {
        if (e.response != null && e.response.toJSON != null) {
            let data = extractHttpData(url, e);

            return {
                error: false,
                ...data
            };
        }
    }

    return {
        error: true,
        type: 'Unknown',
        errorMessage: null
    };
}

module.exports = {
    httpOrHttps,
    httpToHttps,
    httpAccess,
    httpsAccess,
    ping,
    checkHeartbeat,
    getSSLData
};
