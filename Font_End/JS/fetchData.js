const loggedUsername = () => {
    let userNameElement = document.getElementById('logged-username');

    // find user name from local storage
    let user = localStorage.getItem('loggerIdUser');
    if(user){
        user = JSON.parse(user);
    }

    // show username in the web page

    userNameElement.innerText = user.UserName;
}

const checkLoggedInUser = () =>{
    let user = localStorage.getItem('loggerIdUser');
    if(user){
        user = JSON.parse(user);
    }
    else{
        window.location.href = "/index.html";
    }
}
const logOut = () =>{
    localStorage.clear();
    checkLoggedInUser();
}

const fetchAllPosts = async() => {
    let data;
    try{
        const res = await fetch("http://localhost:5000/getAllpost");
        data = await res.json();
        console.log(data);
        showAllPost(data);
    }
    catch(err){
       console.log("Error catching data from server");
    }
};

const showAllPost = (allPosts) => {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = "";

    allPosts.forEach(async (post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
         <div class="post-header">
                <div class="post-user-image">
                  <img class="img" src= ${post.postedUserImage}>
                </div>

                <div class="post-username-time">
                    <div class="post-username">
                       <p>${post.postedUserName}</p>
                    </div>

                    <div class="posted-time">
                        
                        <span> ${TimeDifference(`${post.postedTime}`)}</span>
                        <span>ago</span>
                    </div>
                </div>
            </div>

            <div class="post-text">
                <p>${post.postText}</p>
            </div>

            <div class="post-image">
                <img src=${post.postImageUrl}>
            </div>
        `;
        postContainer.appendChild(postDiv);

       // comments under a post        
       let postComments = await fetchAllOfAPost(post.postId);
       console.log("Post comments: ",postComments);

       postComments.forEach( (comment) =>{
          const commentHolderDiv = document.createElement('div');
          commentHolderDiv.classList.add('comment-holder');
          commentHolderDiv.innerHTML = `
                <div class="comment">
                    <div class="commet-user-image">
                        <img src=${comment.commentedUserImage}>
                    </div>
                    <div class="comment-text-container">
                         <h4>${comment.commentedUserName}</h4>
                         <p class="comment-text">${comment.commenttext}</p>
                    </div>
                </div>

          `;
          postDiv.appendChild(commentHolderDiv);
       });
    //    adding new comment to the post
    const addNewCommentDiv = document.createElement("div");
    addNewCommentDiv.classList.add('post-comment-holder');

    addNewCommentDiv.innerHTML = `
                <div class="post-comment-input-field-holder">
                    <input type="text" placeholder="comment about this post" id="postcomment-input-for-postId-${post.postId}" class="post-comment-input-field">
                </div>
                <div class="comment-btn-holder">
                    <button onClick=handlePostComment(${post.postId}) id="comment-btn" class="postcomment-btn">
                        comment
                    </button>
                </div>
    `;
    postDiv.appendChild(addNewCommentDiv);
    });
    
};

const handlePostComment = async (postId) =>{
    // console.log("Adding comment to the postnumber:",postId);
    // collection loged in user id from localstorage
    let user = localStorage.getItem('loggerIdUser');
    if(user){
       user = JSON.parse(user);
    }

    const commentedUserId = user.userId;

    // getting comment text from input

    const commentTextElement = document.getElementById(`postcomment-input-for-postId-${postId}`);
    const commentedText = commentTextElement.value;
    
   // current time of the comment
   let now = new Date();
   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
   let timeOfComment = now.toISOString();
   
   const commentObject = {
    commentOfPostId	: postId,
    commentedUserId	: commentedUserId,
    commenttext : commentedText,
    commentTime : timeOfComment,
   };
   try{
    const res = await fetch("http://localhost:5000/postComment",{
        method: "POST",
        headers: {
            'content-type' : 'application/json',
        },
        body: JSON.stringify(commentObject), 
    });
    const data = await res.json();
    
   }
  catch(err){
     console.log("Error while sending data to the server: ",err);
  }
  finally{
    location.reload();
  }

}
const fetchAllOfAPost = async(postId) => {
    let commentsOfPost = [];

    try{
        const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
        commentsOfPost = await res.json();
    }
    catch(err){
        console.log("Error fetching comments from the server: ",err);
    }
    finally{
        return commentsOfPost;
    }
}
// add new post
const handleAddNewPost = async() =>{
    //get user id from localstorage
    let user = localStorage.getItem('loggerIdUser');
    if(user){
       user = JSON.parse(user);
    }

    const postedUserID = user.userId;
  // current time of the post
    let now = new Date();
   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
   let timeOfPost = now.toISOString();

   // Post text
   const PostTextElement = document.getElementById('newPost-text');
   const postText = PostTextElement.value;

   // post image
   const postImageElemet = document.getElementById('newPost-img');
   const postImageUrl = postImageElemet.value;

   // create post object

   const postObject ={
    postedUserId : postedUserID,
    postedTime : timeOfPost,
    postText : postText,
    postImageUrl : postImageUrl,

   }
   try{
    const res = await fetch("http://localhost:5000/addNewPost",{
        method: "POST",
        headers: {
            'content-type' : 'application/json',
        },
        body: JSON.stringify(postObject), 
    });
    const data = await res.json();
    
   }
  catch(err){
     console.log("Error while sending data to the server: ",err);
  }
  finally{
    location.reload();
  }
}

fetchAllPosts();
checkLoggedInUser();
loggedUsername();
