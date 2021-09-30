const apiReucord = {
    url: process.env.NODE_ENV === 'development' ? 
        'http://localhost:5001/sistemareclamosande2021/southamerica-east1/app/api' : 
        'https://southamerica-east1-sistemareclamosande2021.cloudfunctions.net/app/api'
}

export default apiReucord