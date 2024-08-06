let nama = 'Uchiha Sasuke'
let alamat = 'Konoha'

function biodata() {
        return `Biodata Karyawan:\n
        ==================\n
        nama: ${nama}\n
        alamat: ${alamat}\n`
}

module.exports = {
    nama, alamat, cetakbio: biodata
}