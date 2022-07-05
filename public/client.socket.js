const socket = io()

const date = new Date();
const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

const formMessageInput = document.querySelector('#formMessage')
const userNameInput = document.querySelector('#userName')
const messageInput = document.querySelector('#message')

const formNewProductInput = document.querySelector('#formNewProduct')
const productNewInput = document.querySelector('#productNew')
const priceNewInput = document.querySelector('#priceNew')
const thumbnailNewInput = document.querySelector('#thumbnailNew')



function renderProduts(productsArray){
    fetch('/plantilla.hbs').then(response =>{
        response.text().then((plantilla) =>{
            productsArray.forEach (element=>{
                const template = Handlebars.compile(plantilla);
                const html = template(element);
                document.querySelector('#products').innerHTML += html;
            })
        }).catch(error=>{
            console.log(error)
        })
    })
}





function renderMessage(messageArray){
    
    fetch('/plantilla2.hbs').then(response =>{
        response.text().then((plantilla) =>{
            document.querySelector('#messages').innerHTML = ""
            messageArray.forEach(message => {
                const template = Handlebars.compile(plantilla);
                const html = template(message);
                document.querySelector('#messages').innerHTML += html;    
            });
            
        }).catch(error=>{
            console.log(error)
        })
    })
}



formMessageInput.addEventListener('submit', submitHandler)


function submitHandler (event) {
    event.preventDefault()
    
    const messageInfo = { username: userNameInput.value, message: messageInput.value, month, day, year, hour, minutes, seconds}

    sendMessage(messageInfo)
    
}


function sendMessage (messageInfo){
    socket.emit('client:message', messageInfo)
}

socket.on('server:produtsArray', productsArray =>{
    document.querySelector('#products').innerHTML = ""  
    renderProduts(productsArray)

})

socket.on('server:newProduct', productsArray =>{
    document.querySelector('#products').innerHTML = ""  
    renderProduts(productsArray)

})

socket.on('server:message', messageArray =>{
    renderMessage(messageArray)
})


formNewProductInput.addEventListener('submit', submitProductHandler)

function submitProductHandler (event) {
    event.preventDefault()
    
    const newProductInfo = { title: productNewInput.value, price: priceNewInput.value, thumbnail: thumbnailNewInput.value}

    sendNewProduct(newProductInfo)
    
}

function sendNewProduct(newProductInfo){
    socket.emit('client:newProduct', newProductInfo)
}