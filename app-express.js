const express   = require('express')
const app       = express()
const port      = 3000
const mysql     = require('mysql2')
const db        = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_belajar_database',
})
db.connect()



// untuk mengambil data yg terencode(enkripsi) dari form html
// yg dikirim melalui protokol http
app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs') //setting penggunaan template engine untuk express
app.set('views', './view-ejs') // setting penggunaan folder untuk menyimpan file .ejs

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

//include masing2 model
const m_karyawan    = require('./model/m_karyawan')
const m_departemen  = require('./model/m_departemen')
const m_agama       = require('./model/m_agama')

const c_karyawan = require('./controller/c_karyawan')

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

app.get('/karyawan', c_karyawan.index)
app.get('/karyawan/detail/:id_karyawan', c_karyawan.detail)
app.get('/karyawan/hapus/:id_karyawan', c_karyawan.hapus)
app.get('/karyawan/tambah', c_karyawan.tambah)
app.post('/karyawan/proses-insert', c_karyawan.proses_insert)
app.get('/karyawan/edit/:id_karyawan', c_karyawan.proses_edit)
app.post('/karyawan/proses-update/:id_karyawan' , c_karyawan.proses_update)

app.listen(port, function () {
  console.log('Server sudah siap, buka http://localhost:' + port)
})