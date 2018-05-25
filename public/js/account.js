$(document).ready(function () {

  $.get('/users')
    .done(res => {
      res.forEach(e => $('#users').append(` <option value="${e}">${e}</option>`));
      parseUrl();
    });

  $.post('/account', { username: localStorage.getItem("username") })
    .done(res => $('#funds').text("$" + parseFloat(res).toFixed(2)));

  const completeTransaction = function (e) {
    e.preventDefault();
    const data = {
      name: $('#users').val(),
      amount: $('#amount').val()
    }

    transfer(data);
  }

  const transfer = (data) => $.post('/xfer', { ...data, owner: localStorage.getItem("username") }).done(res => $('#funds').text("$" + parseFloat(res).toFixed(2)))

  $('#xfer').on("click", completeTransaction);

  function parseUrl() {

    urlArr = window.location.search.substring(1).split("&");
    let amountArr = urlArr[1].split("=");
    $("#" + amountArr[0]).val(amountArr[1]);

    let userArr = urlArr[0].split("=");
    $('#users option')
      .filter(function() {return ($(this).text() === userArr[1])})
      .prop('selected', true);
  }

  
});
