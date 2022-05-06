
let mapOptions = {
    center: [50.934099, -1.395714],
    zoom: 7
}
let map = new L.map('map', mapOptions);
let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
// Adding layer to the map
let locationArr
let markers
let locationMarker = ""
map.addLayer(layer);
getCrimeOptions()

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
    if (locationMarker !== "") {
        map.removeLayer(locationMarker)
        map.removeLayer(markers)
    }
    const select = document.getElementById('type');
    select.selectedIndex = 1
    let postcode = document.getElementById('postcodeInput').value
    getLocation(postcode)
}

function getLocationObj(obj) {
    locationArr = [obj.data.latitude, obj.data.longitude]
    console.log(locationArr);
    var select = document.getElementById('type');
    var value = select.options[select.selectedIndex].value;
    var select2 = document.getElementById('date');
    var value2 = select2.options[select2.selectedIndex].value;
    let newValue = moment(value2,"MM/YYYY").format("YYYY-MM")
    getCrime(value, locationArr, newValue)
    getMap(locationArr)
    getNearPolice(locationArr)
}
function getCrimeOptions() {

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
            renderTypeList(JSON.parse(xmlhttp.responseText))
        }

    }
    xmlhttp.open("GET", `https://data.police.uk/api/crime-categories`, true);
    xmlhttp.send();
}

function renderTypeList(list) {
    const typeDropMenu = document.getElementById("type")
    list.forEach((item) => {
        if (item.url === "all-crime") {
            typeDropMenu.innerHTML += `<option value=${item.url} selected>${item.name}</option>`
        } else {
            typeDropMenu.innerHTML += `<option value=${item.url}>${item.name}</option>`
        }
    })
}

function getMap(locationArr) {
    map.setView(locationArr, 16)
    locationMarker = L.marker(locationArr).bindPopup("<b>Your location</b><br>Your location").addTo(map);
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
            //document.getElementById("info4").innerHTML= `<p>TEL: ${JSON.parse(xmlhttp.responseText).telephone}</p>`
            document.getElementById("info5").innerHTML = `<a id="twitter" href="javascript:void(0);"><img src="./images/twitter.svg" /></a>`
            document.getElementById("twitter").onclick = function () {
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i) {
                    if (JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/twitter/i) >= 0) {
                        window.location.href = JSON.parse(xmlhttp.responseText).engagement_methods[i].url
                    }
                }
            }

            document.getElementById("info6").innerHTML = `<a id="facebook" href="javascript:void(0);"><img src="./images/facebook.svg" /></a>`
            document.getElementById("facebook").onclick = function () {
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i) {
                    if (JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/facebook/i) >= 0) {
                        window.location.href = JSON.parse(xmlhttp.responseText).engagement_methods[i].url
                    }
                }
            }

            document.getElementById("info7").innerHTML = `<a id="youtube" href="javascript:void(0);"><img src="./images/youtube.svg" /></a>`
            document.getElementById("youtube").onclick = function () {
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i) {
                    if (JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/youtube/i) >= 0) {
                        window.location.href = JSON.parse(xmlhttp.responseText).engagement_methods[i].url
                    }
                }
            }
            //document.getElementById("info5").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].title
            // document.getElementById("info6").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].url
            // document.getElementById("info7").innerHTML=JSON.parse(xmlhttp.responseText).engagement_methods[0].description
        }

    }
    xmlhttp.open("GET", `https://data.police.uk/api/forces/${ID}`, true);
    xmlhttp.send();
}

function getCrime(crimeType, location, date) {
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
            document.getElementById("info0").innerHTML = JSON.parse(xmlhttp.responseText).length + " Crimes in 1 mile radius"
        }

    }
    if (date === '') {
        xmlhttp.open("GET", `https://data.police.uk/api/crimes-street/${crimeType}?lat=${location[0]}&lng=${location[1]}`, true);

    } else {
        xmlhttp.open("GET", `https://data.police.uk/api/crimes-street/${crimeType}?lat=${location[0]}&lng=${location[1]}&date=${date}`, true);
    }
    xmlhttp.send();

}

function renderMarker(crimeData) {
    markers = L.markerClusterGroup();
    crimeData.forEach((item, index) => {
        const circleMarker = L.circleMarker([item.location.latitude, item.location.longitude], { radius: 8 })
            .bindPopup(`<b>${item.category}</b><br>${item.location.street.name}.`, { maxWidth: "700" })
        markers.addLayer(circleMarker);
    })
    map.addLayer(markers);
}

function handleSelectType() {
    var select = document.getElementById('type');
    var value = select.options[select.selectedIndex].value;
    var select2 = document.getElementById('date');
    var value2 = select2.options[select2.selectedIndex].value;
    let newValue = moment(value2,"MM/YYYY").format("YYYY-MM")
    console.log(newValue);
    map.removeLayer(markers)
    getCrime(value, locationArr, newValue)
}
function handleSelectDate(){
    var select = document.getElementById('type');
    var value = select.options[select.selectedIndex].value;
    var select2 = document.getElementById('date');
    var value2 = select2.options[select2.selectedIndex].value;
    let newValue = moment(value2,"MM/YYYY").format("YYYY-MM")
    console.log(newValue);
    map.removeLayer(markers)
    getCrime(value,locationArr,newValue)
}

// handleSelectType()
