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
  	.setDescription(`${rUser}, вы не можете отменить наказание сомому себе`)

  	let userIsHigher = new Discord.MessageEmbed()
  	.setColor(`#2f3136`)
  	.setTitle("Отказано")
  	.setDescription(`${rUser}, данный пользователь выше или на одной роли с Вами. Вы не можете снять с него наказание.`)

    let noUser = new Discord.MessageEmbed()
    .setColor(`#2f3136`)
    .setTitle("Отказано")
    .setDescription(`${rUser}, вы не указали пользователя`)


    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
    if (!mUser || mUser == mUser.user.bot) return message.channel.send(noUser);
    let uid = mUser.id;
    if (uid === rUser.id) return message.channel.send(sameErr);
    if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);


    mainData = await Main.findOne({userID: uid})
    if(!mainData){
      warns = await Main.create({
      userID: uid,
      warns: 0,
    });
    warns.save();
    //msg
    let warnEmd = new Discord.MessageEmbed()
  .setColor(`#2f3136`)
  .setTitle("Предупреждения")
  .setDescription(`${rUser} снял предупреждение **${mUser}**`)

  message.channel.send(warnEmd);
  } else {
    mainData = await Main.updateOne({
      userID: mUser.id
    }, {
      $inc: {
        warns: -1
      }
    })
    //msg
    let warnEmd = new Discord.MessageEmbed()
  .setColor(`#2f3136`)
  .setTitle("Предупреждения")
  .setDescription(`${rUser} снял предупреждение **${mUser}**`)

  message.channel.send(warnEmd);
  }



  } catch (err) {
  if(err.name === "ReferenceError")
    console.log("У вас ошибка")
  console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
}
}

module.exports.help = {
  name: "unwarn"
};
