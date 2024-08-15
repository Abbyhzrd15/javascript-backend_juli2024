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

// untuk mengambil data yg terencode(enkripsi) dari form html
// yg dikirim melalui protokol http
app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs') //setting penggunaan template engine untuk express
app.set('views', './view-ejs') // setting penggunaan folder untuk menyimpan file .ejs

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
  let sql = 
  `SELECT 
    karyawan.*,
    departemen.kode, departemen.nama AS nama_dept,
    agama.nama AS nama_agama
  FROM karyawan
  LEFT JOIN departemen  ON departemen.id = karyawan.departemen_id
  LEFT JOIN agama       ON agama.id = karyawan.agama_id
  WHERE karyawan.id = ?`;
  return new Promise ( (resolve, reject)=> {
    db.query(sql, [idk], function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}

app.get('/karyawan/hapus/:id_karyawan', async function (req,res) {
  //ambil id yg dikirim via url 
  let idk = req.params.id_karyawan

  //proses hapus data
  try {
    let hapus = await hapus_satuKaryawan(idk)
    if (hapus.affectedRows > 0) {
      res.redirect('/karyawan')
    }
  } catch (error) {
    throw error
  }
})

function hapus_satuKaryawan(idk) {
  let sql = 
  `DELETE FROM karyawan
  WHERE id = ?`;
  
  return new Promise ( (resolve, reject)=> {
    db.query(sql, [idk], function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}

app.get('/karyawan/tambah', async function (req,res) {
  //ambil data departemen dari database tabel departemen
  let dataview = {
    dept: await get_semuaDepartemen(),
    agm: await get_semuaAgama(),
  }
  res.render('karyawan/form-tambah', dataview)

})

function get_semuaDepartemen(){
  return new Promise ( (resolve, reject)=> {
    db.query("SELECT * FROM departemen", function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}

function get_semuaAgama(){
  return new Promise ( (resolve, reject)=> {
    db.query("SELECT * FROM agama", function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}


app.post('/karyawan/proses-insert', async function (req,res) {
  //terima kiriman data dari form html
  // let body = req.body

  try {
    let insert = await insert_karyawan(req)
    if (insert.affectedRows > 0) {
      res.redirect('/karyawan')
    }
  } catch (error) {
    throw error
  }
})

function insert_karyawan(req) {
  let data = {
    nama          : req.body.form_nama_lengkap,
    gender        : req.body.form_gender,
    alamat        : req.body.form_alamat,
    nip           : req.body.form_nip,
    departemen_id : req.body.form_departemen,
    agama_id      : req.body.form_agama,
  }
  
  let sql = `INSERT INTO karyawan SET ?`;
  
  return new Promise ( (resolve, reject)=> {
    db.query(sql, [data], function(errorSql, hasil) {
       if (errorSql) {
         reject(errorSql)
       } else {
         resolve(hasil)  
       }
   })
 }) 
}

app.get('/karyawan/edit/:id_karyawan', async function (req,res) {
  let idk = req.params.id_karyawan
  let dataview = {
    dept    : await get_semuaDepartemen(),
    agm     : await get_semuaAgama(),
    pegawai : await get_satuKaryawan(idk),
  }
  res.render('karyawan/form-edit', dataview)
})


app.listen(port, function () {
  console.log('Server sudah siap, buka http://localhost:' + port)
})