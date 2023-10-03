export let token;

export const setToken = (newToken) => {
    token = newToken;
};

export function getComments() {
    return fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер сломался, попробуй позже');
            }
            return response.json();
        });
}

export function postComment({ name, text }) {
    return fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: text,
            name: name,
            forceError: false,
        }),
    })
}

export function registrationUser ( {loginInputValue, nameInputValue, passwordInputValue} ) {
    return fetch('https://wedev-api.sky.pro/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login: loginInputValue,
            name: nameInputValue,
            password: passwordInputValue
        }),
    }).then((response) => {
        if (response.status === 400) {
            alert('Пользователь с таким логином уже сущетсвует');
            throw new Error('Пользователь с таким логином уже сущетсвует');
        } else {
            return response.json();
        }
    })
}

export function loginUser ( {loginInputValue, passwordInputValue} ) {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login: loginInputValue,
            password: passwordInputValue
        }),
    }).then((response) => {
        if (response.status === 400) {
            alert('Введён неверный логин или пароль');
            throw new Error('Введён неверный логин или пароль');
        } else {
            return response.json();
        }
    })
}