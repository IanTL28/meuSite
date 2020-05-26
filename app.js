const express = require('express');

const server = express();

server.get("/", (req,res)=>{
	res.sendFile(__dirname + '/index.html');
});

const port = 3000.

server.use(express.static('assets/css/site.css'));

server.listen(port, () => {
	console.log('server listening at '+port);
});


