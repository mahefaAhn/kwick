//Notification si l'utilisateur est en ligne ou hors ligne
function showModalUserStatus(username,status='online'){
    let sentence = username+` s'est connecté(e)!`;
    if(status=='offline') sentence = username+` s'est déconnecté(e)!`;
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: sentence,
        showConfirmButton: false,
        timer: 1500
    });
}

//Fonction pour confirmer si l'élément fait partie de la table
function elementInTable(element,table){
    let result    = false;
    let sizeTable = table.length;
    let tempCount = 0;
    for(let i=0;i<sizeTable;i++) if(element==table[i]) tempCount++;
    if(tempCount!=0) result = true;
    return result;
}

function elementTable1ExistInTable2(table1, table2){
    let newUser     = [];
    let sizeTable1  = table1.length;
    for(let j=0;j<sizeTable1;j++){
        let element = table1[j];
        if(!elementInTable(element,table2)) newUser.push(element);
    }
    return newUser;
}

//Fonction pour notifier les nouvelles personnes connectées et déconnectées
function notifyFriendsOnline(userList){
    //Récupérer la liste déjà enregistrer 
    let temp_listBefore = localStorage.getItem('friendsOnline');
    //Convertir la liste d'avant en table
    let listBefore = temp_listBefore.split(",");
    let listAfter  = userList;
    //Comparaison des 2 tables pour voir les nouvelles personnes connectées
    let userJoin   = elementTable1ExistInTable2(listAfter, listBefore);
    for(let i=0;i<userJoin.length;i++){
        showModalUserStatus(userJoin[i],'online');
    }
    //Comparaison des 2 tables pour voir les nouvelles personnes déconnectées
    let userLeave   = elementTable1ExistInTable2(listBefore, listAfter);
    for(let i=0;i<userLeave.length;i++){
        showModalUserStatus(userLeave[i],'offline');
    }
    localStorage.setItem('friendsOnline', listAfter);
}