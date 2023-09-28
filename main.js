"use strict";
import { getComments, postComment } from "./api.js";
import { renderComments, toggleLikeComment, autofillForm } from "./renderComments.js";
import { formatDate, escapeHTML, showError, hideError } from "./utils.js";

const nameInput = document.querySelector('.add-form-name');
const commentInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');
const commentsList = document.querySelector('.comments');
const deleteButtonElement = document.querySelector('.delete-form-button');
const container = document.querySelector('.container');
const addForm = document.querySelector('.add-form');
const pageLoader = document.querySelector('.page-loader');
const commentLoader = document.querySelector('.comment-loader');

addButton.addEventListener("click", () => {
    hideError(nameInput);
    hideError(commentInput);
    if (nameInput.value === '' || commentInput.value === '') {
        showError(nameInput, 'Пожалуйста, заполните все обязательные поля.');
        showError(commentInput, '');
        return;
    }

    addComment(nameInput.value, commentInput.value);

    addForm.classList.add('delete');
    commentLoader.classList.remove('delete');
    commentLoader.textContent = "Комментарий добавляется...";

    nameInput.value = '';
    commentInput.value = '';
});

let comments = [];

const getApiData = () => {
    container.classList.add('delete');
    pageLoader.textContent = "Пожалуйста, подождите. Загружаю комментарии...";
    getComments().then((responseData) => {
        comments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: new Date(comment.date),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        renderComments(comments, commentsList, commentInput);
        pageLoader.textContent = "";
        pageLoader.classList.add('delete');
        container.classList.remove('delete');
    })
    .catch((error) => {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
        console.warn(error);
        pageLoader.textContent = "";
        pageLoader.classList.add('delete');
        container.classList.remove('delete');
    });
}

const addComment = async (name, text, likes = 0, date = new Date(), isLiked = false) => {
    const safeNameInputValue = escapeHTML(name);
    const safeCommentInputValue = escapeHTML(text);

    postComment({ 
        name: safeNameInputValue, 
        text: safeCommentInputValue, 
    })
    .then((response) => {
        if (response.status === 500) {
            alert('Сервер сломался, попробуй позже');
            commentLoader.classList.add('delete');
            addForm.classList.remove('delete');
            nameInput.value = safeNameInputValue;
            commentInput.value = safeCommentInputValue;
        } else if (response.status === 400) {
            alert('Имя и комментарий должны быть не короче 3 символов');
            commentLoader.classList.add('delete');
            addForm.classList.remove('delete');
            nameInput.value = safeNameInputValue;
            commentInput.value = safeCommentInputValue;
        } else {
            getApiData();

            commentLoader.classList.add('delete');
            addForm.classList.remove('delete');
        }
    })
    .catch((error) => {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
        console.warn(error);
        commentLoader.classList.add('delete');
        addForm.classList.remove('delete');
        nameInput.value = safeNameInputValue;
        commentInput.value = safeCommentInputValue;
    });
}
getApiData();

deleteButtonElement.addEventListener('click', () => {
    const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?');
    if (askForDeleteComment) {
        comments.pop();
        renderComments(comments, commentsList, commentInput);
    }
});

console.log("It works!");