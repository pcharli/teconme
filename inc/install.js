const Install = () => {
    const installBtn = document.querySelector('.install-btn')

    let deferredPrompt = null

    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        deferredPrompt = e
        installBtn.classList.remove('hidden')
    })

    installBtn.addEventListener('click', e => {
        e.preventDefault()
        installBtn.classList.add('hidden')
        deferredPrompt.prompt()

    deferredPrompt.userChoice.
        then(choice => {
            if (choice === 'accepted') {
                console.log("Installation acceptée")
            } else {
                console.log("Instalation refusée")
            }
            deferredPrompt = null
        })

    })
}

export {Install}