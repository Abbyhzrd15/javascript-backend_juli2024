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

app.get('/karyawan', async function (req,res) {  
    let dataview = {
      karyawan: await m_karyawan.get_semuaKaryawan(),
      message: req.query.msg,
  }
  res.render('karyawan/index', dataview)
})

app.get('/karyawan/detail/:id_karyawan', async function (req,res) {  
//ambil id yg dikirim via url 
  let idk = req.params.id_karyawan

  //setelah itu kirim ke proses request data mysql
  let dataview = {
      pegawai: await m_karyawan.get_satuKaryawan(idk),
  }
    res.render('karyawan/detail', dataview)
})

app.get('/karyawan/hapus/:id_karyawan', async function (req,res) {
  //ambil id yg dikirim via url 
  let idk = req.params.id_karyawan

  //proses hapus data
  try {
    let hapus = await m_karyawan.hapus_satuKaryawan(idk)
    if (hapus.affectedRows > 0) {
      res.redirect(`/karyawan?msg=berhasil hapus karyawan`)
    }
  } catch (error) {
    throw error
  }
})

app.get('/karyawan/tambah', async function (req,res) {
  //ambil data departemen dari database tabel departemen
  let dataview = {
    dept: await m_departemen.get_semuaDepartemen(),
    agm: await m_agama.get_semuaAgama(),
  }
  res.render('karyawan/form-tambah', dataview)

})

app.post('/karyawan/proses-insert', async function (req,res) {
  //terima kiriman data dari form html
  // let body = req.body

  try {
    let insert = await m_karyawan.insert_karyawan(req)
    if (insert.affectedRows > 0) {
      res.redirect(`/karyawan?msg=berhasil tambah karyawan a/n ${req.body.form_nama_lengkap}`)
    }
  } catch (error) {
    throw error
  }
})

app.get('/karyawan/edit/:id_karyawan', async function (req,res) {
  let idk = req.params.id_karyawan
  let dataview = {
    dept    : await m_departemen.get_semuaDepartemen(),
    agm     : await m_agama.get_semuaAgama(),
    pegawai : await m_karyawan.get_satuKaryawan(idk),
  }
  res.render('karyawan/form-edit', dataview)
})

app.post('/karyawan/proses-update/:id_karyawan' , async function (req, res) {
  let idk = req.params.id_karyawan
  try {
    let update = await m_karyawan.update_karyawan(req, idk)
    if (update.affectedRows > 0) {
      res.redirect(`/karyawan?msg=berhasil edit karyawan a/n ${req.body.form_nama_lengkap}`)
    }
  } catch (error) {
    throw error
  }
})




app.listen(port, function () {
  console.log('Server sudah siap, buka http://localhost:' + port)
})