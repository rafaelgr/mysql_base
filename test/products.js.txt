
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let like = require('chai-like');
let should = chai.should();
let server = require('../server_test');
let mongoose = require('mongoose');
let Product = require('../models/product');

chai.use(chaiHttp);
chai.use(like);

let createdProduct = {};

after(() => {
    server.close();
    mongoose.connection.close();
})
describe("PRODUCTS", () => {
    describe("/POST product", () => {
        it('it should POST a product', (done) => {
            let product = {
                name: "Test product",
                price: 10.58
            }
            chai.request(server)
                .post('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.like(product);
                    createdProduct = res.body;
                    done();
                });
        });
        it('it should not POST a product without a name', (done) => {
            let product = {
                price: 10.58
            }
            chai.request(server)
                .post('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('error');
                    done();
                });
        });
    });
    describe("/GET/:id product", () => {
        it('it shoud GET the product created', (done) => {
            chai.request(server)
                .get('/products/' + createdProduct._id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdProduct);
                    done();
                });
        });
    });
    describe("/GET product", () => {
        it('it shoud GET the all products', (done) => {
            chai.request(server)
                .get('/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT product", ()=>{
        it('it should PUT a product modified', (done) => {
            createdProduct.price = '20.5';
            chai.request(server)
                .put('/products')
                .send(createdProduct)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id product", () => {
        it('it shoud DELETE the product created', (done) => {
            chai.request(server)
                .delete('/products/' + createdProduct._id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


