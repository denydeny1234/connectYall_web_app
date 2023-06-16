//make connections to dependecies needed in order to use the app

const express = require ('express');
const port = process.env.PORT || 3000; //port
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://connectYall:connectYallDB@cluster0.shqccfi.mongodb.net/?retryWrites=true&w=majority"; //connect to the database on the atlas server
const fs = require('fs');
const users_notfrends=[]; //create an empty array to store the values from users who are not friends with our loggd in user

const file = fs.readFileSync('public/users.json')

const app = express();

app.set('view engine', 'ejs'); //set ejs as view engine

var bodyParser = require('body-parser'); //require body parser to process  the data sent in an HTTP body
app.use( bodyParser.json() );      
    app.use(bodyParser.urlencoded({    
        extended: true
    })
)


//API MIDDLEWARE
app.use(express.json()); //accept data in json format

app.use(express.urlencoded({ extended: true }));

//app.use(express.urlencoded()); //decode the data sent through the html form

app.use(express.static('public')); //serve public folder as a static folder

//API ROUTES
app.get('/form', (req, res)=>{ //manages the log in form in order to connect an existing user in the database
    res.sendFile(__dirname + '/public/signIn.html');
});



app.post('/login', (req, res)=>{ //this route will serve as a place to filter data in order to login the user and to filter the friends they have/find matches based on common hobbies
   

    MongoClient.connect( //connected to the database in different collections
        url,
        function(err, db){
            if(err) throw err;
            var dbo = db.db("connectYall");
            var data = dbo.collection("users").find({email: req.body.email, password: req.body.password}).count( function(err, result){
                if(err) throw err;
                
                if (result == 0) {
                    console.log("sorry"); //if there is no existing  user with the credentials entered
                } else if(result == 1){
                    console.log("ok");

                }
            });
            var data_1 = dbo.collection("users").find({email: req.body.email, password: req.body.password}, {projection : { name : 1}}).toArray(function(err, result) {
                if (err) throw err;
                const user_id = result[0]['_id']; //user id connected
                var promise1 = Promise.resolve(user_id);


                promise1.then(function(user_id){
                   

                    var data_2 = dbo.collection("users").count( function(err, result){ //take all the users in the db
                        if(err) throw err;
                        var no_user = result; // number of users in the database
                        var promise2 = Promise.resolve(no_user); 

                        promise2.then(function(no_user){
                            var data_3 = dbo.collection("friends").find({},{projection : {_id: 0}}).toArray( function(err, result) { //checks through all the friends connections in the db
                                if (err) throw err;
                                
                                  
                                    for(let j=2; j<=no_user+1; j++){
                                        if(j != user_id){
                                            var ok = 0; //you are not friends with that users
                                            }
                                        for(let i=0; i< result.length; i++)  
                                        {
                                            if(result[i]["user1"] == user_id && result[i]["user2"] == j)
                                            {
                                                ok = 1; 
                                                break;
                                            }
                                        } //here we check if there are any users who are not friends with the connected user
                                    
                                        if(ok == 0){
                                            //filter hobbies for users who are not friends with the logged in user 

                                            var promise3 = Promise.resolve(j);
                                        
                                            promise3.then(function(id_enemy){ //we look through the database for the user who is not friends with the connect user and 'promise' to return the name and the age
                                                var data_4 = dbo.collection("users").find({_id: id_enemy}, {projection : {_id: 0, name: 1, age: 1}}).toArray(function(err, result){
                                                    const data ={ //store the information about the users who are not friends that we want to send to the ejs page
                                                        id: id_enemy,
                                                        name: result[0]['name'],
                                                        age: result[0]['age'],
                                                        proc: 50,
                                                        images: ["images/cooking.jpeg", "images/music.jpeg", "images/fishing.jpeg", "images/boxing.jpg"]//store the images in an array
                                                                
                                                        
                                                    }
                                                    users_notfrends.push(data);//concatenates the data from the variable to the users_notfrends variable in a json format
                                                    fs.writeFileSync("public/users.json", JSON.stringify(users_notfrends));
                                                   
                                                });

                                            })
                                        }
                                        

                                    }
                            });
                                    
                        });



                    });
        
                });



            });
            var data = fs.readFileSync('public/users.json');//take the data from the json file we created above
            var user_notfrends = JSON.parse(data);
            user_notfrends[1]['proc']=75;

           user_notfrends[1].images[2] = "images/cycling.jpeg";
           user_notfrends[1].images[3] = "images/running.jpeg";
            //console.log(user_notfrends[1]['images'][2]);
            res.render("user_profile" , {data: user_notfrends});
    });
    
});


//here is part of the backend code we tried to connect to the front end and make it work as a two way channel, to be able to send and recieve messages from your friends
/*app.post('/chat', (req,res)=>{

    console.log("entered chatroom!");
    res.sendFile(__dirname + '/public/chat.html');
   //res.redirect(__dirname + '/public/chat.html');
});
app.post('/messages', (req,res)=>{
    (function(){

        const app = document.querySelector(".app");
        const socket = io();
        let uname = 'gheorghe';
        console.log("here too");
        /*app.querySelector(".join-screen #join-user").addEventListener("click",function(){
            let username = app.querySelector(".join-screen #username").value;
            if(username.length == 0){
                return;
            }
            socket.emit("newuser",username);
            uname = username;
            app.querySelector(".join-screen").classList.remove("active");
            app.querySelector(".chat-screen").classList.add("active");
        });*
    
        app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
            let message = app.querySelector(".chat-screen #message-input").value;
            if(message.length  == 0){
                return;
            }
            renderMessage("my",{
                username:uname,
                text:message
            });
            socket.emit("chat",{
                username:uname,
                text:message
            });
            app.querySelector(".chat-screen #message-input").value = "";
        });
    
        app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
            socket.emit("exituser",uname);
            window.location.href = window.location.href;
        });
    
        socket.on("update",function(update){
            renderMessage("update",update);
        });
        
        socket.on("chat",function(message){
            renderMessage("other",message);
        });
    
        function renderMessage(type,message){
            let messageContainer = app.querySelector(".chat-screen .messages");
            if(type == "my"){
                let el = document.createElement("div");
                el.setAttribute("class","message my-message");
                el.innerHTML = `
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
                messageContainer.appendChild(el);
            } else if(type == "other"){
                let el = document.createElement("div");
                el.setAttribute("class","message other-message");
                el.innerHTML = `
                    <div>
                        <div class="name">${message.username}</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
                messageContainer.appendChild(el);
            } else if(type == "update"){
                let el = document.createElement("div");
                el.setAttribute("class","update");
                el.innerText = message;
                messageContainer.appendChild(el);
            }
            // scroll chat to end
            messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
        }
    
    })();

});*/

app.listen(port, ()=>{
    console.log('Server started');
});
