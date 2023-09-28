import { formatDate, escapeHTML } from "./utils.js";

export const renderComments = (comments, commentsList, commentInput) => {
    commentsList.innerHTML = '';

    for (let comment of comments) {
        const newComment = document.createElement('li');
        newComment.classList.add('comment');

        newComment.innerHTML = `
          <div class="comment-header">
            <div>${escapeHTML(comment.name)}</div>
            <div>${formatDate(comment.date)}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${escapeHTML(comment.text)}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
            </div>
          </div>
        `;

        commentsList.appendChild(newComment);

        newComment.querySelector('.like-button').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLikeComment(comments, comment, commentsList, commentInput);
        });

        const commentTextElement = newComment.querySelector('.comment-text');
        const commentHeaderElement = newComment.querySelector('.comment-header');

        commentTextElement.addEventListener('click', () => {
            autofillForm(comment, commentInput, commentsList);
        });
        commentHeaderElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
};

export const toggleLikeComment = (comments, comment, commentsList, commentInput) => {
    comments.forEach((item, i) => {
        if (item.name === comment.name && item.text === comment.text) {
            comments[i] = { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 };
        }
    });

    renderComments(comments, commentsList, commentInput);
};

export const autofillForm = (comment, commentInput, commentsList) => {
    const text = comment.text;

    commentInput.value = `> ${text}\n\n`;
    commentInput.focus();
};