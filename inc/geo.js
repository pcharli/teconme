class Geo {
    constructor($mapBox, $geoSwitch) {
        this.$geoSwitch = $geoSwitch
        this.$mapBox = $mapBox
        this.map = false
        this.geo = false
        this.optionsMap = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
            }
    }
    init = () => {
        navigator.permissions.query({name:'geolocation'})
        .then(result => {
            console.log(result.state)
            if (result.state === 'granted') {
                //Ajout d'une class sur le bouton "Me géolocaliser" si les droits sont OK
                this.$geoSwitch.classList.add('hidden')
                this.geo = true
                //createMap()
                
                navigator.geolocation.getCurrentPosition(this.createMap, this.errorPosition, this.optionsMap)
            }
            else {
                console.log('pas autorisé')
                let position = {
                    coords: {}
                }
                position.coords.latitude = 50.05597490916252
                position.coords.longitude = 4.491863482729571
                this.createMap(position)
            }
        })
    } // end init

    createMap = (position) => {
        //si la carte paar défaut est affichée, la supprimer
        if (this.map) {
            this.map.remove()
        }
    
        //console.log("createMap",position)
        // Afficher la div id="carte"
        this.$mapBox.classList.remove('hidde')
        //return
        // ajouter la carte dans la div#map centrée sur les coordonnées reçues dans "position"
        this.map = L.map(this.$mapBox).setView([position.coords.latitude, position.coords.longitude], 17)
        // Choisir le layer standard (on peut avoir le satelite ou autre)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Cepegra - 2024' //Auteur de la carte
        }).addTo(this.map)
     }// end createMap

 

// Méthode d"clenchée si erreur de géolocalisation
    errorPosition = (err) => {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    } //end errorPosition

    geoLoc = () => {
        navigator.permissions.query({name:'geolocation'})
              .then(result => {
                // si l'user a déjà accepté
                if (result.state === 'granted') {
                    this.geo = true
                    //createMap()
                    //option (GPS, valide mise en cache refusée car 0, 5 sec max pour arriver à géolocaliser avant une erreur  )
                   
                    navigator.geolocation.getCurrentPosition(this.createMap, this.errorPosition, this.optionsMaps)
                    // Si la demande est acceptée
                } else if (result.state === 'prompt') {
                    
                    navigator.geolocation.getCurrentPosition(this.createMap, this.errorPosition, this.optionsMap)
                 } 
                 else if(result.state === 'denied'){
                    // si il refuse
                    console.log('pas autorisé')
                }
                //console.log(result.state);
                })
    }
}

export {Geo}