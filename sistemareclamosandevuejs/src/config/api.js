const apiReucord = {
    url: process.env.NODE_ENV === 'development' ? 
        'http://localhost:5001/sistemareclamosande2021/us-central1/app/api' : 
        'https://us-central1-sistemareclamosande2021.cloudfunctions.net/app/api'
}

export default apiReucord