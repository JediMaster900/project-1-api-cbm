const chars = [];

// function to send a json object
const respondJSON = (request, response, status, object) => {
  // set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': 'application/json' });
  // stringify the object (so it doesn't use references/pointers/etc)
  // but is instead a flat string object.
  // Then write it to the response.
  if (object) {
    response.write(JSON.stringify(object));
  }
  // Send the response to the client
  response.end();
};

// function to show a success status code
const addChar = (request, response, body) => {
  // if either field is empty, send back a 400
  if (body.name === '' || body.atk === '') {
    const responseJSON = {
      id: 'addUserMissingParams',
      message: 'Name and atk are both required.',
    };
    console.log(`Here is the response: ${responseJSON}`);
    return respondJSON(request, response, 400, responseJSON);
  }

  // check if user is in system, and if so, change the attack
  if (chars.some((e) => e.name === body.name)
    && chars[chars.findIndex((e) => e.name)].atk !== body.atk) {
    chars[chars.findIndex((e) => e.name)].atk = body.atk;
    return respondJSON(request, response, 204);
  }

  // user is not in the system, and fields are filled, so they will be added

  chars.push(body);

  // send our json object that contains the user info with a success created status code
  return respondJSON(request, response, 201, body);
};

// function to get the list of chars (or just a head response)
const getChars = (request, response) => {
  // head request, so don't send the actual list of chars
  if (request.method === 'HEAD') {
    return respondJSON(request, response, 200);
  }

  // send our json list of chars with a success created status code
  return respondJSON(request, response, 200, chars);
};

// function to show not found error
const notFound = (request, response) => {
  if (request.method === 'GET') {
    const responseJSON = {
      id: 'notFound',
      message: 'The page you are looking for was not found.',
    };

    return respondJSON(request, response, 404, responseJSON);
  }

  // return our json with a 404 not found error code
  return respondJSON(request, response, 404);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  addChar,
  getChars,
  notFound
};
