import {Geo} from './inc/geo.js'


//sélection des éléments HTML
const $geoSwitch = document.querySelector('.gps_form')
let $mapBox = ""
const myGeo = new Geo($mapBox, $geoSwitch)
//myGeo.init()

     // Quand on clique sur le bouton "Me géolocaliser"
     $geoSwitch.addEventListener('submit', e => {
        e.preventDefault()
        // On déclenche la méthode geoLoc
        if($geoSwitch.querySelector('input[name="localisation"]:checked').value == 'y') {
            //alert('geo')
            myGeo.geoLoc()
        } else {
        window.location.href = "carte.html"
        }
    })
