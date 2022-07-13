ERROR_MAPS = {
  "": "",
};
class CapstoneException extends Error {
  constructor(message) {
    super(message);
    // name is set to the name of the class
    this.name = this.constructor.name;
  }

  raise(code) {
    return;
  }
}
