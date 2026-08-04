const { validationResult } = require("express-validator/check");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/burger.jpg",
        creator: {
          name: "Maximilian",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed, entered data is incorrect." });
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = {
    _id: new Date().toISOString(),
    title: title,
    content: content,
    imageUrl: "images/burger.jpg",
    creator: {
      name: "Maximilian",
    },
    createdAt: new Date(),
  };

  res.status(201).json({
    message: "Post created successfully!",
    post: post,
  });
};
