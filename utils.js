export const escapeHTML = (text) => {
    const entitiesMap = new Map([
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
        ["'", '&#39;']
    ]);

    return Array.from(entitiesMap.keys()).reduce((acc, key) => {
        return acc.replaceAll(key, entitiesMap.get(key));
    }, text);
};

export const formatDate = (date) => {
    const options = { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('ru', options).replace(',', '');
};

export const showError = (element, message) => {
    element.classList.add("error");
    if (message) {
        alert(message);
    }
};

export const hideError = (element) => {
    element.classList.remove("error");
};