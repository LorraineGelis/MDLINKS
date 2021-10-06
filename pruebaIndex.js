const fs = require('fs');
//const { resolve } = require('path');
const path = require('path');
const marked = require('marked');



//console.log(marked);
const fileHound = require('filehound');
const fetch = require('node-fetch');
const { resolve } = require('path');
//console.log(marked, "verificando")
let pathUser = process.argv[2]; // la invocación completa de la línea de comandos

console.log(" ---------------------------------------- MD-LINKS  ---------------------------------------- ")

console.log(`FILE NAME:  ${pathUser}`)

pathUser = path.resolve(pathUser); //Convertimos ruta relativa en absoluta
//console.log('la ruta convertida en absoluta es ' + pathUser);

console.log(`FILE PATH:  ${pathUser}`)

//Funcion que valida si es archivo o directorio
const fileOrDirectory = (pathUser) => {
    return new Promise((resolve, reject) => {
        fs.lstat(pathUser, (err, stats) => {
            if (err) {
                //Aqui capturamos el error de las promesas
                //console.log("Encontramos un error: la ruta o el archivo no es válido. Inténtalo de nuevo.")
                reject('Encontramos un error: la ruta o el archivo no es válido. Inténtalo de nuevo.');
                //console.log("Encontramos un error: la ruta o el archivo no es válido. Inténtalo de nuevo.")
            } else if (stats.isDirectory()) {
                resolve(readDirectory(pathUser));
            } else {
                resolve(mdFile(pathUser));
            }
        });
    });
};

fileOrDirectory(pathUser).catch((e) => { console.log(e) });

//FUNCION PARA BUSCAR LOS ARCHIVOS .MD
const mdFile = file => {
    let extFile = path.extname(file);
    if (extFile === ".md") {
        return readMdFile(file);
    } else {
        console.log("Este no es un archivo de extensión .md, pruebe con otro archivo o directorio");
    }
};

// funcion que imprime en terminal los archivos que concuerden con la extención del formato markdown ".md".
const readDirectory = (pathRoute) => {
    return new Promise((resolve, reject) => {
        fileHound.create()
            .paths(pathRoute)
            .ext(".md")
            .find()
            .then(res => (res.forEach(file => {
                if (file.length != 0) {
                    console.log(" Hemos encontrado archivos .md en: " + file);
                    resolve(readMdFile(file));
                }
            })))
            .catch(err => {
                reject(err("La ruta no es válida"));
            })
    })
};

//Función para leer archivos con extensión .md

const readMdFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(getLinks(data, file));
            //console.log(getLinks(data, file), "verificando");
        });
    });
};

//readMdFile(pathUser, "algo")


// Función que extrae links, texto y rutas de archivos con extensión "md"

const getLinks = (textFile, file) => {

    //mark.js es una biblioteca escrita en JavaScript que puede transcodificar(un archivo pasa a otro formato) Markdown en línea

    //Usando un custom renderer de marked (new marked.Renderer()).

    let arrayLinks = [];

    const renderer = new marked.Renderer();

    //renderer Las opciones le permiten utilizar estilos personalizados para renderizar

    //console.log(renderer.link, "¿Que me trae eso?")
    renderer.link = (href, title, text) => {
        arrayLinks.push({
            href: href,
            text: text,
            file: file,
        });
    }
    marked(textFile, {
        renderer: renderer
    });

    mdLinks(arrayLinks);

    if (arrayLinks.length === 0) {
        console.log("No hemos encontrado ningún enlace en: ", file)
    }

}

//Función que valida los links extraidos y retorna el status en numero y texto

const validateLinks = (validateLinks) => {
    const linksValidateFetch = validateLinks.map((element) => {
        return fetch(element.href)
            .then((res) => {
                let message;
                if (res.status >= 200 && res.status < 400) {
                    message = 'ok'
                } else {
                    message = 'fail'
                }
                return {
                    href: res.url,
                    text: element.text,
                    file: element.file,
                    status: res.status,
                    messajeStatus: message
                }

            })

    });


    Promise.all(linksValidateFetch)

    .then(resp => {

        resp.forEach(element => {

            console.log((element.file) + " " +
                (element.href) + " " +
                (element.status) + " " +
                (element.messajeStatus) + " " +
                (element.text))

        });



    })

}

// Stats para los links, total y unique.








module.exports = {
    validateLinks,
}