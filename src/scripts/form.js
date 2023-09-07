import "../styles/index.css";
import "../styles/form.css";

const pageTitle = document.querySelector("title");

const nameHeader = document.querySelector("h3");
nameHeader.textContent = localStorage.getItem("name") || "Username";

const url = new URL(location.href);
const postId = url.searchParams.get("id");

const formHeader = document.querySelector("h2");
const form = document.querySelector("form");
const postTitle = document.querySelector("#title");
const postText = document.querySelector("#text");
const published = document.querySelector("#published");
const formError = document.querySelector(".form-error");

const returnButton = document.querySelector(".return");
returnButton.addEventListener("click", () => {
    history.back();
});

async function editPost(e, post) {
    e.preventDefault();
    const titleValue = postTitle.value;
    const textValue = postText.value;
    const publishedValue = published.checked;
    const checkVal = form.checkValidity();
    form.reportValidity();
    if (checkVal) {
        try {
            let response = await fetch(`https://blog-api-3e85.onrender.com/myblog/posts/${post._id}`, {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                },
                body: JSON.stringify({ "title": titleValue, "text": textValue, "published": publishedValue })
            });
            if (response.status == 401) {
                throw new Error("401 Unauthorized");
            };
            let res = await response.json();
            if (!res.success) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            document.location.href = `post.html?id=${post._id}`;
        } catch (error) {
            if (error.message == "401 Unauthorized") {
                document.location.href = "login.html";
            } else {
                displayError(error);
            }
        }
    };
};

async function addPost(e) {
    e.preventDefault();
    const titleValue = postTitle.value;
    const textValue = postText.value;
    const publishedValue = published.checked;
    const checkVal = form.checkValidity();
    form.reportValidity();
    if (checkVal) {
        try {
            let response = await fetch("https://blog-api-3e85.onrender.com/myblog/posts", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                },
                body: JSON.stringify({ "title": titleValue, "text": textValue, "published": publishedValue })
            });
            if (response.status == 401) {
                throw new Error("401 Unauthorized");
            } else if (response.status != 201) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            let newPost = await response.json();
            document.location.href = `post.html?id=${newPost._id}`;
        } catch (error) {
            if (error.message == "401 Unauthorized") {
                document.location.href = "login.html";
            } else {
                displayError(error);
            }
        }
    };
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
        let { post } = await response.json();
        return post;
    } catch (error) {
        if (error.message == "401 Unauthorized") {
            document.location.href = "login.html";
        } else {
            throw new Error(error);
        }
    }
};

function displayPostValues(post) {
    postTitle.value = post.title;
    postText.value = post.text;
    published.checked = post.published;
    form.addEventListener("submit", (e) => {
        editPost(e, post);
    });
};

const displayError = function (err) {
    formError.textContent = "Something went wrong.";
    console.log(err);
};

if (postId) {
    pageTitle.textContent = "My blog | Edit post";
    formHeader.textContent = "Edit post";
    getPost(postId).then(displayPostValues).catch(displayError);
} else {
    pageTitle.textContent = "My blog | Add a post";
    formHeader.textContent = "Add a post";
    form.addEventListener("submit", (e) => {
        addPost(e);
    });
}