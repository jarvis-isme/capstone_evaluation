exports.success = (message, results, statusCode = 200) => {
  return {
    message,
    error: false,
    code: statusCode,
    data: results,
  };
};

exports.error = (message = "Internal server error", statusCode = 500) => {
  const codes = [400, 401, 404, 403, 422, 500];

  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message: message,
    code: statusCode,
    data: null,
  };
};

exports.validation = (errors) => {
  return {
    message: "Bad request",
    code: 400,
    data: null,
  };
};
