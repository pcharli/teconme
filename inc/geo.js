class Geo {
    constructor($mapBox, $geoSwitch) {
        this.context = 'distant' // distant | local
        //url api
        this.urlApi = (this.context != 'distant') ? 'http://localhost/api_bootcamp' : 'https://cepegra-frontend.xyz/bootcamp'
        //récup des éléments HTML
        this.$geoSwitch = $geoSwitch
        this.$mapBox = $mapBox
        //Mémorisera la carte
        this.map = false
        //???
        this.mapElms = {polyLineRef: null}
        // tous les markers
        this.markers = []
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
            iconUrl: './icons/icon-stop.svg',
            iconSize: [53, 53],
            iconAnchor: [16, 55],
            popupAnchor: [10, -37],
            shadowUrl: '',
            shadowSize: [80, 80],
            shadowAnchor: [22, 94]
        })
        this.startIcon = L.icon({
            iconUrl: './icons/icon-start.svg',
            iconSize: [53, 53],
            iconAnchor: [16, 55],
            popupAnchor: [10, -37],
            shadowUrl: '',
            shadowSize: [80, 80],
            shadowAnchor: [22, 94]
        })
        this.endIcon = L.icon({
            iconUrl: './icons/icon-end.svg',
            iconSize: [53, 53],
            iconAnchor: [16, 55],
            popupAnchor: [10, -37],
            shadowUrl: '',
            shadowSize: [80, 80],
            shadowAnchor: [22, 94]
        })
        this.currentIcon = L.icon({
            iconUrl: './icons/icon-me.svg',
            iconSize: [53, 53],
            iconAnchor: [16, 55],
            popupAnchor: [10, -37],
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
        L.marker([position.coords.latitude, position.coords.longitude], {icon:this.currentIcon}).addTo(this.map)
        // Choisir le layer standard (on peut avoir le satelite ou autre)
        var imageUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        var imageUrl2 = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        var imageUrl3 = "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
        L.tileLayer(imageUrl, {
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
                        let marker = L.marker([el.geo_point_2d.lat-0.000617, el.geo_point_2d.lon+0.0011], {icon:this.myIcon}).addTo(this.map)
                        .on('click', (map) => {
                            const myMap = map
                            
                            //alert('click')
                            fetch(this.urlApi+'/bus/'+el.pot_id)
                            .then((response) => response.json())
                            .then((data) => {
                                //console.log(data.content)
                                let template = ''
                                data.content.forEach(item => {
                                    if (item.route_id != null) {
                                        template += `<a href="#" class="marker-link" data-id="${item['route_id']}" data-shape="${item['shape_id']}">${item['route_short_name']} - ${item['route_long_name']}}</a><br>`
                                    }
                                })
                                marker.bindPopup(`<h4 data-id="${el.pot_id}">${el.pot_nom_ha}</h4>`+template).openPopup()

                                //console.log(template)
                                //click on a link
                                let markersLinks = document.getElementsByClassName('marker-link')
                                markersLinks = [ ...markersLinks]
                                //console.log(markersLinks[0])
                            
                                Array.prototype.forEach.call(markersLinks, (marker) => {
                                    //console.log(marker)
                                    marker.addEventListener('click', e => {
                                        e.preventDefault()
                                        const id_shape = e.target.dataset.shape
                                        console.log(e.target.dataset.shape)
                                        fetch(this.urlApi+'/shapes/'+id_shape)
                                        .then(res => res.json())
                                        .then(res => {
                                            //console.log(res)
                                           
                                            let data = res.content
                                            const dataPositions = data.map(el => [el.shape_pt_lat, el.shape_pt_lon])
                                            let dataLenght = data.length
                                            if(res.content.length > 0) {
                                                if(this.mapElms.polyLineRef){
                                                    this.mapElms.polyLineRef.removeFrom(this.map)
                                                    this.markers.forEach(marker => {
                                                       this.map.removeLayer(marker)
                                                    })
                                                    }
                                                let marker = L.marker([data[0].shape_pt_lat,data[0].shape_pt_lon], {icon:this.startIcon}).addTo(this.map)
                                                .bindPopup('Départ')
                                                //console.log(data[dataLenght-1])
                                                this.markers.push(marker)
                                                marker = L.marker([data[dataLenght-1].shape_pt_lat,data[dataLenght-1].shape_pt_lon], {icon:this.endIcon}).addTo(this.map)
                                                .bindPopup('Arrivée')
                                                this.markers.push(marker)
                                                let latMedium = (parseFloat(data[0].shape_pt_lat) + parseFloat(data[dataLenght-1].shape_pt_lat))/2
                                                let longMedium = (parseFloat(data[0].shape_pt_lon) + parseFloat(data[dataLenght-1].shape_pt_lon))/2
                                                //console.log('latitudeMedium', latMedium)
                                             
                                                this.map.flyTo([latMedium,longMedium],11)
                                                this.mapElms.polyLineRef = L.polyline(dataPositions,{color: 'red', weight: 13}
                                                ).addTo(this.map)


                                            }
                                        })
                                    })
                                })
                                    
                                //end click links
                            })
                            .catch((error) => console.error(error))
                            
                        })
                        
                    })
                } else {
                    alert("Pas d'arrêt dans le coin !")
                }
             })
             .catch(err => alert(err.message))
     }

// Méthode déclenchée si erreur de géolocalisation
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
