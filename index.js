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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
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

function getLocationObj(obj) {
    let locationArr = [obj.data.latitude, obj.data.longitude]
    console.log(locationArr);
    getCrime(locationArr)
    getMap(locationArr)
    getNearPolice(locationArr)

}

function getMap(locationArr) {
    map.setView(locationArr, 16)
    // let marker = L.marker(locationArr).addTo(map);
    // usage marker demo
    // var blueMarker = L.marker(locationArr, {
    //     icon: new L.AwesomeNumberMarkers({
    //       number: 400, 
    //       markerColor: "red"
    //   })}).addTo(map);

}

function getNearPolice(location) {
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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(JSON.parse(xmlhttp.responseText));
            getPoliceInfo(JSON.parse(xmlhttp.responseText).force)
        }

    }
    xmlhttp.open("GET", `https://data.police.uk/api/locate-neighbourhood?q=${location}`, true);
    xmlhttp.send();

}

function getPoliceInfo(ID) {
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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(JSON.parse(xmlhttp.responseText));
            document.getElementById("info3").innerHTML = JSON.parse(xmlhttp.responseText).description
            document.getElementById("info2").innerHTML = `<a href=${JSON.parse(xmlhttp.responseText).url}>${JSON.parse(xmlhttp.responseText).url}</a>`
            document.getElementById("info1").innerHTML = JSON.parse(xmlhttp.responseText).name
            document.getElementById("info4").innerHTML = JSON.parse(xmlhttp.responseText).telephone
            // document.getElementById("info5").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].title
            // document.getElementById("info6").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].url
            // document.getElementById("info7").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].description
            //





        }

    }
    xmlhttp.open("GET", `https://data.police.uk/api/forces/${ID}`, true);
    xmlhttp.send();
}

function getCrime(location) {
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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(JSON.parse(xmlhttp.responseText));
            renderMarker(JSON.parse(xmlhttp.responseText))
        }

    }
    xmlhttp.open("GET", `https://data.police.uk/api/crimes-street/all-crime?lat=${location[0]}&lng=${location[1]}`, true);
    xmlhttp.send();

}

function renderMarker(crimeData) {
    crimeData.forEach((item, index) => {
        var blueMarker = L.marker([item.location.latitude, item.location.longitude], {
            icon: new L.AwesomeNumberMarkers({
                number: 1,
                markerColor: "blue"
            })
        }).addTo(map);

    })
}

function addInfo(description, url) {
    document.getElementById("info1").innerHTML = description
    document.getElementById("info2").innerHTML = url
    document.getElementById("info3").innerHTML = description
    document.getElementById("info4").innerHTML = description
    document.getElementById("info5").innerHTML = description
}