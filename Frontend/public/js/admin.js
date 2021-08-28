// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
$(document).ready(function () {
    const backendserverurl = "http://localhost:8081";
    let token = localStorage.getItem("token");
    axios.get(`${backendserverurl}/auth/`, { headers: { "token": "Bearer " + token } })
        .then((response) => {
            if (response.data.type != "Admin") {
                alert("You should not be on this page!!!");
                window.location.href = "/";
            };
        })
        .catch((error) => {
            alert("You should not be on this page!!!");
            window.location.href = "/";
        });
    axios.get(`${backendserverurl}/genre/`)
        .then((response) => {
            let genrecheckboxlist = [];
            response.data.forEach(genreinfo => {
                genrecheckboxlist.push(`
            <input class="form-check-input" type="checkbox" value="${genreinfo.genreid}" id="genre${genreinfo.genreid}" name="genrecheckbox">
            <label class="form-check-label" for="genre${genreinfo.genreid}">
            ${genreinfo.genre}
            </label>`);
            });
            $("#genrecheckboxes").append((genrecheckboxlist).join("<br>"))
            $('#addmovform').submit(function () {
                event.preventDefault()
                let genreslist = [];
                $.each($("input[name='genrecheckbox']:checked"), function () {
                    genreslist.push($(this).val());
                });
                const newmovreq = {
                    "title": $("#movietitle").val(), "description": $("#movdescription").val(),
                    "cast": $("#cast").val(), "time": $("#time").val() + " mins", "genreid": genreslist.join(","), "opening date": $("#opendate").val()
                };
                axios.post(`${backendserverurl}/movie/`, newmovreq,{ headers: { "token": "Bearer " + token } })
                    .then((resmovid) => {
                        if($("#movieimg").prop('files')[0]){
                        let formdata = new FormData();
                        formdata.append("movieimage", $("#movieimg").prop('files')[0])
                        axios({
                            method: "post",
                            url: `${backendserverurl}/movie/${resmovid.data.movieid}/image`,
                            data: formdata,
                            headers: { "Content-Type": "multipart/form-data" ,"token": "Bearer " + token },
                        })
                            .then((response) => {
                                alert("Movie added successfully with an image")
                                window.location.href = "/admin";
                                
                            })
                            .catch((error) => {
                                alert("Movie added successfully but adding image failed."+error.response.data)
                                window.location.href = "/admin"
                            });
                        }
                        else{
                            alert("Movie added successfully without an image")
                            window.location.href = "/admin";
                        }
                    })
                    .catch((error) => {
                        if(error.response.status==403 || error.response.status==401){
                            alert("No permission to add movie")
                        }
                        else{
                            alert("Adding movie failed")
                            console.log(error);
                        }
                    })

            });
        })
        .catch((error) => {
            console.log(error);
            alert("Not able to get genres");
        });
    $("#addgenreform").submit(function() {
        event.preventDefault();
        const genrereqdata = {"genre":$("#genrename").val(),"description":$("#genredescription").val()};
        axios.post(`${backendserverurl}/genre/`,genrereqdata,{ headers: { "token": "Bearer " + token } })
        .then((response) => {
            alert("New genre successfully added");
            window.location.href = "/admin";
        })
        .catch((error)=> {
            console.log(error)
            if(error.response.status==422){
                alert("Genre already added before")
            }
            else if(error.response.status==403 || error.response.status==401){
                alert("No permission to add genre")
            }
            else{
                alert("Genre was not able to be added");
                console.log(error);
            }
        });
    });
    axios.get(`${backendserverurl}/movie/`)
    .then((response)=>{
        console.log(response.data)
        selecthtml = ""
        response.data.forEach(moviedata => {
            selecthtml += `<option data-movieid="${moviedata.movieid}">${moviedata.title}</option>`
        });
        $("#movieselect").append(selecthtml)
        $("#addscreentimeform").submit(function(){
            event.preventDefault()
            axios.post(`${backendserverurl}/movie/${$("#movieselect").find(':selected').data('movieid')}/screeningtime`,{screeningtime:$("#screentime").val()},{ headers: { "token": "Bearer " + token } })
            .then((response)=>{
                alert("Screening time was added")
                window.location.href = "/admin";
            })  
            .catch((error)=>{
                if(error.response.status==403 || error.response.status==401){
                    alert("No permission to add Screening time")
                }
                else{
                    alert("Screening time was not able to be added");
                    console.log(error);
                }
            })
        })
    })
});