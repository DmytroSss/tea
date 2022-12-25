const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const mongoose = require('mongoose')
const Main = require('../data/schema.js')



module.exports.run = async (client,message,args) => {
	try{
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply("У тебя нет прав, для использования этой команды")
    if (!args[0]) return message.reply("Укажи количество сообщений, которые надо удалить");

    if (isNaN(args[0])) return message.reply("Ты указал число, которое я не понимаю");
    let amount = args[0]

    if (args[0] > 100) return message.reply('Ты можешь удалить только 100 сообщений за раз')
    await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                message.channel.bulkDelete(messages);
                message.channel.send("Успешно удалено `" + args[0] + "` сообщений")
                    .then(msg => {
                        msg.delete({ timeout: 3000 })
                    })
            });



  } catch (err) {
  if(err.name === "ReferenceError")
    console.log("У вас ошибка")
  console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
  }
  }

  module.exports.help = {
  name: "clear"
  };
