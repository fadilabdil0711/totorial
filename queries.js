const Pool = require("pg").Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'server',
    password: 'fadil071100',
    port: 5432
});
const ResponseClass = require("./model/response") // opsional
const getProduk = (request, response) => {
    var responseReturn = new ResponseClass();
    pool.query('SELECT * FROM produk ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        responseReturn.status = true;
        responseReturn.code = 200;
        responseReturn.message = "Success";
        responseReturn.data = results.rows;
        response.status(200).json(responseReturn);
    })
}
const getProdukById = (request, response) => {
    var responseReturn = new ResponseClass();
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM produk WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount == 0) {
            responseReturn.status = true;
            responseReturn.code = 404;
            responseReturn.message = "User not found";
            responseReturn.data = null;
        } else {
            responseReturn.status = true;
            responseReturn.code = 200;
            responseReturn.message = "Success";
            responseReturn.data = results.rows[0];
        }
        response.status(200).json(responseReturn);
    })
}
const createProduk = (request, response) => {
    const { nama_produk, harga, tipe_produk, stok } = request.body;
    pool.query('INSERT INTO produk (nama_produk, harga, tipe_produk, stok) VALUES ($1, $2, $3, $4)', [nama_produk, harga, tipe_produk, stok], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send("product added");
    })
}
const updateProduk = (request, response) => {
    const id = parseInt(request.params.id);
    var responseReturn = new ResponseClass();
    try {
        const { nama_produk, harga, tipe_produk, stok } = request.body;
        pool.query('UPDATE produk SET nama_produk = $1, harga = $2, tipe_produk = $3, stok = $4 WHERE id = $5', [nama_produk, harga, tipe_produk, stok, id], (error, results) => {
            if (error) {
                throw error
            }
            responseReturn.status = true;
            responseReturn.code = 200;
            responseReturn.message = "product modification successed";
            responseReturn.data = null;
            response.status(200).send(responseReturn);
        })
    } catch (error) {
        responseReturn.status = false;
        responseReturn.code = 500;
        responseReturn.message = error.message;
        responseReturn.data = null
        response.status(500).json(responseReturn);
    }
}
const deleteProduk = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM produk WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send("produk deleted");
    })
}
module.exports = {
    getProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk
}