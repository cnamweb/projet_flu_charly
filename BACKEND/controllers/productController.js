const db = require("../models");
const Products = db.products;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
    Products.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products."
            });
        });
    
}

exports.getFiltered = (req, res) => {
    const { category, name } = req.body;
    Products.findAll({ where: { category:  { [Op.like]: `%${category}%` }, namepr: { [Op.like]: `%${name}%` } } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Some error occurred while retrieving products with category ${category} and name like ${name}.`
            });
        });
}

exports.getAllCategories = (req, res) => {
    Products.findAll({ attributes: ['category'] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving categories."
            });
        });
}