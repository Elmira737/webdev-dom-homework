export let token;

export const setToken = (newToken) => {
    token = newToken;
};

export function getComments() {
    return fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
        method: 'GET',
    }).then((response) => {
        if (response.status === 500) {
            throw new Error('Сервер сломался, попробуй позже');
        }
        return response.json();
    });
}

export function postComment({ name, text }) {
    return fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
        method: 'POST',
        body: JSON.stringify({
            text: text,
            name: name,
            forceError: false,
        }),
    })
}