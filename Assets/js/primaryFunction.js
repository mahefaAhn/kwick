    const server_url= "https://greenvelvet.alwaysdata.net/kwick/api/";

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
                icon: 'success',
                title: _textBienvenue,
                showConfirmButton: false,
                timer: 1500
            })
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

    //Fonction pour formater l'affichage d'une minute / mois NUMERIQUE
    function formatNumDate(string, size){
        let result          = string.toString();
        let resultLenght    = result.length;
        let difference      = size - resultLenght;
        let aCompleter      = '0';
        for(i=0;i<difference-1;i++) aCompleter += aCompleter;
        if(difference!=0)   result = aCompleter+result;
        return result;
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

    //Fonction pour afficher les emojis
    function displayEmojisKeyboard(emojiCode){
        let emoji   = String.fromCodePoint(emojiCode);
        let result  = `<a class='kwick_emojiBtn' onclick='copyEmoji(event,`+emojiCode+`)'>`+emoji+`</a>`;
        return result;
    }

    function loadEmojis(){
        const emojiList = ['128512','128513','128514','128515','128516','128517','128518','128519','128520','128521','128522','128523','128524','128525','128526','128527','128528','128529','128530','128531','128532','128533','128534','128535','128536','128537','128538','128539','128540','128541','128542','128543','128544','128545','128546','128547','128548','128549','128550','128551','128552','128553','128554','128555','128556','128557','128558','128559','128560','128561','128562','128563','128564','128565','128566','128567','128577','128578','128579','128580','129296','129297','129298','129299','129300','129301','129312','129313','129314','129315','129316','129317','129319','129320','129321','129322','129323','129324','129325','129326','129327','129488'];

        const displayEmojis = emojiList.map(emoji => displayEmojisKeyboard(emoji));
        $('.kwick_emojiKeyboard').html(
            displayEmojis.join('')
        );
    }

    //Fonction pour copier les émojis dans le textarea
    function copyEmoji(event,emojiCode){
        event.preventDefault();
        let emoji           = String.fromCodePoint(emojiCode);
        let msgContent      = $('#message').val() + emoji;
        $('#message').val(msgContent);
        //Placer le curseur dans le zone de texte
        var elem = document.getElementById('message');
        elem.focus();
        elem.selectionStart = elem.value.length;
    }