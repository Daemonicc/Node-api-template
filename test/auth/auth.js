process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const { assert } = require("chai");
const request = require("supertest");

const { app, server } = require("../../app");

describe("Starter Template", () => {
  after(() => {
    server.close();
  });

  describe("User Authentication", () => {
    let user = {
      email: "igunnuenuel@gmail.com",
      username: "daemoniic",
      firstname: "Emmanhhuel",
      lastname: "Boluwahhtife",
      password: "qwerty12345",
    };

    let token;

    it("OK, register new user", (done) => {
      request(app)
        .post("/api/v1/auth/register")
        .send(user)
        .expect(201)
        .then((res) => {
          const body = res.body;
          assert(body.success, true);
          expect(body).to.contain.property("token");
          done();
        })
        .catch((err) => done(err));
    });
    it("Error, duplicate user", (done) => {
      request(app)
        .post("/api/v1/auth/register")
        .send(user)
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).to.contain.property("error");
          done();
        })
        .catch((err) => done(err));
    });
    it("OK, Logins in", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: user.email, password: user.password });
      expect(response.status).equal(200);
      expect(response.body.success).equals(true);
      token = response.body.token;
    });
    it("Error, invalid login", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: user.email, password: "seersdfsd" });
      expect(response.status).equal(401);
      expect(response.body.success).equals(false);
    });
    it("OK, gets user profile", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer " + token);
      expect(response.status).equal(200);
      expect(response.body).to.contain.property("data");
    });
    it("Error, get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set(
          "Authorization",
          "Bearer " +
            "ewweqrwerqwewtqrwtdvweqrqwerwqe.reqwqrerqweeqwrqewr.3442qwrewfdsaf"
        );
      expect(response.status).equal(401);
    });
  });
});
