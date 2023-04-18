let flag = 0;
const getSbtn = document.querySelector('#enter');
const lastPart = document.querySelector('.last_sec');
const cityBtn = document.querySelector('#city');
const wheaterBtn = document.querySelector('#wheather');
const mapBtn = document.querySelector('#mapbtn');
const wheatherFiled = document.querySelector('.wheatheField');
const cityFiled = document.querySelector('.citiesfiled');
const mapFiled = document.querySelector('.map');



// *******************some style with js
// click get started and d-none the first part
getSbtn.addEventListener('click', function () {
    document.querySelector('.first_sec').classList.add('d-none');
    lastPart.classList.remove('d-none');
})
// wheather button
wheaterBtn.addEventListener('click', function () {
    mapFiled.classList.add('d-none');
    cityFiled.classList.add('d-none');
    wheatherFiled.classList.remove('d-none');
})
// cities button
cityBtn.addEventListener('click', function () {
    wheatherFiled.classList.add('d-none');
    mapFiled.classList.add('d-none');
    cityFiled.classList.remove('d-none');
})
// map button
mapBtn.addEventListener('click', function () {
    wheatherFiled.classList.add('d-none');
    cityFiled.classList.add('d-none');
    mapFiled.classList.remove('d-none');
})

// creat dom with api data
// get data from api with fetch
async function fetchData(_name) {
    let res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${_name}&limit=4&appid=71b1e027f294fd8494fd6f5745493efe`)
    let data = await res.json()
    return data;
}
async function getWheather(lat, lon) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=71b1e027f294fd8494fd6f5745493efe`)
    let data = await res.json()
    return data;
}

function get(e) {
    _name = document.querySelector('#inp1').value;
    let _key = e.keyCode || e.which;
    if (_key == 13) {
        let stateArray = []
        let loc = []
        wheatherFiled.innerHTML = '';
        cityFiled.innerHTML = '';
        mapFiled.innerHTML = '<div id="map"></div>';
        flag = 0;

        fetchData(_name).then(location => {
            console.log(location)
            if (location.length == 0) {
                wheatherFiled.classList.remove('d-none');
                wheatherFiled.innerHTML = '<h1>There is no result.<h1/>'
            } else {
                location.forEach(elem => {
                    if (stateArray.findIndex(val => val == elem.state) == -1) {
                        stateArray.push(elem.state);
                        loc.push(elem);
                    }
                });
                loc.forEach(city => {
                    getWheather(city.lat, city.lon).then(res => {
                        console.log('*************');
                        console.log(res);
                        // console.log(city);
                        if (flag == 0) {
                            // creat and add dom top wheather and map 
                            wheatherFiled.classList.remove('d-none');
                            mapFiled.classList.add('d-none');
                            cityFiled.classList.add('d-none');
                            flag++;
                            wheatherFiled.innerHTML = `
                                <div class="text">
                                    <h2>${res.name}</h2>
                                    <p>${city.state}</p>
                                    <p>chance of rain:${chanceofRain(res.clouds.all)}%</p>
                                    <strong>${Math.floor(res.main.temp - 273)}°C</strong>
                                </div>
                                <div class="icon">
                                    <i class="bi ${choosingIcon(res.weather[0].icon)}"></i>
                                    <p>${res.weather[0].main}</p>
                                    <p>${res.weather[0].description}</p>
                                </div>
                                <div class="condition">
                                    <h3>air condition</h3>
                                        <div>
                                            <p><i class="bi bi-moisture"></i> humidity</p>
                                            <strong>${res.main.humidity}%</strong>
                                        </div>
                                        <div>
                                            <p><i class="bi bi-droplet-half"></i> chance of rain</p>
                                            <strong>${chanceofRain(res.clouds.all)}%</strong>
                                        </div>
                                        <div>
                                            <p><i class="bi bi-wind"></i> wind speed</p>
                                            <strong>${res.wind.speed} m/s</strong>
                                        </div>
                                    <div>
                                        <p><i class="bi bi-thermometer-low"></i> real feel</p>
                                        <strong>${Math.floor(res.main.feels_like - 273)}°c</strong>
                                    </div>
                                </div>`;

                            //add map
                            mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWtra2trIiwiYSI6ImNsZzl2czdxMjA2ajYzZmtwOWkya2p2dnoifQ.HOp76GRtind4W-1r55t6dw';
                            const map = new mapboxgl.Map({
                                container: 'map', // container ID
                                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                                style: 'mapbox://styles/mapbox/dark-v11', // style URL
                                center: [res.coord.lon, res.coord.lat], // starting position [lng, lat]
                                zoom: 9 // starting zoom
                            });

                            map.on('load', () => {
                                // Load an image from an external URL.
                                map.loadImage(
                                `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`,
                                (error, image) => {
                                if (error) throw error;
                                 
                                // Add the image to the map style.
                                map.addImage('cat', image);
                                 
                                // Add a data source containing one point feature.
                                map.addSource('point', {
                                'type': 'geojson',
                                'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                'type': 'Point',
                                'coordinates': [res.coord.lon, res.coord.lat]
                                }
                                }
                                ]
                                }
                                });
                                 
                                // Add a layer to use the image to represent the data.
                                map.addLayer({
                                'id': 'points',
                                'type': 'symbol',
                                'source': 'point', // reference the data source
                                'layout': {
                                'icon-image': 'cat', // reference the image
                                'icon-size': 0.6
                                }
                                });
                                }
                                );
                                });
                        }

                        // creat and add dom to cities
                        cityFiled.innerHTML += `
                            <div class="city">
                                <div class="left">
                                    <div class="sec_icon">
                                        <i class="bi ${choosingIcon(res.weather[0].icon)}"></i>
                                    </div>
                                    <div>
                                        <strong>${res.name}</strong>
                                        <p>${city.state}</p>
                                    </div>
                                </div>
                                <div class="right">
                                    <strong>${Math.floor(res.main.temp - 273)}°c</strong>
                                </div>
                            </div>`;
                    });
                });
            }

        })

    }
}




function choosingIcon(str) {
    switch (str) {
        case ('01d'):
        case ('01n'):
            return 'bi-brightness-low-fill';
        case ('02d'):
        case ('02n'):
            return 'bi-cloud-sun-fill';
        case ('03d'):
        case ('03n'):
            return 'bi-cloudy-fill';
        case ('04d'):
        case ('04n'):
            return 'bi-clouds-fill';
        case ('09d'):
        case ('09n'):
            return 'bi-cloud-rain-fill';
        case ('10d'):
        case ('10n'):
            return 'bi-cloud-rain-heavy-fill';
        case ('11d'):
        case ('11n'):
            return 'bi-cloud-lightning-fill';
        case ('13d'):
        case ('13n'):
            return 'bi-cloud-snow-fill';
        default:
            return 'bi-cloud-fog-fill';
    }
}
function chanceofRain(r) {
    if (r == 0) {
        return 0;
    } else {
        return Math.floor(r / 10);
    }
}
function kelvinToCeli(temp) {
    return temp - 273;
}