function reject() {
    return prompt("Do not change the url after copying it from the site");
}

javascript: void(function(d) {
    if (d.location.host === 'lng-tgk-aime-gw.am-all.net') {
        let code = new URL(document.location.href).searchParams.get('id') ?? reject();
        if (!isNaN(parseInt(code))) {
            let cookie = d.cookie.match(/clal=([^;]*)/)?.[1];
            if (cookie.length !== 64) return alert("Error!\nI can\'t fetch your session, try logging in again or switch browsers.");
            let win = window.open(`https://acid.kvznmx.com/api/setUserClal?id=${code}&clal=${cookie}`, '_blank');
        } else if (code === null) {
            console.log("User cancelled");
        } else {
            alert("Wrong code! Please do not change the url after copying it from the site");
        }
    } else return alert("Error!\nYou are not in the right website");
})(document)