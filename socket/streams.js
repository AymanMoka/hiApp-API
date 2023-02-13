module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("reload", (data) => {
      io.emit("refreshPage", {}); //emit to all
    });
  }); //socket.io
}