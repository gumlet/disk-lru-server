const LRU = require("lru-cache");
const fs = require("fs");
const bytes = require('bytes');

let lrucache = new LRU({
  max: process.env.LRU_SIZE ? bytes(process.env.LRU_SIZE): bytes('1MB'),
  dispose: async (key) => {
  	try {
  		await fs.promises.unlink(`./cache/${key}`);
  	} catch (err) {
  		// do nothing.. mostly the file is already deleted.
  	}
  },
  length: async (n, key) =>  { 
  	let stat = await fs.promises.stat(`./cache/${key}`);
  	return stat.size;
  },
  noDisposeOnSet: true
});

const fastify = require('fastify')({
	keepAliveTimeout: 60000,
	trustProxy: true,
	logger: {
	    level: process.env.LOG_LEVEL || "debug",
	    prettyPrint: (process.env.NODE_ENV != "production")
	  },
});

fastify.server.setTimeout(55000);

fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, function (req, body, done) {
  done(null, body);
});

fastify.head('/lrucache/:cachekey', (req, res) => {
	if(lrucache.has(req.params.cachekey)) {
		res.status(204).send();
	} else {
		res.status(404).send();
	}	
});

fastify.get('/lrucache/:cachekey', async (req, res) => {
	if(lrucache.has(req.params.cachekey)) {
		try {
			res.send(await fs.promises.readFile(`./cache/${req.params.cachekey}`));
		} catch (err) {
			res.status(404).send();
		}
	} else {
		res.status(404).send();
	}	
});

fastify.put('/lrucache/:cachekey', async (req, res) => {
	if(req.body) {
		await fs.promises.writeFile(`./cache/${req.params.cachekey}`, req.body);
		lrucache.set(req.params.cachekey, true);
	}
	res.status(204).send();
});

fastify.delete('/lrucache/:cachekey', async (req, res) => {
	try {
  		await fs.promises.unlink(`./cache/${req.params.cachekey}`);
  	} catch (err) {
  		// do nothing.. mostly the file is already deleted.
  	}
	lrucache.del(req.params.cachekey);
	res.status(204).send();
});


fastify.listen(process.env.PORT || 4001, "0.0.0.0").then(() => {
   console.log(`LRU Server - listening on port: ${process.env.PORT || 4001}`);
});