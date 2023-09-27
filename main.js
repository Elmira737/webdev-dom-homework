"use strict";
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
    nameInput.classList.remove("error");
    commentInput.classList.remove("error");
    if (nameInput.value === '' || commentInput.value === '') {
      nameInput.classList.add("error");
      commentInput.classList.add("error");
      return;
    }

    addComment(nameInput.value, commentInput.value);

    addForm.classList.add('delete');
    commentLoader.classList.remove('delete');
    commentLoader.textContent = `Комментарий добавляется...`;

    nameInput.value = '';
    commentInput.value = '';
  });

  const formatDate = (date) => {
    const options = { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('ru', options).replace(',', '');
  };

  let comments = [];

  const getApiData = () => {
    container.classList.add('delete');
    pageLoader.textContent = `Пожалуйста, подождите. Загружаю комментарии...`;
    return fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
      method: 'GET',
    }).then((response) => {
      if (response.status === 500) {
        throw new Error('Сервер сломался, попробуй позже');
      } 
      return response.json()
        .then((responseData) => {
          comments = responseData.comments.map((comment) => {
            return {
              name: comment.author.name,
              date: new Date(comment.date),
              text: comment.text,
              likes: comment.likes,
              isLiked: false,
            };
          });
          renderComments(comments);
        });
    })
      .then((response) => {
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
  };

  const escapeHTML = (text) => {
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

  const addComment = async (name, text, likes = 0, date = new Date(), isLiked = false) => {
    const safeNameInputValue = escapeHTML(name);
    const safeCommentInputValue = escapeHTML(text);

    fetch('https://wedev-api.sky.pro/api/v1/elmira-kolchanova/comments', {
      method: 'POST',
      body: JSON.stringify({
        text: safeCommentInputValue,
        name: safeNameInputValue,
        forceError: true,
      }),
    }).then((response) => {
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

  const toggleLikeComment = (commentName) => {
    comments.forEach((comment, i) => {
      if (comment.name === commentName) {
        comments[i] = { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 };
      }
    });

    renderComments(comments);
  };

  const autofillForm = (name, text) => {
    commentInput.value = `> ${text}\n${name}\n\n`;
    commentInput.focus();
  };

  const renderComments = (comments) => {
    const allComments = commentsList.querySelectorAll('.comment');

    if (allComments.length >= 1) {
      commentsList.innerHTML = '';
    }

    if (Array.isArray(comments)) {
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
                  <button class="like-button ${comment.isLiked ? '-active-like' : ""}"></button>
                </div>
              </div>
        `;

        commentsList.appendChild(newComment);

        newComment.querySelector('.like-button').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleLikeComment(comment.name);
        });

        newComment.addEventListener('click', () => {
          autofillForm(comment.name, comment.text);
        });
      }
    }
  };

  renderComments(comments);

  deleteButtonElement.addEventListener('click', () => {
    const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?');
    if (askForDeleteComment) {
      comments.pop();
      renderComments(comments);
    }
  });

  console.log("It works!");