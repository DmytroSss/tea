const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const mongoose = require('mongoose')
const Main = require('../data/schema.js')



module.exports.run = async (client,message,args) => {
	try{

		let rUser = message.author;
		let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));


		//Эмбеды
	let permErr = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Отказано")
	.setDescription(`${rUser}, похоже, что у вас нет прав для использования этой команды`)

	let sameErr = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Отказано")
	.setDescription(`${rUser}, вы не можете выдать наказание сомому себе`)

	let noTime = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Отказано")
	.setDescription(`${rUser}, вы не указали время наказания`)

	let userIsHigher = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Отказано")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`${rUser}, данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему наказание.`)
	.setTimestamp();





		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
		if (mUser.id === rUser.id) return message.channel.send(sameErr);
		if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
		let reason = args.slice(2).join(' ');
		if (reason.length < 1) reason = 'Причина не указана.';
		if (!args[1] || isNaN(ms(args[1]))) return message.channel.send(noTime);

		let banTime = ms(args[1]);





		mainData = await Main.findOne({userID: mUser.id})
		if(!mainData){
			rb = await Main.create({
				userID: mUser.id,
				timeout: banTime,
				reason: reason,
				warns: 0,
				muteGet: Date.now()
			})
			rb.save()
		} else {
			rbData = await Main.updateOne({
      userID: mUser.id,
	    }, {
	    timeout: banTime,
			reason: reason,
			muteGet: Date.now(),
			warns: 0,
	    });
	}

	const seconds = Math.floor((banTime / 1000) % 60);
	const minutes = Math.floor((banTime / 1000 / 60) % 60);
	const hours = Math.floor((banTime / 1000 / 60 / 60) % 24);
	const days = Math.floor(banTime / 1000 / 60 / 60 / 24);

	let rbEmd = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Успешно выдано наказание")
	.setDescription(`${rUser}, ${mUser} получил наказание на: **${days}дней ${hours}часов ${minutes}минут ${seconds}сек. **\n\n**Причина: **` + "`" + reason + "`")

	mUser.roles.add("1054281192528150618");
	message.channel.send(rbEmd)




		if (mUser.voice.channel != null) {
		mUser.voice.setChannel(null);
		}
	}catch(err){
	if(err.name === "ReferenceError")
		console.log("У вас ошибка")
	console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
}
}

module.exports.help = {
	name: "mute",
	alias: "rb"
};
