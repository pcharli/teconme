// méthode
const Install = () => {
    // sélection du bouton Install
    const installBtn = document.querySelector('.install-btn')
    const installBox = document.querySelector('.box-install')
    // espace mémoire pour recevoir l'event install
    let deferredPrompt = null
    // avant l'affichage de la demande automatique
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        deferredPrompt = e
        //afficher le bouton
        installBox.classList.remove('hidden')
    })
    // click sur le bouton
    installBtn.addEventListener('click', e => {
        e.preventDefault()
        // masque le bouton
        installBox.classList.add('hidden')
        // affiche la demande d'install et stocke l'event en mémoire
        deferredPrompt.prompt()
    // test du choix de l'user    
    deferredPrompt.userChoice.
        then(choice => {
            // si installé
            if (choice === 'accepted') {
                console.log("Installation acceptée")
            } else {
                console.log("Instalation refusée")
            }
            // neutralise l'event d'installation
            deferredPrompt = null
        })

    })
}

export {Install}