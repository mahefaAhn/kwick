(function() {
    'use strict';
    $('#kwick_login').on('submit', function(event) {
        event.preventDefault();
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#pwd").value;
        login(username,password);
    });
    $('#kwick_signUp').on('submit', function(event) {
        event.preventDefault();
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#pwd").value;
        signin(username,password);
    });
    $("#message").keyup(function() {
        checkMessageLength();
    });
    $('#kwick_chat').on('submit', function(event) {
        event.preventDefault();
        let id      = document.querySelector("#message");
        let message = id.value;
        sendMessage(message);
        id.value    = "";
        talkList();
    });
    $("#button_logOut" ).click(function() {
        logout();
    });

    //Fonction pour afficher le message de bienvenue
    showWelcomeMessage();
  })();