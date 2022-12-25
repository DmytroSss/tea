const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose')
const { prefix, token, mongodb } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const Main = require('./data/schema.js');

fs.readdir('./cmds/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js")
	if (jsfiles.length <= 0) console.log("нет команд для загрузки!");
	console.log(`загружено ${jsfiles.length} команд`);
	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i+1}. ${f} загружен!`);
		client.commands.set(props.help.name, props);
		client.commands.set(props.help.alias, props);
	})
})


 mongoose.connect(mongodb, {
	 useNewUrlParser: true,
 }).then(() => {
	 console.info('Успешно подключен к БазеДанных');
 }).catch((err) => {
	 console.warn('---MONGO-ERROR---');
	 console.warn(err);
	 console.warn('---MONGO-ERROR---');
 })


client.once('ready', () => {
	console.log('Ready!');

	setInterval(async function() {
		try {
			let memberList = client.guilds.cache.get("970624719671947344").roles.cache.get("1054281192528150618").members.map(m => m);

			memberList.forEach(async user => {
						rbData = await Main.findOne({
							userID: user.id,
						});

						if (rbData) {
							let reason = rbData.reason

							let unrbEmd = new Discord.MessageEmbed()
								.setColor(`#2f3136`)
								.setTitle("Наказание снято")
								.setDescription(`С ${user} было снято наказание за ` + "`" + reason + "`")

							let userTimeout = rbData.timeout;
							let userGetRb = rbData.muteGet;
							if (Date.now() > (userGetRb + userTimeout) && user.roles.cache.has("1054281192528150618")) {
								await user.roles.remove("1054281192528150618");
								await client.channels.cache.get("970654610391957515").send(unrbEmd);
							}
						}


					})
		} catch (err) {
					console.log(err);
				}
	}, 1000)
});

client.on('message', message => {
	let messageArray = message.content.split(" ");
		let command = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);
		if (!message.content.startsWith(prefix)) return;
		let cmd = client.commands.get(command.slice(prefix.length));
		if (cmd) cmd.run(client, message, args);
});

client.login(token);
