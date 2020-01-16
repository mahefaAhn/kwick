//Fonction pour afficher ou cacher un mot de pase
function showHidePassword(idInput,idIcon){
    let attr_now    = $('#'+idInput).attr('type');
    if(attr_now=='password'){
        $('#'+idInput).attr('type', 'text');
        $('#'+idIcon).attr('class', 'fa fa-eye-slash kwick_icon_white');
    }
    else if(attr_now=='text'){
        $('#'+idInput).attr('type', 'password');
        $('#'+idIcon).attr('class', 'fa fa-eye kwick_icon_white');
    }
}