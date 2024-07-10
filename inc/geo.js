class Geo {
    constructor($mapBox, $geoSwitch) {
        //récup des éléments HTML
        this.$geoSwitch = $geoSwitch
        this.$mapBox = $mapBox
        //Mémorisera la carte
        this.map = false
        //Est-on géolocalisé ?
        this.geo = false
        //Rayon pour chercher les bus stops (en km)
        this.distance = 1
        //Option de géolocalisation
        this.optionsMap = {
            //Activation du GPS précis
            enableHighAccuracy: true,
            //5 secondes pour y arriver, sinon erreur
            timeout: 5000,
            //On ne met pas la position en cache
            maximumAge: 0
            }
        this.myIcon = L.icon({
            iconUrl: './icons/stop.png',
            iconSize: [80, 80],
            iconAnchor: [26, 35],
            popupAnchor: [15, -28],
            shadowUrl: '',
            shadowSize: [80, 80],
            shadowAnchor: [22, 94]
        })
    }
    //Méthode d'initialisation
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
        this.loadStops(position)
     }// end createMap

     //recherche des arrêts TEC
     loadStops = (position) => {
        //requête sur l'API des Tec
        fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/poteaux-tec/records?where=within_distance(geo_point_2d%2C%20geom%27POINT(${position.coords.longitude}%20${position.coords.latitude})%27%2C%20${this.distance}km)&limit=20&lang=fr`)
            .then(resp => resp.json())
            .then(resp => {
                let stopsList = resp.results
                if(stopsList.length > 0) {
                    stopsList.forEach(el => {
                        L.marker([el.geo_point_2d.lat-0.000617, el.geo_point_2d.lon+0.0011], {icon:this.myIcon}).addTo(this.map)
                        .bindPopup(`<a href="#" class="marker-link" data-id="${el.pot_id}">${el.pot_nom_ha}</a><br><p>Lat : ${el.geo_point_2d.lat}<p>Long: ${el.geo_point_2d.lon}<p>Id : ${el.pot_id}`)
                    })
                } else {
                    alert("Pas d'arrêt dans le coin !")
                }
             })
             .catch(err => alert(err.message))
     }

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