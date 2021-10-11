# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Descripción del módulo](#2-resumen-del-proyecto)
* [3. Documentación del API ](#3-objetivos-de-aprendizaje)
* [4. Uso de la librería](#4-consideraciones-generales)
* [5. Criterios de aceptación mínimos del proyecto](#5-criterios-de-aceptación-mínimos-del-proyecto)
* [6. Entregables](#6-entregables)
* [7. Hacker edition](#7-hacker-edition)
* [8. Pistas, tips y lecturas complementarias](#8-pistas-tips-y-lecturas-complementarias)
* [9. Checklist](#9-checklist)
* [10. Achicando el problema](#10-achicando-el-problema)

***

## 1. Preámbulo 😍

Markdown es un lenguaje de marcado ligero muy popular entre developers. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...), y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio (empezando por el tradicional README.md).

Estos archivos Markdown normalmente contienen links (vínculos/ligas) que muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

md-links es una herramienta que usa Node.js, para leer y analizar archivos en formato Markdown, para verificar los links que contengan y reportar algunas estadísticas.


## 2. Descripción del módulo 💻

La libreria te permite extraer todos los enlaces dentro de un archivo de tipo Markdown(md), ademas, identifica cuales son los codigos de respuesta de las consultas y realizar estadisticas(enlaces rotos, unicos y cuatos son en su totalidad).

Para hacer uso de la librería debes instalarla desde [NPM](https://www.npmjs.com/package/lorrainegelisdiaz_mdlinks), a continuacion los detalles:

Instalación por npm:

npm i lorrainegelisdiaz_mdlinks

## 3. Documentación del API 📝

Para llevar a cabo el proyecto se hizo necesario realizar un diagrama de flujo. El cual les muestro a continuación:


Este proyecto se conforma de la siguiente manera:
1. JavaScript API:
Contiene funciones síncronas utilizando metodos de node,js como lo son; fileSystem y path. Se hizo necesario utilizar paquetes npm como: marked para convertir el texto de un archivo markdown a elementos html y junto con el custom renderer se puede extraer las propiedades de un elemento ancla, node-fetch para realizar las peticiones y obtener el status de los links, y por ultimo, no menos importante, contamos con la participación de filehound que nos ayuda con el tema de la recursividad.

2. CLI (Command Line Interface - Interfaz de Línea de Comando)
cli.js, posee el metodo de process.argv de node para poder capturar el input del usuario y luego una serie de condicionales para ver por consola el consumo de la promesa. Finalmente, para otorgar colores predeterminados por la consola, estoy utilizando una libreria denominada ansiColors.

## 3. Uso de la librería 📇

El ejecutable de esta librería se debe poder ejecutar de la siguiente manera a través de la terminal:
md-links <path> [options]
  
Por ejemplo:
1.Cuando ingresas una ruta incorrecta:

  
2.Cuando ingresas una ruta que no posea links
  
3.Cuando ingresas el comando --help visualizaras una sección de ayuda
  
4. Cuando ingresas una ruta correcta, pero sin las respectivas opciones

5. Cuando ingresas una ruta correcta, con la opción --validate
  
6. Cuando ingreses una ruta correcta y con la opción --stats

7. Cuando ingreses una ruta y las opciones --validate --stats

Autora:
[Lorraine Gelis Diaz](https://github.com/LorraineGelis)
  

 Proximamente más versiones y mejoras en el código.. ✌️

  




