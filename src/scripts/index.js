import format from 'date-fns/format';
import "../styles/index.css";

import deleteIcon from "../images/delete.svg";
import editIcon from "../images/edit.svg";

const header = document.querySelector("h2");
const postsContainer = document.querySelector(".posts-container");

const nameHeader = document.querySelector("h3");
nameHeader.textContent = localStorage.getItem("name") || "Username";

async function deletePost(post) {
    try {
        let response = await fetch(`https://blog-api-3e85.onrender.com/myblog/posts/${post._id}`, {
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

async function changeStatus(post) {
    try {
        let response = await fetch(`https://blog-api-3e85.onrender.com/myblog/posts/${post._id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify({ "published": !post.published })
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

async function getPosts() {
    try {
        let response = await fetch("https://blog-api-3e85.onrender.com/myblog/posts", {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
        if (response.status == 401) {
            throw new Error("401 Unauthorized");
        }
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let posts = await response.json();
        return posts;
    } catch (error) {
        if (error.message == "401 Unauthorized") {
            document.location.href = "login.html";
        } else {
            console.log(error);
            throw new Error(error);
        }
    }
};

const displayError = function (err) {
    postsContainer.textContent = "Something went wrong.";
};

function displayPosts(posts) {
    header.textContent = "Posts";
    const addLink = document.createElement("a");
    addLink.textContent = "Write a new post";
    addLink.classList.add("add-button");
    addLink.setAttribute("href", "form.html");

    postsContainer.append(addLink);

    if (posts) {
        posts.forEach(post => {
            const postContainer = document.createElement("div");
            postContainer.classList.add("post-container-preview");
            if (post.published) {
                postContainer.classList.add("unpublish");
            } else {
                postContainer.classList.add("publish");
            }

            const postInfo = document.createElement("div");
            postInfo.classList.add("post-info-preview");

            const postTitle = document.createElement("h4");
            postTitle.classList.add("post-title-preview");
            postTitle.textContent = post.title;

            const postDate = document.createElement("p");
            postDate.textContent = `${format(new Date(post.timestamp), "PPPp")}`;
            postDate.classList.add("post-date-preview");

            const postControls = document.createElement("div");
            postControls.classList.add("post-controls-preview");

            const publishButton = document.createElement("button");
            if (post.published) {
                publishButton.textContent = "Unpublish";
            } else {
                publishButton.textContent = "Publish";
            };
            publishButton.addEventListener("click", () => {
                changeStatus(post);
            });

            const editLink = document.createElement("a");
            editLink.setAttribute("href", `form.html?id=${post._id}`);

            const editSVG = document.createElement("img");
            editSVG.classList.add("edit");
            editSVG.setAttribute("src", editIcon);
            editSVG.setAttribute("alt", "Edit a post");
            editSVG.setAttribute("title", "Edit");

            editLink.append(editSVG);

            const viewLink = document.createElement("a");
            viewLink.classList.add("view-link-preview");
            viewLink.setAttribute("href", `post.html?id=${post._id}`);
            viewLink.textContent = "View";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button")

            const deleteSVG = document.createElement("img");
            deleteSVG.classList.add("delete");
            deleteSVG.setAttribute("src", deleteIcon);
            deleteSVG.setAttribute("alt", "Delete a post");
            deleteSVG.setAttribute("title", "Delete");

            deleteButton.append(deleteSVG);
            deleteButton.addEventListener("click", () => {
                deletePost(post);
            })

            postInfo.append(postTitle, postDate);
            postControls.append(publishButton, editLink, viewLink, deleteButton);
            postContainer.append(postInfo, postControls);
            postsContainer.append(postContainer);
        });
    }
};

getPosts().then(displayPosts).catch(displayError);


