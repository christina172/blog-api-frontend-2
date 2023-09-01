import "../styles/index.css";
import "../styles/login.css";

localStorage.clear();

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    login(e);
});

function login(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const checkVal = form.checkValidity();
    form.reportValidity();
    if (checkVal) {
        fetch(`http://localhost:3000/myblog/log-in`, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": username, "password": password })
        }).then(response => {
            let json = response.json();
            return json;
        }).then(json => {
            if (json.success) {
                let { success, user: { name }, token } = json;
                return { success, name, token };
            } else {
                let { success, message } = json;
                throw new Error(message);
            }
        })
            .then(res => {
                localStorage.setItem("token", res.token);
                localStorage.setItem("name", res.name);
                document.location.href = "index.html";
            }).catch(err => {
                const formError = document.querySelector(".form-error");
                formError.textContent = err.message;
                console.log(err);
                return err;
            });
    };
};