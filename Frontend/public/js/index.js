// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
$(document).ready(function () {
    function add0fortime(time){
        if (time<10){
            time = "0" + time;
        }
        return time;
    }; 
    //Format the inputdate into a good datetime string
    function convertdatetimeformat(inputdate){
        let datestring = `${inputdate.getFullYear()}-${add0fortime(inputdate.getMonth()+1)}-${add0fortime(inputdate.getDate())} ${inputdate.getHours()}:${add0fortime(inputdate.getMinutes())}:${add0fortime(inputdate.getSeconds())}`;
        return datestring;
    };
    const backendserverurl = "http://localhost:8081";
    function admineditmovie(moviedata) {//Add buttons and form if needed for admins to delete and edit the movies data
        let token = localStorage.getItem("token");
        if (token) {
            axios.get(`${backendserverurl}/auth/`, { headers: { "token": "Bearer " + token } })
                .then((response) => {
                    if (response.data.type == "Admin") {
                        $("#movieinfo").append(`
                    <input type="submit" name="edit movie" id="editmov" class="btn btn-primary btn-md mr-2" value="Edit">
                    <input type="submit" name="delete movie screening times" id="delmovscreen" class="btn btn-primary btn-md mr-2" value="Delete all screening time">
                    <input type="submit" name="delete movie" id="delmov" class="btn btn-danger btn-md" value="Delete">
                    `);
                        $("#delmovscreen").on("click",()=>{
                            axios.delete(`${backendserverurl}/movie/${moviedata.movieid}/screeningtime/`, { headers: { "token": "Bearer " + token } })
                            .then((response)=>{
                                alert("Movies's screening times deleted")
                                window.location.href = "/";
                            })
                            .catch((error)=>{
                                alert("Movie's screening times was not able to deleted");
                                console.log(error)
                            })
                        })
                        $("#delmov").on("click", () => {
                            axios.delete(`${backendserverurl}/movie/${moviedata.movieid}/`, { headers: { "token": "Bearer " + token } })
                                .then((response) => {
                                    alert("Movie successfully delete")
                                    window.location.href = "/";
                                })
                                .catch((error) => {
                                    alert("Movie was not able to deleted");
                                    console.log(error);
                                })
                        });
                        $("#editmov").on("click", () => {
                            $("#movieinfo").empty();
                            $("#movieinfo").append(`
                        <form id="editmovform">
                        <label for="movietitle">Movie Title: </label>
                        <input type="text" value = "${moviedata.title}" name="movietitle" id="movietitle" class="form-control" required>
                        <label for="movdescription">Description: </label>
                        <textarea type="text" name="movdescription" id="movdescription" class="form-control" required>${moviedata.description}</textarea>
                        <label for="cast">Cast:</label>
                        <input type="text" value = "${moviedata.cast}" name="cast" id="cast" class="form-control" required>
                        <label for="opendate">Opening date:</label>
                        <input type="text" value="${moviedata["opening date"]}"name="opendate" id="opendate" class="form-control" required>
                        <div class="mt-2">Genre:</div>
                        <div class="form-check" id="genrecheckboxes">
                        </div>
                        <label for="time">Duration:</label>
                        <input type="text" value = "${moviedata.time.split(" ")[0]}" name="time" id="time" class="mb-2 mt-2" required>mins<br>
                        <label for="edmovieimg">Image for movie:</label>
                        <input type="file" id="edmovieimg" name="movieimg" class="mb-2"><br>
                        <input type="submit" name="register" class="btn btn-secondary btn-md" value="Edit movie">
                        </form>`);
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
                                    $('#editmovform').submit(function () {
                                        event.preventDefault();
                                        let genreslist = [];
                                        $.each($("input[name='genrecheckbox']:checked"), function () {
                                            genreslist.push($(this).val());
                                        });
                                        const newmovreq = {
                                            "title": $("#movietitle").val(), "description": $("#movdescription").val(),
                                            "cast": $("#cast").val(), "time": $("#time").val() + " mins", "genreid": genreslist.join(","), "opening date": $("#opendate").val()
                                        };
                                        axios.put(`${backendserverurl}/movie/${moviedata.movieid}`, newmovreq, { headers: { "token": "Bearer " + token } })
                                            .then((resmovid) => {
                                                if ($("#edmovieimg").prop('files')[0]) {
                                                    let formdata = new FormData();
                                                    formdata.append("movieimage", $("#edmovieimg").prop('files')[0])
                                                    axios({
                                                        method: "post",
                                                        url: `${backendserverurl}/movie/${moviedata.movieid}/image`,
                                                        data: formdata,
                                                        headers: { "Content-Type": "multipart/form-data", "token": "Bearer " + token },
                                                    })
                                                        .then((response) => {
                                                            alert("Movie edited successfully with an image")
                                                            window.location.href = "/";

                                                        })
                                                        .catch((error) => {
                                                            alert("Movie edited successfully but adding image failed." + error.response.data)
                                                            window.location.href = "/";
                                                        });
                                                }
                                                else {
                                                    alert("Movie edited successfully without an image")
                                                    window.location.href = "/";
                                                }
                                            })
                                            .catch((error) => {
                                                if (error.response.status == 403 || error.response.status == 401) {
                                                    alert("No permission to add movie");
                                                }
                                                else {
                                                    alert("Editing movie failed");
                                                    console.log(error);
                                                };
                                            })

                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    alert("Not able to get genres");
                                });
                        })

                    };
                })
        }
    }
    function reviewform(movieid, token) {//review form for user if not reviewed before
        $("#userreviewform").submit(function () {
            event.preventDefault();
            const reviewreq = { "rating": $("#movierating").val(), "review": $("#reviewtext").val() };
            axios.post(`${backendserverurl}/movie/${movieid}/review/`, reviewreq, { headers: { "token": "Bearer " + token } })
                .then((response) => {
                    $("#userreviewcon").empty();
                    $("#userreviewcon").append(`
                <div class="col-lg-2"></div>
                <h2 class=col-lg-8>Review success</h2>
                <div class="col-lg-2"></div>`)
                })
                .catch((error) => {
                    console.log(error)
                })
        });
    }
    function usermoviereviewhtml(movieid, moviedata) {//function to handle the movie reviews
        let token = localStorage.getItem("token");
        if (token) {
            axios.get(`${backendserverurl}/auth/checkreview/${movieid}`, { headers: { "token": "Bearer " + token } })
                .then((response) => {
                    if (response.data == "no") {
                        $("section").append(`<div class="row mb-3" id="userreviewcon">
                <div class="col-lg-2"></div>
                <form class="col-lg-8  mr-2 ml-2" id="userreviewform">
                    <label for="movierating" id="reviewform">Rating:</label>
                    <select class="form-control" id="movierating">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                    <textarea type="text" id="reviewtext" name="reviewtext"class="form-control" placeholder="Leave your review here" required></textarea>
                    <button type="submit" class="btn btn-primary pull-right">Submit</button>
                </form>
                <div class="col-lg-2"></div>
                </div>`);
                        reviewform(movieid, token);//review form for user if not reviewed before
                        moviereviewhtml(movieid, moviedata);//get reviews for a movie and put on page
                    }
                    else {
                        moviereviewhtml(movieid, moviedata);
                    };
                })
                .catch((error) => {
                    $("section").append(`<div class="row"><div class="col-lg-2"></div><div class="col-lg-8"><h2>Log in to review</h2></div><div class="col-lg-2"></div></div>`);
                    moviereviewhtml(movieid, moviedata);
                });
        }
        else {
            $("section").append(`<div class="row"><div class="col-lg-2"></div><div class="col-lg-8"><h2>Log in to review</h2></div><div class="col-lg-2"></div></div>`);
            moviereviewhtml(movieid, moviedata);
        };
    };
    function moviereviewhtml(movieid, moviedata) {//get reviews for a movie and put on page
        axios.get(`${backendserverurl}/movie/${movieid}/reviews`)
            .then((response) => {
                let sumrating = 0;
                response.data.forEach(reviewdata => {
                    sumrating += reviewdata.rating;
                    const starshtml = ("<span class='fa fa-star checked'></span>").repeat(reviewdata.rating) + "<span class='fa fa-star'></span>".repeat(5 - reviewdata.rating)
                    if (!reviewdata.review) {
                        reviewdata.review = "";
                    }
                    const reviewshtml = `
                <div class="row mb-3">
                <div class="col-lg-2"></div>
                <table class="table col-lg-8 table-bordered ml-2 mr-2">
                    <thead class="thead-light">
                        <tr>
                            <th>${reviewdata.username}  <span style="float: right;" class="text-right">${reviewdata.created_at}<span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${starshtml}<br>
                                ${reviewdata.review}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="col-lg-2"></div>
                </div>`;
                    $("section").append(reviewshtml);
                });
                let averagratingstar = "";
                if (response.data.length == 0) {
                    $("section").append(`<div class="row"><div class="col-lg-2"></div><div class="col-lg-8"><h1>No reviews and ratings yet</h1></div><div class="col-lg-2"></div></div>`);
                    averagratingstar = "No ratings yet"
                }
                else {
                    averagrating = Math.round(sumrating / response.data.length);
                    averagratingstar = "<span class='fa fa-star checked'></span>".repeat(averagrating) + "<span class='fa fa-star'></span>".repeat(5 - averagrating);
                }
                $("#movieinfo").append("<p>Rating: " + averagratingstar + "</p>");
                admineditmovie(moviedata);//Add buttons and form if needed for admins to delete and edit the movies data
            })
            .catch((error) => {
                $("section").append("<h1 class='text-center'>Error retrieving movie review data</h1>");
                console.log(error);
                admineditmovie(moviedata);//Add buttons and form if needed for admins to delete and edit the movies data
            });

    }
    function moviehtml(response) {
        let counter = 1;
        let fullcardhtml = "";
        const carddeckbasemoviehtml = `<div class="row pb-4">
        <div class="col-lg-2"></div>
        <div class="card-deck col-lg-8">
        {replacehere}
        </div>
        <div class="col-lg-2"></div>
        </div>`;
        let carddeckcontent = "";
        //change href later
        response.data.forEach(movie => {
            if (movie.imagepath == null) {
                movie.imagepath = "images/No_Image_Available.jpeg"
            };
            carddeckcontent += `<div class="card">
            <img class="card-img-top " src="${movie.imagepath}" alt="${movie.title + "image"}">
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">Duration: ${movie.time}</p>
            </div>
            <a href="javascript:void(0);" class="stretched-link cardlink" data-movieid="${movie.movieid}"></a>
          </div>`;
            if (counter == 3) {
                fullcardhtml += carddeckbasemoviehtml.replace("{replacehere}", carddeckcontent);
                counter = 0;
                carddeckcontent = "";
            };
            counter++;
        });
        if (counter == 2) {
            carddeckcontent += `<div class="card" style="border: 0px;"></div><div class="card" style="border: 0px;"></div>`;
            fullcardhtml += carddeckbasemoviehtml.replace("{replacehere}", carddeckcontent);
        }
        if (counter == 3) {
            carddeckcontent += `<div class="card" style="border: 0px;"></div>`;
            fullcardhtml += carddeckbasemoviehtml.replace("{replacehere}", carddeckcontent);
        }
        $("section").empty();
        $("section").append(fullcardhtml);
        $('.cardlink').on("click", function () {//Making movie and review page clicking on the movie card
            console.log("test")
            const movieid = $(this).data().movieid
            axios.get(`${backendserverurl}/movie/${movieid}`)
                .then((movieresponse) => {
                    console.log("test")
                    $("section").empty()
                    if (movieresponse.data.length == 0) {
                        $("section").append(`<div class="row"><div class="col-lg-2"></div><h1 class="col-lg-8 text-center">Movie data not found<h1><div class="col-lg-2"></div></div>`);
                    }
                    else {
                        let screeningtimehtml = ""
                        if (!movieresponse.data.imagepath) {
                            var movimagepath = "images/No_Image_Available.jpeg";
                        }
                        else {
                            var movimagepath = movieresponse.data.imagepath;
                        }
                        let moviepagehtml = `<div class="row mb-5">
                    <div class="col-lg-2"></div>
                    <img class="col-lg-3 col-md-5" src="${movimagepath}" id="movieimage"></img>
                    <div class="col-lg-5 col-md-7" id="movieinfo"><h1 class="text-capitalize">${movieresponse.data.title}</h1>
                    <p>Cast: ${movieresponse.data.cast}</p>
                    <p>Duration: ${movieresponse.data.time}</p>
                    <p>Description: ${movieresponse.data.description}</p>
                    <p>Genre: ${movieresponse.data.genre}</p>
                    <p>Opening date: ${movieresponse.data["opening date"]}</p>
                    <p>Screening times:<br>`;
                        var nowtime = new Date()
                        axios.get(`${backendserverurl}/movie/${movieid}/screeningtime/`,{ headers: { "startdate": convertdatetimeformat(nowtime) } })
                            .then((screenresponse) => {
                                if (!screenresponse.data.length) {
                                    screeningtimehtml = "No screening time available"
                                }
                                else {
                                    screeningtime = screenresponse.data.join(", ")
                                    screenresponse.data.forEach(screentime => {
                                        screeningtimehtml += `<button type="button" class="btn btn-primary mr-2 mb-2">${screentime}</button>`
                                    });
                                };
                                moviepagehtml += `${screeningtimehtml}</p>
                    </div> 
                    <div class="col-lg-2"></div>
                    </div>`;
                                $("section").prepend(moviepagehtml);
                                usermoviereviewhtml(movieid, movieresponse.data);//function to handle the movie reviews
                            })
                            .catch((error) => {
                                console.log(error);
                                screeningtimehtml = "Error retrieving screening times for this movie";
                                moviepagehtml += `${screeningtimehtml}</p>
                        </div> 
                        <div class="col-lg-2"></div>
                        </div>`;
                                $("section").prepend(moviepagehtml);
                                usermoviereviewhtml(movieid, movieresponse.data);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    $("section").empty();
                    $("section").prepend("<h1 class='text-center'>Error retrieving movie data</h1>");
                });
        });
    };
    axios.get(`${backendserverurl}/movie/`)
        .then((response) => {
            moviehtml(response);
        })
        .catch((error) => {
            console.log(error);
        });
});

