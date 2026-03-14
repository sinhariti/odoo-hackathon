const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('token');
}

async function request(method, url, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${url}`, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message = data?.error || `Request failed with status ${res.status}`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

const api = {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    put: (url, body) => request('PUT', url, body),
    delete: (url) => request('DELETE', url),
};

export default api;
