const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	console.log('hit & run');
	res.send(`Running on port: ${PORT}`);
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);
    
    console.log('soc connected id', socket.id);

	socket.on("disconnect", () => {
        console.log('disconnect called');
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        console.log('callUser called');
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
        console.log('answerCall called');
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
