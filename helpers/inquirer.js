const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'option', 
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    },

]

const inquirerMenu = async() => {
    console.clear();
    console.log('-------------------------------'.green);
    console.log('|    Seleccione una opcion    |'.green);
    console.log('-------------------------------\n'.green);

    const { option } = await inquirer.prompt(preguntas);
    return option;
}

const inquirerPausa = async() => {
    const questionEnter = [
        {
            type: 'input',
            name: 'enter',
            message: `Oprime ${'ENTER'.cyan} para continuar...`,
            value: 'ENTER'
        }
    ]
    await inquirer.prompt(questionEnter);
}

const leerInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Porfavor ingrese un valor!.';
                } 
                return true;
            }
        }
    ];

    const { descripcion } = await inquirer.prompt(question)
    return descripcion
}

const listarLugares = async( lugares = []) => {
    const choices = lugares.map( ( lugar, i ) => {
        const idx = `${ i + 1 }.`.green;
        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre } `,
        }
    });
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecciona el lugar:',
            choices
        }
    ];

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

module.exports = {
    inquirerMenu,
    inquirerPausa,
    leerInput,
    listarLugares
}