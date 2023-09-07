import format from 'date-fns/format';

import "../styles/index.css";
import "../styles/post.css";

import deleteIcon from "../images/delete.svg";

const nameHeader = document.querySelector("h3");
nameHeader.textContent = localStorage.getItem("name") || "Username";

const commentsHeader = document.querySelector("h4");

const url = new URL(location.href);
const postId = url.searchParams.get("id");

const postContainer = document.querySelector(".post-container");

async function deleteComment(comment) {
    try {
        let response = await fetch(`https://blog-api-3e85.onrender.com/myblog/posts/${comment.post}/comments/${comment._id}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
        if (response.status == 401) {
            throw new Error("401 Unauthorized");
        }
        let res = await response.json();
        if (!res.success) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        location.reload();
    } catch (error) {
        if (error.message == "401 Unauthorized") {
            document.location.href = "login.html";
        } else {
            console.log(error);
            throw new Error(error);
        }
    }
};

async function getPost(id) {
    try {
        let response = await fetch(`https://blog-api-3e85.onrender.com/myblog/posts/${id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
        if (response.status == 401) {
            throw new Error("401 Unauthorized");
        }
        let { post, allCommentsToAPost } = await response.json();
        return { post, allCommentsToAPost };
    } catch (error) {
        if (error.message == "401 Unauthorized") {
            document.location.href = "login.html";
        } else {
            throw new Error(error);
        }
    }
};

const displayError = function (err) {
    postContainer.textContent = "Something went wrong.";
    console.log(err);
};

function displayPost(response) {
    const { post, allCommentsToAPost } = response;

    const postTitle = document.querySelector(".post-title");
    postTitle.textContent = post.title;

    const postDate = document.querySelector(".post-date");
    postDate.textContent = format(new Date(post.timestamp), "PPPp");

    const postStatus = document.querySelector(".post-status");
    postStatus.textContent = post.published ? "Published" : "Unpublished";

    const postText = document.querySelector(".post-text");
    postText.textContent = post.text;

    const editButton = document.querySelector(".edit-button");
    editButton.setAttribute("href", `form.html?id=${post._id}`);

    if (post.published) {
        postContainer.classList.add("unpublish");
        editButton.classList.add("published");
    } else {
        postContainer.classList.add("publish");
        editButton.classList.add("unpublished");
    };

    commentsHeader.textContent = "Comments";

    const comments = document.querySelector(".comments");

    if (allCommentsToAPost.length) {
        allCommentsToAPost.forEach(comment => {
            const commentContainer = document.createElement("div");
            commentContainer.classList.add("comment");

            const commentHeader = document.createElement("div");
            commentHeader.classList.add("comment-header");

            const commentInfo = document.createElement("div");
            commentInfo.classList.add("comment-info");

            const commentAuthor = document.createElement("h5");
            commentAuthor.textContent = comment.author;

            const commentDate = document.createElement("p");
            commentDate.classList.add("comment-date");
            commentDate.textContent = format(new Date(comment.timestamp), "PPPp");

            commentInfo.append(commentAuthor, commentDate);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-comment-button");

            const deleteSVG = document.createElement("img");
            deleteSVG.classList.add("delete");
            deleteSVG.setAttribute("src", deleteIcon);
            deleteSVG.setAttribute("alt", "Delete a comment");
            deleteSVG.setAttribute("title", "Delete");

            deleteButton.append(deleteSVG);
            deleteButton.addEventListener("click", () => {
                deleteComment(comment);
            });

            commentHeader.append(commentInfo, deleteButton);

            const commentText = document.createElement("p");
            commentText.textContent = comment.text;

            commentContainer.append(commentHeader, commentText);
            comments.append(commentContainer);
        });
    }
};

getPost(postId).then(displayPost).catch(displayError);