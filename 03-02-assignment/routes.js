const getUsers = require("./utility");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Welcome</title></head>");
    res.write("<body>");
    res.write("<h1>Welcome User!</h1>");
    res.write("<form method='POST' action='/create-user'>");
    res.write("<p><input name='username'/></p>");
    res.write("<p><button type='submit'>Create</button></p>");
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>User List</title></head>");
    res.write("<body>");
    res.write("<h1>User List</h1>");
    res.write("<ul>");
    getUsers().map((user) => {
      res.write("<li>");
      res.write(user);
      res.write("</li>");
    });
    res.write("</ul>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", (chuck) => {
      body.push(chuck);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log("Username is: ", username);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
};

module.exports = requestHandler;
