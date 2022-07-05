
const express = require('express')
const {Server: IOServer} = require('socket.io')
const app = express()
//const port = process.env.PORT
const port = 8080
const path = require('path')
const fs = require ('fs');


const productsArray = [{"title": "Cocacola", "price": "200", "thumbnail": "https://cdn4.iconfinder.com/data/icons/soda_pop_caps/PNG/Coca-Cola_256.png"}, {"title": "pepsi", "price": "198", "thumbnail": "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/pepsi-256.png"}]

const messageArray = []

app.use(express.json())
app.use(express.urlencoded())


app.use(express.static(path.join(__dirname, '../public')))

const expressServer = app.listen(port, (error) =>{
    if(error){
        console.log(`Hubo un error al comunicarse con el puerto: ${port}, con error ${error}`)
    }else{
        console.log(`Escuchando puerto: ${port}`)
    }
})


const io = new IOServer(expressServer)

io.on('connection', socket =>{
    io.emit('server:message', messageArray)
    io.emit('server:produtsArray', productsArray)

    socket.on('client:message', messageInfo => {
        
        messageArray.push(messageInfo)

        writeTheFile(messageArray)

        io.emit('server:message', messageArray)
    })

    socket.on('client:newProduct', newProductInfo =>{
        productsArray.push(newProductInfo)
        io.emit('server:newProduct', productsArray)
    })

})


function writeTheFile(messageArray){
    fs.writeFileSync("misMensajes.txt", JSON.stringify(messageArray));
}
