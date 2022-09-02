const fs = require('fs');

const axios = require('axios');

class Busqueda {
    historial = [];
    pathDB = './DB/historialDB.json'
    constructor() {
        //TODO: LEER DB SI EXISTE
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        })
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    get paramsOpenWeatherMap() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric',
            'lat': this.lat,
            'lon': this.lon  
        }
    }

    async buscarLugar( lugar = '' ) {
        //TODO: LLAMADA A LA API

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this?.paramsMapBox
            })
            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            // return lugares;
        }catch(error) {
            console.error(`Ha ocurrido un error al buscar el lugar: ${error}`)
        } 
    }

    async buscarClima( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this?.paramsOpenWeatherMap, lat, lon}
            })
            const resp = await instance.get();
            const { weather, main } = resp.data;
            const datos = {
                desc: weather[0].description,
                temp: main.temp,
                min_temp: main.temp_min,
                max_temp: main.temp_max
            }
            return datos;
        }catch(error) {
            console.error(`Ha ocurrido un error al buscar el clima: ${error}`)
        } 

    }

    historialLugares( lugar ) {
        if(this.historial.includes( lugar.toLowerCase() )) return;
        if(this.historial.length === 5) this.historial.pop(-1);
        this.historial.unshift( lugar.toLowerCase() );
        this.guardarDB();
    }


    guardarDB() {
        const payload = {
            historial: this.historial,
        }
        fs.writeFileSync(this.pathDB, JSON.stringify( payload ));
    }

    leerDB() {
        if(fs.existsSync(this.pathDB)) {
            const info = fs.readFileSync(this.pathDB, {encoding:'utf-8'});
            const data = JSON.parse(info);
            this.historial = [...data.historial];
        }

    }

}

module.exports = Busqueda;