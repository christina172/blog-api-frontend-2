# blog-api-frontend-2
Frontend-2 for Blog API Project (The Odin Project, JavaScript Path, Node.js Course, APIs)

This is the second front end for the blog api. The site consists of four pages and has a simple, but responsive design (the project is focused on connecting the back end with the front end - setting up the API and accessing it from the outside).
The four pages are: 1. a login page (uses bcryptjs), 2. the home page with a list of all the posts and some functionality to manipulate them (delete, change status (published/unpublished), a link to view the post and a link to edit the post), 3. a post page with the text of the post, a list of all the comments with the ability to delete them and a link to the edit post form, 4. a form page, which depending on where it's been accessed from includes a form either to write a new post or to edit an excisting post (in this case the form is populated with the post data). 
There is only one user (me). The authentication and authorization are handled with the help of a JWT, which is stored in the local storage. When the user logs out, the storage is cleared. All routes (except for login) are protected, and if the token expires, the local storage is cleared and the user is redirected to the login page.

The project uses plain HTML and CSS with no front-end frameworks and is compiled with webpack.

Blog API project (back end) repo on github: https://github.com/christina172/blog-api.

Live preview link https://christina172.github.io/blog-api-frontend-2/
