const http = require("http")
const fs = require ("fs")

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'ico': 'image/x-icon',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4'
}

const servidor = http.createServer((pedido,respuesta)=>{
    const url = new URL("http://localhost:8088" + pedido.url)
    let camino = "public" + url.pathname;
    if(camino == "public/")
        camino = "public/index.html"
    encaminar(pedido,respuesta,camino)
})

servidor.listen(8888)

function encaminar(pedido,respuesta,camino){
    switch(camino){
        case "public/recuperardatos":{
            recuperarDatos(pedido,respuesta)
            break;
        }
        default:{
            fs.stat(camino,error =>{
                if(!error){
                    fs.readFile(camino,(error,contenido)=>{
                        if(error){
                            respuesta.writeHead(500,{"Content-Type":"text/plain"})
                            respuesta.write('Error interno')
                             respuesta.end()
                        }else{
                            const vec = camino.split('.')
                            const extension = vec[vec.length - 1]
                            const mimearchivo = mime[extension]
                            respuesta.writeHead(200, { 'Content-Type': mimearchivo })
                            respuesta.write(contenido)
                            respuesta.end()
                        }
                    })
                }else{
                    respuesta.writeHead(404, { 'Content-Type': 'text/html' })
                    respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>')
                    respuesta.end()
                }
            })
        }
    }
}
function recuperarDatos(pedido, respuesta) {
    let info = ''
    pedido.on('data', datosparciales => {
      info += datosparciales
    })
    pedido.on('end', () => {
      const formulario = new URLSearchParams(info)
      console.log(formulario)
      respuesta.writeHead(200, { 'Content-Type': 'text/html' })
      let palabra = formulario.get("palabra");
      let vocales = "aeiouAEIOU"
      let palabraAux = palabra.split("")
    let cont = palabraAux.length+1;
    for (let e = 0; e < palabraAux.length; e++) {
        if (palabraAux[e].match(/[aeiou]/) ||palabraAux[e].match(/[AEIOU]/) ) {
            if (
                (e === 0 || palabraAux[e - 1] !== "p") &&
                (e === palabraAux.length - 1 || palabraAux[e + 1] !== "p")
            ) {
                palabraAux.splice(e + 1, 0, "p", palabraAux[e]);
                e++;
            }
        }
    }
        palabraAux = palabraAux.join("")
        let pagina = "<!doctype html><html><head></head><body>La palabra en idioma p es " + palabraAux +"</body></html>";
        respuesta.end(pagina) 
    })

  }