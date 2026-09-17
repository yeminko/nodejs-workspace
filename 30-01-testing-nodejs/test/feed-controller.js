const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

describe("Feed Controller - Login", function () {
  before(function () {});

  it("should add a created post to the posts of the creator", function (done) {
    const req = {
      body: {
        title: "Test Post",
        content: "This is a test post",
      },
      userId: "507f191e810c19729de860ea",
    };

    const res = {
      statusCode: 500,
      post: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.post = data.post;
      },
    };

    FeedController.createPost(req, res, () => {}).then(() => {
      expect(res.statusCode).to.equal(201);
      expect(res.post).to.have.property("title", "Test Post");
      expect(res.post).to.have.property("content", "This is a test post");
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
