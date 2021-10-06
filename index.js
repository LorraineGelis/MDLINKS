//Modulos nativos de node
const fs = require('fs');
const path = require('path');
const { resolve } = require('path');

//Librerias de node
const fetch = require('node-fetch');

//Librerias adicionales
const fileHound = require('filehound');
const color = require("ansi-colors")
const marked = require('marked');


//Funcion madre mdLinks que se encargará de retornar una promesa
const mdLinks = (path, options) => {
    return new Promise((resolve, reject) => {
        if (options.validate === false && options.stats === false) {
            fileOrDirectory(path)
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        } else if (options.validate === true && options.stats === false) {
            fileOrDirectory(path)
                .then(links => {
                    validateLinks(links)
                        .then(res => {
                            resolve(res);
                        })
                })
                .catch(err => {
                    reject(err)
                });
        } else if (options.validate === false && options.stats === true) {
            fileOrDirectory(path)
                .then(res => {
                    resolve(statsLinks(res));
                })
                .catch(err => {
                    reject(err)
                })
        } else if (options.validate === true && options.stats === true) {
            fileOrDirectory(path)
                .then(res => {
                    validateLinks(res)
                        .then(res => {
                            resolve(statsValidate(res));
                        })
                })
                .catch(err => {
                    reject(err)
                })
        }
    });
};

//Funcion que valida si es archivo o directorio
const fileOrDirectory = (pathUser) => {
    return new Promise((resolve, reject) => {
        fs.lstat(pathUser, (err, stats) => {
            if (err) {
                //Aqui capturamos el error de las promesas
                reject(color.red(
                    `
                    ███████╗██████╗░██████╗░░█████╗░██████╗░
                    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗
                    █████╗░░██████╔╝██████╔╝██║░░██║██████╔╝
                    ██╔══╝░░██╔══██╗██╔══██╗██║░░██║██╔══██╗
                    ███████╗██║░░██║██║░░██║╚█████╔╝██║░░██║
                    ╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝

                    Encontramos un error: La ruta o el archivo no es válido. Inténtalo de nuevo.
                    `));
            } else if (stats.isDirectory()) {
                resolve(readDirectory(pathUser));
            } else {
                resolve(mdFile(pathUser));
            }
        })
    });
};

//Funion que nos ayuda a encontrar archivos .MD
const mdFile = file => {
    return new Promise((resolve, reject) => {
        let extFile = path.extname(file);
        if (extFile === ".md") {
            resolve(readMdFile(file));
        } else {
            reject("Este no es un archivo de extensión .md, pruebe con otro archivo o directorio");
        }

    })
};

// Función que extrae links, texto y rutas de archivos con extensión "md"

const getLinks = (data, file) => {

    //mark.js es una biblioteca escrita en JavaScript que puede transcodificar(un archivo pasa a otro formato) Markdown en línea

    //Usando un custom renderer de marked (new marked.Renderer()).

    let arrayLinks = [];

    const renderer = new marked.Renderer();

    //renderer Las opciones le permiten utilizar estilos personalizados para renderizar
    renderer.link = (href, title, text) => {
        arrayLinks.push({
            href: href,
            text: text,
            file: file,
        });
    }
    marked(data, {
        renderer: renderer
    });


    if (arrayLinks.length === 0) {
        console.log(color.red(`  
                     
        .:||||||||:.            
       (            )      
      (   o      o   )          
--@@@@------:  :------@@@@-- 
  Ups, no hemos encontrado ningún enlace en ${file}
`))
    }

    return arrayLinks;

}

//Función para leer archivos con extensión .md

const readMdFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(getLinks(data, file));
        });
    });
};

// funcion que imprime en terminal los archivos que concuerden con la extención del formato markdown ".md".
const readDirectory = (pathRoute) => {
    return new Promise((resolve, reject) => {
        fileHound.create()
            .paths(pathRoute)
            .ext(".md")
            .find()
            .then((res) => {
                // console.log(res)

                const results = [];

                res.forEach(file => {
                    results.push(readMdFile(file));
                });

                resolve(Promise.all(results));
            })
            .catch(err => {
                reject(err, "La ruta no es válida");
            })
    })
};


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
            .catch((err) => {
                return {
                    href: element.href,
                    text: element.text,
                    file: element.file,
                    status: -1,
                    messajeStatus: "No encontrada"
                }

            })


    });


    return Promise.all(linksValidateFetch)


}


// Stats para los links, total y unique.

const statsLinks = (linkStats) => {

    let statsArray = {};

    statsArray.Total = linkStats.length;
    statsArray.Unique = 0;
    let uniqueLinks = new Set() //Permite almacenar valores unicos de cualquier tipo.

    linkStats.forEach(link => {
        uniqueLinks.add(link.href);

    });
    statsArray.Unique = uniqueLinks.size

    return `( ͡^ ͜ʖ ͡^)✌      Total: ${statsArray.Total} 
            \n ( ͡~ ͜ʖ ͡°)     Unique: ${statsArray.Unique} `;


}

// Función que nos arroja el total de enlaces, unique y broken.

const statsValidate = (linkStats) => {

    const statsValidateObject = {};
    statsValidateObject.Total = linkStats.length
    statsValidateObject.Unique = 0;
    statsValidateObject.Broken = 0;
    const uniqueLinks = new Set();

    linkStats.forEach(link => {
        uniqueLinks.add(link.href);
        if (link.messajeStatus === 'fail') {
            statsValidateObject.Broken += 1;
        }
    });

    statsValidateObject.Unique = uniqueLinks.size

    return ` ( ͡^ ͜ʖ ͡^)✌  Total: ${statsValidateObject.Total} 
                \n ( ͡~ ͜ʖ ͡°) Unique: ${statsValidateObject.Unique} 
                \n (ง︡'-'︠)ง  Broken: ${statsValidateObject.Broken}`
}

//En este bloque de codigo exportamos las funciones.
module.exports = {
    mdLinks,
    fileOrDirectory,
    mdFile,
    readDirectory,
    validateLinks,
    statsLinks,
    statsValidate,
    readMdFile

}