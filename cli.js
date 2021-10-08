#!/usr/bin/env node

const mdLinks = require('./index.js');
const color = require("ansi-colors")

//Opciones desde la consola
let pathUser = process.argv[2]; // la invocación completa de la línea de comandos
const pathRoute = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');
const { Console } = require('console');
let optionOne = process.argv[3];
let optionTwo = process.argv[4];
const help = process.argv.includes("--help")

console.log(color.cyan(`
███╗░░░███╗██████╗░░░░░░░██╗░░░░░██╗███╗░░██╗██╗░░██╗░██████╗
████╗░████║██╔══██╗░░░░░░██║░░░░░██║████╗░██║██║░██╔╝██╔════╝
██╔████╔██║██║░░██║█████╗██║░░░░░██║██╔██╗██║█████═╝░╚█████╗░
██║╚██╔╝██║██║░░██║╚════╝██║░░░░░██║██║╚████║██╔═██╗░░╚═══██╗
██║░╚═╝░██║██████╔╝░░░░░░███████╗██║██║░╚███║██║░╚██╗██████╔╝
╚═╝░░░░░╚═╝╚═════╝░░░░░░░╚══════╝╚═╝╚═╝░░╚══╝╚═╝░░╚═╝╚═════╝░
`));

console.log(color.magenta(`FILE NAME:  ${pathUser}`))

pathUser = pathRoute.resolve(pathUser); //Convertimos ruta relativa en absoluta

console.log(color.magenta(`FILE PATH:  ${pathUser}`))

let options = {
    validate: false,
    stats: false
};

if (
    (optionOne === "--validate" && optionTwo === "--stats") ||
    (optionOne === "--stats" && optionTwo === "--validate")
) {
    options.validate = true;
    options.stats = true;
} else if (optionOne === "--validate") {
    options.validate = true;
    options.stats = false;
} else if (optionOne === "--stats") {
    options.stats = true;
    options.validate = false;
} else if (help) {
    console.log(color.magenta(`
                                            PRUEBA LOS SIGUIENTES COMANDOS
            -------------------------------------------HELP-----------------------------------------
            | --validate         | 'Obtendras el href, title, file, status y message de cada link' |
            | --stats            | 'Muestra las estadísticas de los links en totales y unicos'     |
            | --Validate --stats | 'Realiza la validación y muestra las estadística de los links'  |
            ----------------------------------------------------------------------------------------
            `));
} else {
    options.validate = false;
    options.stats = false;
}

mdLinks.mdLinks(pathUser, options)
    .then(res => {

        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })