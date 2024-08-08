const http = require('http') //sudah ada modul bawaan dari node.js
const mysql = require('mysql2') // module dari node_modules

//konfigurasi database mysql yg ingin di gunakan
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'jfd_belajar_database',
})

//menyambungkan atau membuka koneksi
db.connect()

let sql = 
`DELETE FROM karyawan 
WHERE id = 13` 
//ambil data dari mysql
db.query( sql, function(error, hasil){
    if (error) {
        console.log(error);
    } else {
        //console.log(hasil)
        if(hasil.affectedRows > 0) {
            console.log('berhasil delete data karyawan')
        }
    }
})

db.end()