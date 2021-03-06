    const server_url= "https://greenvelvet.alwaysdata.net/kwick/api/";

    //Fonction pour charger le contenu de la page
    function checkUserConnexion(){
        $("#kwick_content_user").addClass("d-none");
        //Vérifier la session
        let token       = localStorage.getItem('token');
        let _tempUrl = server_url+"user/logged/"+token;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'logged', 'status');
                if(_status=="done"){
                    let timerInterval
                    Swal.fire({
                    title: `Chargement...`,
                    html: `Vos messages s'afficheront dans <b></b> millisecondes.`,
                    timer: 5000,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        Swal.getContent().querySelector('b')
                            .textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    onClose: () => {
                        clearInterval(timerInterval)
                    }
                    }).then((result) => {
                    //if (result.dismiss === Swal.DismissReason.timer) console.log('I was closed by the timer');
                    })
                    $("#kwick_content_user").removeClass("d-none");
                    loadEmojis();
                }
                else if(_status=="failure")     window.location.href = 'login.html';
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });

    }

    //Fonction pour vérifier la connexion
    function checkConnexion(){
        let token       = localStorage.getItem('token');
        let _tempUrl = server_url+"user/logged/"+token;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'logged', 'status');
                let urlRedirect     = '';
                if(_status=="done")             urlRedirect     = 'Pages/chat.html';
                else if(_status=="failure")     urlRedirect     = 'Pages/login.html';
                window.location.href = urlRedirect;
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });

        window.location.href = 'Pages/login.html';
    }

    //Fonction pour récupérer le resultat format Kwick
    function getResultKwick(data, functionName, element){
        const _tempResultPing   = data.kwick;
        const _tempResult       = data.result;
        let result              = null;
        if(functionName=="ping"){
            if(element=="version") result = _tempResultPing.version;
            if(element=="completed_in") result = _tempResultPing.completed_in;
            if(element=="status") result = _tempResultPing.status;
        }
        else if(functionName=="signup" || functionName=="login"){
            if(element=="status") result = _tempResult.status;
            if(element=="message") result = _tempResult.message;
            if(element=="id") result = _tempResult.id;
            if(element=="token") result = _tempResult.token;
        }
        else if(functionName=="logout"){
            if(element=="status") result = _tempResult.status;
            if(element=="message") result = _tempResult.message;
        }
        else if(functionName=="logged"){
            if(element=="status") result = _tempResult.status;
            if(element=="user") result = _tempResult.user;
        }
        else if(functionName=="logged"){
            if(element=="status") result = _tempResult.status;
            if(element=="user") result = _tempResult.user;
        }
        else if(functionName=="say"){
            if(element=="status") result = _tempResult.status;
        }
        else if(functionName=="talkList"){
            if(element=="status") result = _tempResult.status;
            if(element=="talk") result = _tempResult.talk;
        }
        return result;
    }

    //Fonction pour tester la connexion
    function testServer(){
        let _tempUrl = "http://greenvelvet.alwaysdata.net/kwick/api/ping";
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let version         = getResultKwick(result, 'ping', 'version');
                let completed_in    = getResultKwick(result, 'ping', 'completed_in');
                let _status         = getResultKwick(result, 'ping', 'status');
                console.log(version, completed_in,_status);
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour s'inscrire
    function signin(username,password){
        let _tempUrl = "http://greenvelvet.alwaysdata.net/kwick/api/signup/"+username+"/"+password;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'signup', 'status');
                console.log(result);
                if(_status=="done"){
                    let token           = getResultKwick(result, 'login', 'token');
                    let idUser          = getResultKwick(result, 'login', 'id');
                    let urlRedirect     = "Pages/chat.html";
                    //Session storage
                    localStorage.setItem('user', username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('idUser', idUser);
                    localStorage.setItem('welcoming', 'true');
                    //Modal
                    Swal.fire({
                        icon: 'success',
                        title: 'Parfait!',
                        text: 'Enregistrement effectué.',
                    }).then((result) => {
                        if (result.value) {
                            let fullUrl = window.location.href;
                            if(fullUrl.split('Pages/').length != 0) urlRedirect     = "chat.html";
                            window.location.href = urlRedirect;
                        }
                    });
                }else if(_status=="failure"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Cet identifiant existe déjà. Veuillez ressayer avec un autre.',
                        //footer: '<a href>Why do I have this issue?</a>'
                    })
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour se connecter
    function login(username, password){
        let _tempUrl = server_url+"login/"+username+"/"+password;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'login', 'status');
                let token           = getResultKwick(result, 'login', 'token');
                let idUser          = getResultKwick(result, 'login', 'id');
                if(_status=="done"){
                    //Connexion OK
                    let urlRedirect      = "chat.html";
                    //Session storage
                    localStorage.setItem('user', username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('idUser', idUser);
                    localStorage.setItem('welcoming', 'true');
                    //Redirection vers la page d'accueil
                    window.location.href = urlRedirect;
                }else if(_status=="failure"){
                    //Modal
                    Swal.fire({
                        icon: 'error',
                        title: 'Ooops...',
                        text: 'Identifiant ou mot de passe incorrect.',
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour afficher le message de bienvenue
    function showWelcomeMessage(){
        let _welcoming      = localStorage.getItem('welcoming');
        let _userName       = localStorage.getItem('user');
        let _textBienvenue  = "Bienvenue "+_userName+"!";
        if(_welcoming=='true'){
            Swal.fire({
                position: 'top-end',
                icon: 'info',
                title: _textBienvenue,
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem('welcoming', 'false');
        }
    }

    //Fonction pour se deconnecter
    function logout(){
        let token       = localStorage.getItem('token');
        let idUser      = localStorage.getItem('idUser');
        let _tempUrl    = server_url+"logout/"+token+"/"+idUser;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'logout', 'status');
                if(_status=="done"){
                    let urlRedirect      = "login.html";
                    //Effacer les informations dans localStorage
                    localStorage.clear;
                    //Redirection vers la page de connexion
                    window.location.href = urlRedirect;
                }else if(_status=="failure"){
                    let urlRedirect     = "login.html";
                    //Modal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oooops...',
                        text: `Cette action n'a pas pu être effectuée.`,
                    }).then((result) => {
                        if (result.value) {
                            window.location.href = urlRedirect;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour afficher les personnes connectées (texte + style)
    function displayUserConnected(username){
        let myUserName      = localStorage.getItem('user');
        let result          = '';
        if(username.toLowerCase()!=myUserName.toLowerCase())
            result          = `<li class='kwick_badgeOnline'>`+username+`</li>`;
        return result;
    }

    //Fonction pour lister les utilisateurs connectés
    function logged(){
        let token       = localStorage.getItem('token');
        let _tempUrl = server_url+"user/logged/"+token;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'logged', 'status');
                let userList        = getResultKwick(result, 'logged', 'user');
                notifyFriendsOnline(userList);
                if(_status=="done"){
                    const displayPeople = userList.map(user => displayUserConnected(user));
                    const countUser     = userList.length - 1;
                    let newContentTitle = '<i class="fa fa-user"></i> UTILISATEURS CONNECTES' + '('+countUser+')';
                    $('#kwick_kwick_userConnected_title_lg').html(newContentTitle);
                    $('#kwick_kwick_userConnected_title_xs').html(newContentTitle);
                    $('#kwick_userConnected_xs').html(
                        displayPeople.join('')
                    );
                    $('#kwick_userConnected_lg').html(
                        displayPeople.join('')
                    );
                }else if(_status=="failure"){
                    let urlRedirect     = "login.html";
                    //Modal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oooops...',
                        text: `Session expirée. Veuillez vous reconnecter.`,
                    }).then((result) => {
                        if (result.value) {
                            localStorage.clear;
                            window.location.href = urlRedirect;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour compter le nombre de caractère dans le champ
    function checkMessageLength(){
        let sizeAuth    = 160;
        let field       = $('#message');
        let size        = field.val().length;
        let sizeRest    = sizeAuth-size;
        let text        = sizeRest+` caractères.`;
        if(sizeRest==1) text = sizeRest+` caractère.`;
        $('#characterCount').html(`Il vous reste `+text);
    }

    //Fonction pour poster un message
    function sendMessage(message){
        let idUser      = localStorage.getItem('idUser');
        let token       = localStorage.getItem('token');
        let _tempUrl    = server_url+"say/"+token+"/"+idUser+"/"+message;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'say', 'status');
                if(_status=="done"){
                    //Envoi de message  OK
                }else if(_status=="failure"){
                    //Modal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oooops...',
                        text: `Le message n'a pas pu être envoyé.`,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }

    //Fonction pour récupérer l'heure d'un message
    function displayMessageTime(timestamp){
        let d       = new Date(timestamp*1000);
        let result  = moment(d).startOf('hour-32').fromNow();
        return result;
    }

    //Design message
    function displayMessage(msg){
        let msg_username    = msg.user_name;
        let msg_content     = msg.content;
        let msg_timestamp   = msg.timestamp;
        let username        = localStorage.getItem('user');
        let result          = '';
        let classname       = 'kwick_userMsg';
        let classname_title = 'kwick_txt_left';
        if(msg_username.toLowerCase()==username.toLowerCase()){
            classname       = 'kwick_myMsg';
            classname_title = 'kwick_txt_right';
        }
        result = `<div class="`+classname+` rounded"><b class='`+classname_title+`'>`+msg_username+`</b><br><span  class='kwick_txt_justified'>`+msg_content+`</span><br><small class='`+classname_title+`'>`+displayMessageTime(msg_timestamp)+`</small></div>`;
        return result;
    }

    //Fonction pour scroller 
    function goToScroll(_element,position){
        let element = document.querySelector(_element);
        if(position == 'top') element.scrollTop = element.clientHeight - 1000000;
        else if(position == 'bottom') element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    //Fonction pour lister les messages postés après timestamp
    function talkList(timestamp=0){
        let token       = localStorage.getItem('token');
        let _tempUrl    = server_url+"talk/list/"+token+"/"+timestamp;
        $.ajax({
            url: _tempUrl,
            dataType: "jsonp",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                let _status         = getResultKwick(result, 'talkList', 'status');
                const talk          = getResultKwick(result, 'talkList', 'talk');
                if(_status=="done"){
                    const displayMsg = talk.map(myMsg => displayMessage(myMsg));
                    $('.kwick_messageList').html(
                        displayMsg.join('')
                    );
                    goToScroll('.kwick_messageList','bottom');
                }else if(_status=="failure"){
                    let urlRedirect     = "login.html";
                    //Modal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oooops...',
                        text: `Session expirée. Veuillez vous reconnecter.`,
                    }).then((result) => {
                        if (result.value) {
                            localStorage.clear;
                            window.location.href = urlRedirect;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("Error");
            }
        });
    }