
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let like = require('chai-like');
let should = chai.should();
let server = require('../server_test');

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
});


