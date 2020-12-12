function extractHttpData (url, e) {
    if (e.response != null && e.response.toJSON != null) {
        let request = {};
        if (e.response.request != null) {
            request = normalizeRequest(url, e.response.request);
        }

        let response = normalizeResponse(e.response);

        return {
            request,
            response
        };
    }


    return null;
}

function normalizeRequest(url, request) {
    if (request == null) {
        return null;
    }

    let normalized = request.toJSON();
    normalized.url = url;
    if (typeof normalized.uri === 'object') {
        normalized.uri = normalized.uri.format();
    }

    let _redirects = request._redirect.redirects;
    let redirects = [];
    let lastUrl = null;
    for (let i = 0; i < _redirects.length; i++) {
        let redirect = _redirects[i];
        lastUrl = redirect['redirectUri'];

        if (i === 0) {
            redirect['from'] = url;
        } else {
            redirect['from'] = lastUrl;
        }

        redirect['to'] = redirect['redirectUri'];

        redirects.push(redirect);
    }

    normalized.redirects = redirects;

    return normalized;
}

function normalizeResponse(response) {
    if (response == null) {
        return null;
    }

    let normalized = response.toJSON();
    delete normalized.request;

    normalized.status = normalized.statusCode;
    normalized.statusText = response.statusMessage;

    normalized.remote = {
        ip: response.connection.remoteAddress,
        port: response.socket.remotePort
    };

    let certificate = response.connection.getPeerCertificate();
    normalized.ssl = null;
    if (certificate != null) {
        normalized.ssl = {
            subjectName: certificate.subject.CN,
            issuer: certificate.issuer.CN,
            validFrom: new Date(certificate.valid_from).getTime(),
            validTo: new Date(certificate.valid_to).getTime(),
            protocol: response.connection.getProtocol()
        };
    }

    return normalized;
}

function parseUrl(url) {
    let normalizedUrl = url

    if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = `http://${normalizedUrl}`;
    }

    return new URL(normalizedUrl);
}

module.exports = {
    extractHttpData,
    normalizeRequest,
    normalizeResponse,
    parseUrl
};
