(function() {
    'use strict';
    /*Login*/
    $('#kwick_login').on('submit', function(event) {
        event.preventDefault();
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#pwd").value;
        login(username,password);
    });
    $('#showPwd').on('click', function(event) {
        event.preventDefault();
        showHidePassword('pwd','showPwdIcon');
    });
    /*Sign up*/
    $('#kwick_signUp').on('submit', function(event) {
        event.preventDefault();
        let form_username   = document.querySelector("#username");
        let form_password   = document.querySelector("#pwd");
        let form_pwdConfirm = document.querySelector("#pwdConfirm");

        let username        = form_username.value;
        let password        = form_password.value;
        let pwdConfirm      = form_pwdConfirm.value;
        if(password===pwd) signin(username,pwdConfirm);
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oooops...',
                text: `Il semble que vos mots de passes ne sont pas identiques. Veuillez rectifier.`,
            }).then((result) => {
                if (result.value) {
                    form_password.value     = '';
                    form_pwdConfirm.value   = '';
                }
            });
        }
    });
    $('#showPwdConfirm').on('click', function(event) {
        event.preventDefault();
        showHidePassword('pwdConfirm','showPwdIconConfirm');
    });
    /*Chat*/
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