const http = require ('http')

let server = http.createServer (function(request, respon){
    //mendeteksi status http (user berhasil terkoneksi dengan aplikasi kita)
    //content-type: apa tipe konten yg ingi diberikan ke user
    //text/plain itu akan menampilkan teks apa adanya
    //text/html akan merender tag html menjadi tampilan di browser
    respon.writeHead(200, {'Content-type':'text/html'})
    // hasil akhir yg di berikan ke user
    respon.end('Hallo World, my name is Abbil')
})

server.listen(3000, function () {
    console.log('Server sudah siap, buka http://localhost:3000')
})