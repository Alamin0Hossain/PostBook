const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const port = 5000;

const app = express();

//middleware

app.use(cors());
app.use(express.json());

//  app.get('/example', (req, res) => {
//    res.send("Hello world!");
//  });


//macking connection with mysql

let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'postbook2',
  port: 3309,
});
db.connect((err) => {
   if(err){
    console.log("Somthing went wrong while connecting to database: ",err);
    throw err; 
  }
  else{
    console.log("MYSQL server is connected...");
  }
});


// geting user info from server
app.post('/getUserInfo',(req, res) => {
  const  { userID, Password} = req.body;


 const getUserInfosql = `SELECT userId, UserName, userImage FROM users WHERE users.userId = ? AND users.password = ?`;
 let query = db.query(getUserInfosql, [userID, Password], (err, result)=>{
     if(err){
      console.log("Error geting user info from server: ",err);
      throw err;
     }
     else{
      res.send(result);
     }
 })

});

// get request
app.get('/getAllpost', (req, res) =>{
  const sqlForAllPosts = `SELECT users.UserName AS postedUserName, users.userImage AS postedUserImage, posts.postedTime, posts.postText, posts.postImageUrl, posts.postId FROM posts INNER JOIN users ON posts.postedUserId=users.userId ORDER BY posts.postedTime DESC`;

  let query = db.query(sqlForAllPosts, (err, result) => {
      if(err){
        console.log("Error loading all posts from database: ",err);
        throw err;
      }
      else{
        console.log(result);
        res.send(result);
      }
  });
});

// geting comments of a single post
app.get('/getAllComments/:postId', (req, res) =>{
  let id = req.params.postId;

  let sqlForAllComments = `SELECT users.UserName AS commentedUserName, users.userImage AS commentedUserImage, comments.commentID,comments.commentOfPostId,comments.commenttext,comments.commentTime FROM comments INNER JOIN users ON comments.commentedUserId=users.userId WHERE comments.commentOfPostId=${id}`;

  let query = db.query(sqlForAllComments, (err, result) =>{
    if(err){
       console.log("Error fetching comments from database: ",err);
       throw err;
    }else{
      res.send(result);
    }
  })
});

// adding new comment to a post
app.post('/postComment', (req, res) =>{
//  const dataFromFontEnd = req.body;
//  console.log(dataFromFontEnd);
 const {commentOfPostId, commentedUserId, commenttext, commentTime} = req.body;  
 
 let sqlForAddingNewComment = `INSERT INTO comments (commentID, commentOfPostId, commentedUserId, commenttext, commentTime) VALUES (NULL, ?, ?, ?, ?)`;

 let query = db.query(
  sqlForAddingNewComment,
  [commentOfPostId, commentedUserId, commenttext, commentTime],
  (err, result) =>{
    if(err){
      console.log("Error adding comment to the database: ",err);
    }else{
      res.send(result);
    }
  }
 );
 
});

// add new post from website
app.post('/addNewPost', (req, res) => {
  // destructure the req.body object
  const {postedUserId,postedTime,postText,postImageUrl} = req.body;

  // SQL query for adding new post
  const sqlForAddingNewPost = `INSERT INTO posts (postId, postedUserId, postedTime, postText, postImageUrl) VALUES (NULL, ?, ?, ?, ?)`;
  let query = db.query(sqlForAddingNewPost, [postedUserId,postedTime,postText,postImageUrl], (err, result) => {
        if(err){
          console.log("Error fetching to adding new post: ",err);
          throw err;
        }
        else{
          res.send(result);
        }
  });



})

app.listen(port, () => {
  console.log(`Server is runing on port number: ${port}`);
});