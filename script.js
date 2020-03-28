$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();
    // clear input box
    $("#search-value").val("");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });
  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=aa550f330654aefb73397b4e69ec9a4c&units=imperial",
      dataType: "json",
      success: function(data) {
        var history = [];
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        if(data.main.temp >= 90){
          $(card).addClass("bg-danger");
        }
        if(data.main.temp <= 32){
          $(card).addClass("bg-info");
        }

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

        // call follow-up api endpoints
        getForecast(searchValue);
        //getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
//Get Started 
  function getForecast(searchValue){
    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=aa550f330654aefb73397b4e69ec9a4c&units=imperial",
      dataType: "json",
      success: function(data) {
        $("#forecast").html("<h4 class='mt-3'>5-Day Forecast:</h4>").append("<div class='row'>");

        for (var i = 0; i < data.list.length; i += 8){
          var col = $("<div>").addClass("col-md-2");
          //var card = $("<div>").addClass("card bg-primary text-white");
          if(data.list[i].weather[0].main == "Clouds"){
          var card = $("<div>").addClass("card bg-secondary");
          }
          else if(data.list[i].weather[0].main == "Rain"){
          var card = $("<div>").addClass("card bg-primary");
          }
          else{
          var card = $("<div>").addClass("card bg-warning");
          }
          var body = $("<div>").addClass("card-body p-2");

          var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

          var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
          var temp = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp_max + "F");
          var humi = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

          col.append(card.append(body.append(title, img, temp, humi)));
          $("#forecast .row").append(col);
        }
      }
    })
  }

});
