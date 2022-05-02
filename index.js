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
    let marker = L.marker(locationArr).addTo(map);
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
            document.getElementById("info3").innerHTML=JSON.parse(xmlhttp.responseText).description
            document.getElementById("info2").innerHTML= `<a href=${JSON.parse(xmlhttp.responseText).url}>${JSON.parse(xmlhttp.responseText).url}</a>`
            document.getElementById("info1").innerHTML=JSON.parse(xmlhttp.responseText).name
            document.getElementById("info4").innerHTML= `<p>TEL: ${JSON.parse(xmlhttp.responseText).telephone}</p>`
            document.getElementById("info5").innerHTML= `<a id="twitter" href="javascript:void(0);"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBEQACEQEDEQH/xAAbAAEBAQADAQEAAAAAAAAAAAABAAIEBQcGA//EADMQAAIBAgQDBQUJAQAAAAAAAAABAgMRBAUhMQYSQRMUYXGBJFGRobEiIzNTYnKC0dIV/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAEEAgUGA//EACsRAQACAQIEBQQCAwAAAAAAAAABAgMEEQUSITEiUWGB0ROh4fAjsRRxkf/aAAwDAQACEQMRAD8A9lArgQQgEJQEBAQAAgQAEJIBAAIBCUBAQAAoAAFK+wCEICAgkgQEBAQF0AAMwVkShpECAgEJAHAxWd5Zg6zo4nG0oVFvG92vO2xYx6XNkjmrWdlbJq8GOeW1o3culiaNegq9GrTnRavzxknG3meNqWrblmOr2rkravPWd4fopKUU4tNNXTXUxZxO5AgKwGEEK4GkEvm+OauIoZdha+FnKm6WJUnKPTR2+ZsuGVpfLat47w1fFbXpirak7bSxkvGGFxEI0sythq607S33cv8APrp4mWp4Zek74usff8sNNxTHeNsvSft+HZZ/mPd8hxOKwVWE5cqUJ05KVrtK68rlbS4OfUVpeFrV5+TT2vjn9l5dvq93udQ5Rz8loV8ZmFHCUYwqc0+bs60n2d0r3klvZIr6m1MeOb26f67rGmpbJkilevpPb3eq0ozjCKqT55Jayta78jlZmN+jr6xMR1bMUgkFwhkBAQl0nF8cW8nnLCJTUXetTcFJShbXTw0enuLugnH9aIv7T6qHEoyfQmae8ejzVHTOWSSWyAgPpOAsPKrnUq1vs0KMm34vRfK/wNbxW8Rg5fOW04TSbZ+byj+3odmc66RAFyQXXUAAgG+gQGrxau14oEvNM/ybMcFiKtavTdWi3fvFOCUWv1JLRnTaTVYclYrWdp8nK6vSZsVptaN48/nZ0xdUjGMpyUYRcpSdlFK7b9yEzERvJETPSHp/C2Uf8jLVCql3iq+eq10fSPp9bnL63U/Xy7x2js6vQab/AB8W0957u4uU11lskDAAACvqAoDjY+ljKlL2DFQoVF+ZT54v+j1xWxxP8kbx6Ts8c1csx/HbafWN3xmbZLxNjantT73FO8VCrFRX8Xb6G50+q0WOPB4fafy0Wo0muyT4/F7xt/zo4+G4PzarJKrClh49XOom/hG5634np69t5/fV504XqLT4oiPf4fVZFw7hMpkqt+3xNvxZK3L+1dPqanVa7Jn8Pavl8txpNBj0/i728/h3qZRX0wAkD2AyA2AAECAluBS3QQuoSebQCvcAbAtwCwEBAQAmBqIQXsEsyAwr3JYtrYhkUwJsA9QF+AAgACbAoy8AG4A2gAB9QJMBuAXAQIAAGBMBewGbaAJIiA9AIDIH/9k=" /></a>`
            document.getElementById("twitter").onclick = function (){
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i){
                    if(JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/twitter/i) >= 0){
                        window.location.href = JSON.parse(xmlhttp.responseText).engagement_methods[i].url
                    }
                }
            }

            document.getElementById("info6").innerHTML= `<a id="facebook" href="javascript:void(0);"><img src="https://scontent-lhr8-1.xx.fbcdn.net/v/t39.8562-6/109960336_274477960450922_1306319190754819753_n.png?_nc_cat=107&ccb=1-5&_nc_sid=6825c5&_nc_ohc=NvqfAYAu72gAX90NfpE&_nc_ht=scontent-lhr8-1.xx&oh=00_AT_fiih0fYOkCebTcQBxkOgPXsB1SdpHrH6yaVVL8L0mhw&oe=6273E6B0" /></a>`
            document.getElementById("facebook").onclick = function (){
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i){
                    if(JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/facebook/i) >= 0){
                        window.location.href = JSON.parse(xmlhttp.responseText).engagement_methods[i].url
                    }
                }
            }

            document.getElementById("info7").innerHTML= `<a id="youtube" href="javascript:void(0);"><img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" /></a>`
            document.getElementById("youtube").onclick = function (){
                for (let i = 0; i < JSON.parse(xmlhttp.responseText).engagement_methods.length; ++i){
                    if(JSON.parse(xmlhttp.responseText).engagement_methods[i].title.search(/youtube/i) >= 0){
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
    let markers = L.markerClusterGroup();
    crimeData.forEach((item, index) => {
        const circleMarker = L.circleMarker([item.location.latitude, item.location.longitude], { radius: 8 })
            .bindPopup(`<b>${item.category}</b><br>${item.location.street.name}.`, { maxWidth: "700" })
        markers.addLayer(circleMarker);
    })
    map.addLayer(markers);

}

function addInfo(description, url) {
    document.getElementById("info1").innerHTML = description
    document.getElementById("info2").innerHTML = url
    document.getElementById("info3").innerHTML = description
    document.getElementById("info4").innerHTML = description
    document.getElementById("info5").innerHTML = description
}