// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
$(document).ready(function () {
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
    $("#loginform").submit(function () {
        event.preventDefault();
        const request = { "username": $("#username").val(), "password": $("#password").val() };
        axios.post(`${backendserverurl}/login/`, request)
            .then((response) => {
                token = response.data.token;
                localStorage.setItem("token", token);
                alert("Login succesful");
                window.location.href = "/";
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    $("#loginerror").remove();
                    $("#loginformgroup").append(`<p style="color: red;" id="loginerror">Login failed. Username or password may be wrong.</p>`);
                } else {
                    $("#loginerror").remove();
                    $("#loginformgroup").append(`<p style="color: red; id="loginerror"">Login failed unexpectedly.</p>`);
                }
            });
    });
});