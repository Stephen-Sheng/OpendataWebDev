let mapOptions = {
    center: [17.385044, 78.486671],
    zoom: 10
}
let map = new L.map('map', mapOptions);
let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    // Adding layer to the map
    map.addLayer(layer);

function getLocation(postcode) {
    let xmlhttp;
    let locationObj
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            console.log(JSON.parse(xmlhttp.responseText));
            locationObj = JSON.parse(xmlhttp.responseText);
            getLocationObj(locationObj)
        }
            
    }
    xmlhttp.open("GET", `http://api.getthedata.com/postcode/${postcode}`, true);
    xmlhttp.send();

}

function search() {
    let postcode = document.getElementById('postcodeInput').value
    getLocation(postcode)
}

function getLocationObj(obj){
    console.log(obj);
    let locationArr = [obj.data.latitude,obj.data.longitude]
    getCrime(locationArr)
    getMap(locationArr)
    getNearPolice(locationArr)

}

function getMap(locationArr){
    map.setView(locationArr,1000)
    // let marker = L.marker(locationArr).addTo(map);
    // usage marker demo
    // var blueMarker = L.marker(locationArr, {
    //     icon: new L.AwesomeNumberMarkers({
    //       number: 400, 
    //       markerColor: "red"
    //   })}).addTo(map);
 
}

function getNearPolice(location){
    let xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            console.log(JSON.parse(xmlhttp.responseText));
            getPoliceInfo(JSON.parse(xmlhttp.responseText).force)
        }
            
    }
    xmlhttp.open("GET", `https://data.police.uk/api/locate-neighbourhood?q=${location}`, true);
    xmlhttp.send();

}

function getPoliceInfo(ID){
    let xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            console.log(JSON.parse(xmlhttp.responseText));
        }
            
    }
    xmlhttp.open("GET", `https://data.police.uk/api/forces/${ID}`, true);
    xmlhttp.send();
}

function getCrime(location){
    
}