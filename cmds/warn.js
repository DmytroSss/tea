const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const mongoose = require('mongoose')
const Main = require('../data/schema.js')



module.exports.run = async (client,message,args) => {
	try{
    let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let rUser = message.author;

    //Эмбеды
    let permErr = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, похоже, что у вас нет прав для использования этой команды`)

  	let sameErr = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, вы не можете выдать наказание сомому себе`)

  	let userIsHigher = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему наказание.`)

    let noUser = new Discord.MessageEmbed()
    .setColor(`#2f3136`)
    .setTitle("Отказано")
    .setDescription(`${rUser}, вы не указали пользователя`)

    let userIsBanned = new Discord.MessageEmbed()
    .setColor(`#2f3136`)
    .setTitle("Отказано")
    .setDescription(`${rUser}, ${mUser} уже отбывает наказание`)




    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
    if (!mUser || mUser == mUser.user.bot) return message.channel.send(noUser);
    let uid = mUser.id;
    if (uid === rUser.id) return message.channel.send(sameErr);
    if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
    if (mUser.roles.cache.has("1054281192528150618")) return message.channel.send(userIsBanned);

    mainData = await Main.findOne({userID: uid})
    if(!mainData){
      warns = await Main.create({
			userID: uid,
			warns: 1,
		});
		warns.save();

    let warnEmd = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Предупреждения")
	.setDescription(`${mUser} получил предупреждение **#${warnNum+1}**\n\n**Выдал: ${rUser}**`)

	message.channel.send(warnEmd);

  } else {
    mainData = await Main.findOne({ userID: uid });
		warnNum = mainData.warns;

    if (warnNum >= 5) {
      let banTime = 604800000;
      let reason = "Получено более 5ти предупреждений."

      if(!mainData){
        rb = await Main.create({
          userID: uid,
          timeout: banTime,
          reason: reason,
          warns: 0,
          muteGet: Date.now()
        })
        rb.save()
      } else {
        rbData = await Main.updateOne({
        userID: uid,
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
    if (mUser.voice.channel != null) {
    mUser.voice.setChannel(null);
    }
  	mUser.roles.add("1054281192528150618");
  	message.channel.send(rbEmd)




  } else {
    mainData = await Main.updateOne({
      userID: uid
    }, {
      $inc: {
        warns: 1
      }
    })

    let warnEmd = new Discord.MessageEmbed()
	.setColor(`#2f3136`)
	.setTitle("Предупреждения")
	.setDescription(`${mUser} получил предупреждение **#${warnNum+1}**\n\n**Выдал: ${rUser}**`)

	message.channel.send(warnEmd);

  }
  }






  } catch (err) {
	if(err.name === "ReferenceError")
		console.log("У вас ошибка")
	console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
}
}

module.exports.help = {
	name: "warn",
	alias: "pred"
};
