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
    getMap(locationArr)
}

function getMap(locationArr){
    map.setView(locationArr,1000) 
}