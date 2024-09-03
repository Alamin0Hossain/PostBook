const handlelogin = async () => {
    const userIdInput=document.getElementById('user-id');
    const passwordInput=document.getElementById('password');

    const userId = userIdInput.value;
    const password = passwordInput.value;

    const user = {
       userID: userId,
       Password: password,
    };
    const userInfo =await fetchUserInfo(user);
    const errElement = document.getElementById("user-login-error");
    // user data did not match with data
    if(userInfo.length === 0){
        errElement.classList.remove("hidden");
    }
    else{
        errElement.classList.add("hidden");

        //save data before jumping the next page
        localStorage.setItem("loggerIdUser",JSON.stringify(userInfo[0]));
         // Jumping the next page
        window.location.href = "/post.html";
    }
    
}
const fetchUserInfo = async (user) => {
    let data;
 try{
    const res = await fetch('http://localhost:5000/getUserInfo',{
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
       
      data = await res.json();
    }  
    
    catch(err){
            console.log("Error connection to the server: ",err);
    }

    finally{
        // console.log("User info from server: ", data);
        return data;
    }


};