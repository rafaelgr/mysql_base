
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let like = require('chai-like');
let should = chai.should();
let server = require('../server_test');

chai.config.includeStack = false;
chai.use(chaiHttp);
chai.use(like);

let createdUser = {};

after(() => {
    server.close();
})
describe("USERS", () => {
    describe("/POST user", ()=>{
        it('it should POST a user', (done) => {
            let user = {
                email: "ana@gmail12.com",
                password: "x234"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    delete user.password;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userId');
                    res.body.should.like(user);
                    createdUser = res.body;
                    done();
                });
        });
        it('it should not POST a user with the same email', (done) => {
            let user = {
                email: "ana@gmail12.com",
                password: "x234"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    delete user.password;
                    res.should.have.status(409);
                    done();
                });
        });
    });
    describe("/GET/:id user", () => {
        it('it shoud GET the user created', (done) => {
            let comparedUser = createdUser;
            delete comparedUser.password
            chai.request(server)
                .get('/users/' + createdUser.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdUser)
                    done();
                });
        });
    });
    describe("/GET user", () => {
        it('it shoud GET the all users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT user", ()=>{
        it('it should PUT a user modified', (done) => {
            createdUser.password = "melinishj";
            chai.request(server)
                .put('/users')
                .send(createdUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/login  POST", () => {
        it('it should LOG an authorized user', (done) => {
            let usuLog = {
                email: "ana@gmail12.com",
                password: "melinishj"
            }
            chai.request(server)
                .post('/users/login')
                .send(usuLog)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
        it('it should not LOG an user with incorrect password', (done) => {
            let usuLog = {
                email: "ana@gmail12.com",
                password: "----"
            }
            chai.request(server)
                .post('/users/login')
                .send(usuLog)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
    describe("/DELETE/:id user", () => {
        it('it shoud DELETE the user created', (done) => {
            chai.request(server)
                .delete('/users/' + createdUser.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


