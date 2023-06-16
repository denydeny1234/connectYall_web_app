# M3-CB-02-Trust-and-Launch

Project repository for group Trust&Launch - Semester 3.

## Usage instructions

Link to hosted website: https://connectyall.onrender.com

It might take a bit longer to load (should not be longer than a few minutes though). It would be ideal if you can open it on your phone,  but it works on browser as well (prefferably Chrome - as you can **view it in inspect**, and have an app-like experience).

To download the files on your computer, it should work directly locally, on port 3000. It uses a database connected to MongoDB, running on a NodeJS express server.
If, however, it does not work and you still want to view it locally, you should use **npm install <driver name>** to install Express, MongoDB and ejs.
To acces locally:** run node app.js **in terminal, then acces it via broswer using localhost:3000/index.js.

## About this project

The scope of this project is to come up with a solution to the ongoing problem of people facing a hard time finding friends/acquaintances who share the same interests as them. 

The concept we are working on developing follows the idea of connecting people who have similar hobbies with eachother, with the help of an application, _connectYall_. The main focus is an algorithm that searches thourgh all users and checks, for those who are not already connected (with eachother) if there is at least a 50% compatibility between the two people. If so, each week, the users get three weekly matches, where they will find available people who share the same hobbies as them. 

Another interesting feature of the application, is the anonimity of the users; when 2 users first become friends, they cannot see each others profile pictures - only the hobbies they share and a small description of them. Unless they both agree to do so (upon talking, for example), they can reveal their profile pictures to each other.


## Technologies used

For this project it was used:
- HTML&CSS for front-end;
- EJS - a templating tool to create HTML elements only by using JavaScript;
- JavaScript for front-end and back-end;
- NodeJS (Express);
- MongoDB;

