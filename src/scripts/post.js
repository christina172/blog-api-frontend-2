import format from 'date-fns/format';

import "../styles/index.css";
import "../styles/post.css";

import deleteIcon from "../images/delete.svg";

const nameHeader = document.querySelector("h3");
nameHeader.textContent = localStorage.getItem("name") || "Username";

const url = new URL(location.href);
const postId = url.searchParams.get("id");

const postContainer = document.querySelector(".post-container");

async function deleteComment(comment) {
    try {
        let response = await fetch(`http://localhost:3000/myblog/posts/${comment.post}/comments/${comment._id}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
        if (response.status == 401) {
            localStorage.clear();
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let res = await response.json();
        if (!res.success) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        location.reload();
    } catch (error) {
        localStorage.clear();
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
        let response = await fetch(`http://localhost:3000/myblog/posts/${id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
        if (response.status == 401) {
            localStorage.clear();
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let { post, allCommentsToAPost } = await response.json();
        return { post, allCommentsToAPost };
    } catch (error) {
        if (error.message == "401 Unauthorized") {
            localStorage.clear();
            document.location.href = "login.html";
        } else {
            console.log(error);
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
    postDate.textContent = `Published on ${format(new Date(post.timestamp), "PPPp")}`;

    const postText = document.querySelector(".post-text");
    postText.textContent = post.text;

    const editButton = document.querySelector(".edit-button");
    editButton.setAttribute("href", `form.html?id=${post._id}`);

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