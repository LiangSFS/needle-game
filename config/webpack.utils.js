module.exports = {
  cssMinimize () {
     return process.env.NODE_ENV === "production"?true:false;
  }
};