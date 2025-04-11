// gestion de la carte
import {Geo} from './inc/geo.js'
//Gestion du bouton d'installation
import {Install} from './inc/install.js'
//gestion des fermetures des boxes
import boxClose from './inc/box.js'
//lance le process d'installation de l'app
Install()
// end install

//sélection des éléments HTML
const $mapBox = document.querySelector('#map')
const $geoSwitch = document.querySelector('.geo-btn')

const myGeo = new Geo($mapBox, $geoSwitch)
myGeo.init()



// Quand on clique sur le bouton "Me géolocaliser" A FINIR
$geoSwitch.addEventListener('click', e => {
e.preventDefault()
alert('geo')
// On déclenche la méthode geoLoc
myGeo.init()
})

// délenche la gestion de fermetures des boxes
boxClose()