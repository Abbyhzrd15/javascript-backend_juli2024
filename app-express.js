const express   = require('express')
const app       = express()
const port      = 3000
const mysql     = require ('mysql2')
const db        = mysql.createConnection({
  
  host: 'localhost',
  user: 'root',
  password: '',
  database:'jfd_belajar_database',
})

db.connect()

app.set('view engine', 'ejs') //setting penggunaan template engine untuk express
app.set('views', './view-ejs')

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

//route -> rute
app.get('/hubungi', function (req, res) {
  let data = {
    emailku : 'abbydrajad15@gmail.com',
    hpku : '081273257899'
  }
  res.render('hubungi', data)
})

app.get('/profil', function (req, res) {
    let data = {
    jabatan : 'Senior Programmer',
     gender : 'laki',
     gaji: 9000000,
    }
    res.render('profil-developer', data)
})

//buat function terpisah untuk
//proses pengambilan data dari mysql
function get_semuaKaryawan () {
    return new Promise ( (resolve, reject)=> {
       db.query("SELECT * FROM karyawan", function(errorSql, hasil) {
          if (errorSql) {
            reject(errorSql)
          } else {
            resolve(hasil)  
          }
      })
    }) 
  }

  //gunakan async, untuk memaksa node js
  //menunggu script yg di panggil sampai selsai di eksekusi
app.get('/karyawan', async function (req,res) {  
    let dataview = {
      karyawan: await get_semuaKaryawan()
  }
  res.render('karyawan/index', dataview)
})

app.get('/karyawan/detail/:id_karyawan', async function (req,res) {  
//ambil id yg dikirim via url 
  let idk = req.params.id_karyawan

  //setelah itu kirim ke proses request data mysql
  let dataview = {
      pegawai: await get_satuKaryawan(idk),
  }
    res.render('karyawan/detail', dataview)
})

function get_satuKaryawan(idk){
  return new Promise ( (resolve, reject)=> {
    db.query("SELECT * FROM karyawan WHERE id = ?", [idk], function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}

app.listen(port, function () {
  console.log('Server sudah siap, buka http://localhost:' + port)
})