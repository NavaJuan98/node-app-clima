require('dotenv').config()
const { inquirerMenu, inquirerPausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busqueda = require("./models/Busqueda");

const main = async() =>{
    const busqueda = new Busqueda();
    let opc = 0;
    do {
        opc = await inquirerMenu();
        switch(opc) {
            case 1:
                // MOSTRAR MENSAJE
                const lugar = await leerInput('Ciudad a buscar:');
                //BUSCAR LUGARES
                const lugares = await busqueda.buscarLugar(lugar)
                //SELECIONAR EL LUGAR
                const lugarSeleccionado = await listarLugares(lugares);
                if(lugarSeleccionado === '0') continue;  
                const datosLugarSeleccionado = lugares.find(lugar => lugar.id === lugarSeleccionado);

                busqueda.historialLugares( datosLugarSeleccionado.nombre );
                //CLIMA
                const datosClima = await busqueda.buscarClima(datosLugarSeleccionado.lat, datosLugarSeleccionado.lng);
                //MOSTRAR RESULTADOS
                console.clear();
                console.log(`\nINFORMACION DEL LUGAR\n`.green);
                console.log('Ciudad: '+ `${ datosLugarSeleccionado.nombre }`.green)
                console.log('Lng: '+ `${ datosLugarSeleccionado.lng }`.green)
                console.log('Lat: '+ `${ datosLugarSeleccionado.lat }`.green)
                console.log('Temperatura: ' + `${ datosClima.temp }`.green)
                console.log('Temperatura Minima: '+ `${ datosClima.min_temp }`.green)
                console.log('Temperatura Maxima: '+ `${ datosClima.max_temp }`.green)
                console.log('Descripcion Clima: '+ `${ datosClima.desc }`.green)

                break;
            case 2:
                if(busqueda.historialCapitalizado.length <= 0) {
                    console.log(`\nNo existen registros en la Base de Datos...\n`.green);
                    break;
                }
                busqueda.historialCapitalizado.forEach( (lugar, i ) => {
                    const idx = `${ i + 1}.`.green;
                    console.log( `${idx} ${lugar}` );
                });
                break;
            case 0:
                console.log('Saliendo...');
                break;
    
        }
        await inquirerPausa();
        
    }while(opc !== 0);

}

main();