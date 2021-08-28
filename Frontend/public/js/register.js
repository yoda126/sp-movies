// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
$(document).ready(function(){
    const backendserverurl = "http://localhost:8081"
    let token = localStorage.getItem("token");
    if(token){
    axios.get(`${backendserverurl}/auth/`,{headers: {"token":"Bearer " + token}})
    .then((response) => {
        window.location.href = "/";
    })
    .catch((error) => {
        console.log(error)
    });
    };
    $("#registerform").submit(function () {
        event.preventDefault();
        const request = { "username": $("#username").val(), "password": $("#password").val(), "email":$("#email").val(),"contact":$("#contact").val()};
        axios.post(`${backendserverurl}/users/`, request)
            .then((response) => {
                console.log(response)
                alert("New account succesfully created");
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status == 400) {
                    $("#registererror").remove();
                    $("#registerformgroup").append(`<p style="color: red;" id="registererror">Username or password not according to parameter</p>`);
                }
                else if (error.response.status == 422){
                    $("#registererror").remove();
                    $("#registerformgroup").append(`<p style="color: red;" id="registererror">Username already used</p>`);
                } 
                else {
                    $("#registererror").remove();
                    $("#registerformgroup").append(`<p style="color: red;" id="registererror">Login failed unexpectedly.</p>`);
                }
            });
    });
});