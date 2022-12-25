const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const mongoose = require('mongoose')
const Main = require('../data/schema.js')



module.exports.run = async (client,message,args) => {
	try{
    let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let rUser = message.author;

    //Embeds
    let permErr = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, похоже, что у вас нет прав для использования этой команды`)

    let userIsHigher = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему наказание.`)

    let sameErr = new Discord.MessageEmbed()
    .setColor(`#2f3136`)
    .setTitle("Отказано")
    .setDescription(`${rUser}, вы не можете выдать наказание сомому себе`)


    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(permErr)
    if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
    if(mUser.id === rUser.id) return message.channel.send(sameErr)

    let reason = args.slice(1).join(" ");


    let rbEmd = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Успешно заблокирован")
  	.setDescription(`**${rUser}, ${mUser} получил блокировку на сервере**\n\n**Причина: **` + "`" + reason + "`**")


    mUser.ban({ reason: `${reason}` })
    message.channel.send(rbEmd)

  } catch (err) {
  if(err.name === "ReferenceError")
    console.log("У вас ошибка")
  console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
}
}

module.exports.help = {
  name: "ban"
};
