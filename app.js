
    console.log("working");
    var queryURL = "https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&redirect_uri=https://cjjordan.github.io/BandApp/";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

    });