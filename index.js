const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())



const orders = [] //array de pedidos


//middleware para verificar a existência do id passado na requisição
const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({error: "Pedido não encontrado"})
    }

    request.ordersIndex = index
    request.orderId = id
    next()

}

//middleware para mostrar o método e a url de cada requisição
const requestType = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: http://localhost:3000${request.url}`)

    next()
}

/*POST /order: A rota deve receber o pedido do cliente, o nome do cliente e o valor do pedido, essas informações devem 
ser passadas dentro do corpo(body) da requisição, e com essas informações você deve registrar o novo 
pedido dentro de um array no seguinte formato:
{   id: "ac3ebf68-e0ad-4c1d-9822-ff1b849589a8",
    order: "X- Salada, 2 batatas grandes, 1 coca-cola",
    clientName:"José",
    price: 44.50,
    status:"Em preparação" }.
Não se esqueça que o ID deve ser gerado por você, dentro do código utilizando UUID V4, assim que o pedido 
é criado, você deve sempre colocar o status como "Em preparação". */

app.post('/order',requestType, (request, response) => {
    const { order, clientName, price, status} = request.body

    const user = { id:uuid.v4(), order, clientName, price, status}

    orders.push(user)

    return response.status(201).json({user})
})

//GET /order: Rota que lista todos os pedidos já feitos.
app.get('/order',requestType, (request, response) => {

    return response.json({orders})
})

/* PUT /order/:id: Essa rota deve alterar um pedido já feito. Pode alterar um ou todos os dados do pedido.
O id do pedido deve ser enviado nos parâmetros da rota. */
app.put('/order/:id', checkUserId,requestType, (request, response) => {
    
    const { order, clientName, price, status } = request.body
    const index = request.ordersIndex
    const id = request.order

    const updatedOrder = { id, order, clientName, price, status }

    

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})


//DELETE /order/:id: Essa rota deve deletar um pedido já feito com o id enviado nos parâmetros da rota.
app.delete('/order/:id', checkUserId,requestType, (request, response) => {
    const index = request.ordersIndex

    orders.splice(index, 1)

    return response.status(204).json()
})


//GET /order/:id: Essa rota recebe o id nos parâmetros e deve retornar um pedido específico.
app.get('/order/:id',requestType, (request, response) => {
    const { id } = request.params
    
    const currentOrder = orders.find(order => order.id === id)

    if (!currentOrder) {
        return response.status(404).json({error: "Pedido não encontrado"})
    }

    return response.json({currentOrder})
})


/* PATCH /order/:id: Essa rota recebe o id nos parâmetros e assim que ela for chamada, deve alterar o 
status do pedido recebido pelo id para "Pronto". */
app.patch('/order/:id',requestType, (request, response) => {
    const { id } = request.params
    const { status } = request.body

    const currentOrderIndex = orders.findIndex(order => order.id === id)

    if (currentOrderIndex === -1) {
        return response.status(404).json({error: "Pedido não encontrado"})
    }

    orders[currentOrderIndex].status = status || 'Pronto'

    return response.json({ message: 'Status do pedido alterado', order: orders[currentOrderIndex] })
})












app.listen(port, () => {
    console.log(`🌐🚀 Server started on port ${port}`)
})