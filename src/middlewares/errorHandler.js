const { error } = require("./respone");
const errorHandle = (err, request, response, next) => {
  const status = err.status || 500;
  // send back an easily understandable error message to the caller
  console.log("Erorr is caught");
  response.status(status).json(error());
};

module.exports = { errorHandle };
