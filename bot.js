const Discord = require('discord.js');
const moment = require("moment");
const fs = require('fs');
const util = require('util');
const Canvas = require('canvas');
const jimp = require('jimp');
const client = new Discord.Client();
const prefix = '%'
const ms = require("ms")
const bot = client
const botconfig = require("./botconfig.json")
const toTime = require("to-time")
const invites = {};
const db = require('quick.db')



client.on('ready', () => {
  console.log(`Welcome To Me ${client.user.tag}!`);
  console.log('----------------');
  client.user.setGame(`Night City|%help`, "https://www.twitch.tv/peery13");
  client.user.setStatus("dnd");
});
// منع إرسال التوكن
///////////////////////////////
client.on("message", message => {
  if (message.content.match(/([A-Z0-9]|-|_){24}\.([A-Z0-9]|-|_){6}\.([A-Z0-9]|-|_){27}|mfa\.([A-Z0-9]|-|_){84}/gi)) {
      if(!message.guild.members.get(client.user.id).hasPermission('MANAGE_MESSAGES')) return message.channel.send('**I need Permission \`MANAGE_MESSAGE\`To delete Tokens**')
      message.delete();
      message.reply(`مخك وين ترسل التوكن لحول`);
      return;
  }
  if(message.channel.type === "dm"){
  if (message.content.match(/([A-Z0-9]|-|_){24}\.([A-Z0-9]|-|_){6}\.([A-Z0-9]|-|_){27}|mfa\.([A-Z0-9]|-|_){84}/gi)) {

      message.reply(`مخك وين ترسل التوكن لحول`);
      return;
  }
}
});
//////////////////////////////
//تجارب الأكواد
const cmd = require("node-cmd")
client.on("message", async message => {
  if(message.author.id !== "476577762396864512") return;
  if(message.content === prefix + "restart") {
    await cmd.run("refresh")
    await message.channel.send("Done,")
  }
})

//end...
//////////////////////////////

client.on('message', message => {//new msg event
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + 'rainbow')) {//to create the rainbow role
    let role = message.guild.roles.find('name', 'Rainbow')
    if (role) return message.channel.send(`This Step Already Completed !`)//if the role already created return with this msg
    //start of create role
    if (!role) {
    rainbow = message.guild.createRole({
        name: "Rainbow",//the role will create name
        color: "#000000",//the default color
        permissions: []//the permissions
        //end of create role
      })

    }
    message.channel.send('Done The Rainbow Role Setup Has Been Completed')//if the step completed
  }
})

client.on('ready', () => {//new ready event
  setInterval(function () {
    client.guilds.forEach(g => {
      var role = g.roles.find('name', 'Rainbow');//rainbow role name
      if (role) {
        role.edit({ color: "RANDOM" });
      };
    });
  }, 5000);//the rainbow time
})
//Rainbow code
var roles = {};
client.on('guildMemberRemove', member => {
  roles[member.id] = { roles: member.roles.array() };
});
client.on('guildMemberAdd', member => {
  if (!roles[member.user.id]) return;
  console.log(roles[member.user.id].roles.length);
  for (let i = 0; i < roles[member.user.id].roles.length; i++) {
    member.addRole(roles[member.user.id].roles);
    roles[member.user.id].roles.shift();
  }
});

////////////////////////////////////////////////////




client.on('message', message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + 'clear')) { //Codes
    if (!message.channel.guild) return message.reply('⛔ | This Command For Servers Only!');
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('⛔ | You dont have **MANAGE_MESSAGES** Permission!');
    if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.channel.send('⛔ | I dont have **MANAGE_MESSAGES** Permission!');
    let args = message.content.split(" ").slice(1)
    let messagecount = parseInt(args);
    if (args > 99) return message.reply("**🛑 || يجب ان يكون عدد المسح أقل من 100 .**").then(messages => messages.delete(5000))
    if (!messagecount) args = '100';
    message.channel.fetchMessages({ limit: messagecount + 1 }).then(messages => message.channel.bulkDelete(messages));
    message.channel.send(`\`${args}\` : __عدد الرسائل التي تم مسحها __ `).then(messages => messages.delete(5000));
  }
}); //Julian


//clear chat 

client.on('message', msg => {
  var prefix = "%";
  if (msg.author.bot) return;
  if (msg.content.startsWith(prefix + "owner")) {
    let args = msg.content.split(" ").slice(1);
    if (!args[0]) {
      msg.channel.send("** %owner <message> **")
      return;
    }
    var rebel = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`
تم إرسآل لك رسآلة من السيرفر الخاص بك
${msg.guild.name}
الرسآلة
${args}
        `)
      .setFooter(` بوآسطة ${msg.author.username}#${msg.author.discriminator}`)
    msg.guild.owner.send(rebel);
    msg.channel.send("**تم إرسآل الرسآلة إلى أونر السيرفر**")
  }
});
//owner message code

client.on('message', message => { 
    const mm = message.mentions.members.first() || message.member;
    if(message.content.startsWith(prefix + "avatar")){
        const embed = new Discord.RichEmbed()
        .setAuthor(mm.user.tag, mm.user.avatarURL)
        .setTitle("Avatar Link")
        .setURL(mm.user.avatarURL)
        .setImage(mm.user.avatarURL)
        .setFooter(`Requested By : ${message.author.tag}`, message.author.avatarURL)
        message.channel.send(embed);
    }
});
//avatar
client.on('error', err => {console.log(err)});
const members = JSON.parse(fs.readFileSync("./members.json")) || {};
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.forEach(g=> !members[g.id] ? members[g.id] = {} : null)
});

client.on("guildMemberRemove", member=>{
  let roles = [];
  member.roles.forEach(r=> roles.push(r.id));
  members[member.guild.id][member.id] = roles;
  saveChanges();
});
client.on("guildMemberAdd", member=> {
  if(members[member.guild.id][member.id] !== undefined){
    member.addRoles(members[member.guild.id][member.id], "Returning roles after leaving");
    members[member.guild.id][member.id] = [];
  };
  saveChanges();
});
function saveChanges(){
  fs.writeFileSync("./members.json", JSON.stringify(members, null, 4));
};
//regive rol after left 

client.on("message", message => {
  if (message.content === (prefix + "help")) {
    const embed = new Discord.RichEmbed()
      .setColor("#580e6b")
      .setThumbnail(message.author.avatarURL)
      .setDescription(`**
         ======={MEMBER COMMAD}=======
         %avatar : الصورة الشخصية
         %id : الايدي حقك
         %owner : رسالة لصاحب السيرفر
         %server : معلومات عن السيرفر
         %تقديم : \n التقديم للإدارة
         %invites : كم شخص دخلت للسيرفر
         %ping : البنق
         %new : تفتح تكت
         %close : تقفل التكت
         %help : عرض هذه الرسالة
         %report : التبليغ عن مخالفة او أي شيء
        ======={ADMIN COMMAD}=======
         %clear : مسح الشات
         %cl : تقفل الشات
         %op : تفتح الشات
         -----------------------------
         %روم1 :\n عمل روم التقديمات
         %روم2 :\n عمل روم القبول و الرفض
         %قبول :\n تقبل التقديم
         %رفض :\n ترفض التقديم
         %mute : تعطي شخص ميوت
         %unmute : فك الميوت من شخص
         %kick : تطرد شخص من السيرفر
         %ban : تبند شخص
         %bans : الناس المبندبن من السيرفر
         ======={INFO}=======
         لو حسابك أقل من أسبوع راح يتبند
        
       **  `)
    message.author.sendEmbed(embed)

  }
});
client.on('message', message => {
  if (message.content === (prefix + "help")) {
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setColor("#8650a7")
      .addField("Done", " تــــم ارســالك في الخــاص")
    message.channel.sendEmbed(embed);
  }
});
//help code



client.on('message', message => {
  if (message.content === "%ping") {
    const embed = new Discord.RichEmbed()

      .setColor("RANDOM")
      .addField('``سرعة أتصال الــبوت`` ', `${Date.now() - message.createdTimestamp}` + ' ms`') //OUAIL
      .setFooter(` Bot By : OUAIL#0090
.`) //OUAIL

    message.channel.sendEmbed(embed);
  } //OUAIL
}); //OUAIL
//ping code

client.on('message', message => {
  if (message.author.bot) return;
  if (message.isMentioned(client.user)) {
    message.reply(" **I am ready!**");
  }
});
//كود الرد
client.on('message', message => {

  if (message.content === "%cl") {
    if (!message.channel.guild) return message.reply(' This command only for servers');

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' ليس لديك صلاحيات');
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false

    }).then(() => {
      message.reply("تم تقفيل الشات :white_check_mark: ")
    });
  }

  if (message.content === "%op") {
    if (!message.channel.guild) return message.reply(' This command only for servers');

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('ليس لديك صلاحيات');
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: true

    }).then(() => {
      message.reply("تم فتح الشات:white_check_mark:")
    });
  }


});
//Opne & close chat
client.on('message', function (msg) {
  if (msg.content.startsWith(prefix + 'server')) {
    let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(msg.guild.iconURL)
      .setTitle(`Showing Details Of  **${msg.guild.name}*`)
      .addField(':globe_with_meridians:** نوع السيرفر**', `[** __${msg.guild.region}__ **]`, true)
      .addField(':medal:** __الرتب__**', `[** __${msg.guild.roles.size}__ **]`, true)
      .addField(':red_circle:**__ عدد الاعضاء__**', `[** __${msg.guild.memberCount}__ **]`, true)
      .addField(':large_blue_circle:**__ عدد الاعضاء الاونلاين__**', `[** __${msg.guild.members.filter(m => m.presence.status == 'online').size}__ **]`, true)
      .addField(':pencil:**__ الرومات الكتابية__**', `[** __${msg.guild.channels.filter(m => m.type === 'text').size}__** ]`, true)
      .addField(':microphone:**__ رومات الصوت__**', `[** __${msg.guild.channels.filter(m => m.type === 'voice').size}__ **]`, true)
      .addField(':crown:**__ الأونـر__**', `**${msg.guild.owner}**`, true)
      .addField(':id:**__ ايدي السيرفر__**', `**${msg.guild.id}**`, true)
      .addField(':date:**__ تم عمل السيرفر في__**', msg.guild.createdAt.toLocaleString())
    msg.channel.send({ embed: embed });
  }
});
//server info


client.on("message", message => {
  if (message.content.startsWith("%تقديم")) {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    let channel = message.guild.channels.find("name", "التقديمات")
    if (channel) {
      message.channel.send(message.member + ', **:timer:**').then((m) => {
        m.edit(message.member + ', **اسمك **')
        m.channel.awaitMessages(m1 => m1.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m1) => {
          m1 = m1.first();
          var name = m1.content;
          m1.delete();
          m.edit(message.member + ', **:timer:**').then((m) => {
            m.edit(message.member + ', **عندك كام سنة **')
            setTimeout(() => {
              m.delete()
            }, 10000);
            m.channel.awaitMessages(m2 => m2.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m2) => {
              m2 = m2.first();
              var age = m2.content;
              m2.delete()
              message.channel.send(message.member + ', **:timer:**').then((m) => {
                m.edit(message.member + ', **هل ستتفاعل فى الرومات الصوتيه و الكتابية ؟ 🎙**')
                setTimeout(() => {
                  m.delete()
                }, 10000);
                m.channel.awaitMessages(m1 => m1.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m3) => {
                  m3 = m3.first();
                  var ask = m3.content;
                  m3.delete();
                  message.channel.send(message.member + ', **:timer:**').then((m) => {
                    m.edit(message.member + ', **هل ستحترم القوانين ؟ 📑**')
                    setTimeout(() => {
                      m.delete()
                    }, 10000);
                    m.channel.awaitMessages(m1 => m1.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m4) => {
                      m4 = m4.first();
                      var ask2 = m4.content;
                      m4.delete();
                      message.channel.send(message.member + ', **:timer:**').then((m) => {
                        m.edit(message.member + ', **لماذا يجب علينا ان نقبلك ؟ اعطنا سبباً وجيهاً **')
                        m.channel.awaitMessages(m1 => m1.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m5) => {
                          m5 = m5.first();
                          var ask3 = m5.content;
                          m5.delete();
                          message.channel.send(message.member + ', **:timer:**').then((m) => {
                            m.edit(message.member + ', **ماهو مستواك في الدسكورد خبرتك في الإدارة و كم لك في الدسكورد؟**')
                            m.channel.awaitMessages(m1 => m1.author == message.author, { maxMatches: 1, time: 60 * 1000 }).then((m6) => {
                              m6 = m6.first();
                              var ask4 = m6.content;
                              m6.delete();
                              m.edit(message.member + ', **....جارى جمع البيانات**').then((mtime) => {
                                setTimeout(() => {
                                  let embed = new Discord.RichEmbed()
                                    .setColor('RANDOM')
                                    .setTitle(`**تقديم ادارة** [__**${message.guild.name}**__]`)
                                    .addField('**`الاسم`**', `${name}`, true)
                                    .addField('**`العمر`**', `${age}`, true)
                                    .addField('**`هل سيتفاعل ؟`**', `${ask}`)
                                    .addField('**`هل سيحترم القوانين ؟`**', `${ask2}`)
                                    .addField('**`لماذا يجب علينا قبوله ؟`**', `${ask3}`)
                                    .addField('**`مستواه في الدسكورد؟`**', `${ask4}`)
                                    .setFooter(`<@${message.author.id}> `, 'https://images-ext-2.discordapp.net/external/JpyzxW2wMRG2874gSTdNTpC_q9AHl8x8V4SMmtRtlVk/https/orcid.org/sites/default/files/files/ID_symbol_B-W_128x128.gif')
                                  channel.send(embed)
                                }, 2500);
                                setTimeout(() => {
                                  mtime.delete()
                                }, 3000);

                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }
  }
});
client.on('message', message => {
  if (message.content.startsWith("%روم1")) {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("**تحتاج الى `ADMINISTRATOR`**");
    message.guild.createChannel("التقديمات", "text").then(c => {
      c.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false

      })
    })
    message.channel.send("** تم انشاء روم التقديمات بنجاح**")
  }
})
client.on('message', async message => {
  let mention = message.mentions.members.first();
  let role = message.content.split(" ").slice(2).join(" ");
  let mySupport = message.guild.roles.find('name', role);
  if (message.content.startsWith("%قبول")) {
    let acRoom = message.guild.channels.find('name', 'القبول-الرفض');
    if (!acRoom) return message.reply("%روم2 \n من فضلك انشاء روم **القبول-الرفض** او اكتب الامر");
    if (acRoom) {
      if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
      if (!mention) return message.reply('منشن شخص');
      if (!role) return message.reply('ادخل اسم رتبة');
      if (!mySupport) return message.reply('هذه الرتبة غير موجودة');
      if (mention.roles.has(mySupport)) return message.reply('هذا الشخص معه الرتبة مسبقا');

      mention.addRole(mySupport).then(() => {
        acRoom.send(`**[ ${mySupport} ] واعطائك رتبة ${mention} تم بنجاح قبولك**`);
      });
    }
  }
});
client.on('message', async message => {
  let mention = message.mentions.members.first();
  if (message.content.startsWith("%رفض")) {
    if (!message.channel.guild) return;
    let acRoom = message.guild.channels.find('name', 'القبول-الرفض');
    if (!acRoom) return message.reply(" %روم2 \n من فضلك انشاء روم **القبول-الرفض** او اكتب الامر");
    if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
    if (!mention) return message.reply("منشن شخص");

    acRoom.send(`**${mention} تم رفضك للاسف**`)
  }
});
client.on('message', message => {
  if (message.content.startsWith("%روم2")) {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("**تحتاج الى `MANAGE_CHANNELS`**");
    message.guild.createChannel("القبول-الرفض", "text").then(c => {
      c.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false

      })
    })
    message.channel.send("** تم انشاء روم القبول والرفض بنجاح**")
  }
})
//التقديم للإدارة

 let antibots = JSON.parse(fs.readFileSync('./antibots.json' , 'utf8'));//require antihack.json file

client.on('message', message => {
    if(message.content.startsWith(prefix + "antibots on")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('**Sorry But You Dont Have Permission** `ADMINISTRATOR`' );
antibots[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`**✅ The AntiBots Is __𝐎𝐍__ !**`)
          fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
 
 
 
client.on('message', message => {
    if(message.content.startsWith(prefix + "antibots off")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('**Sorry But You Dont Have Permission** `ADMINISTRATOR`' );
antibots[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`**⛔ The AntiBots Is __𝐎𝐅𝐅__ !**`)
          fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
 
client.on("guildMemberAdd", member => {
  if(!antibots[member.guild.id]) antibots[member.guild.id] = {
onoff: 'Off'
}
  if(antibots[member.guild.id].onoff === 'Off') return;
if(member.user.bot) return member.kick()
})
 
fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
if (err) console.error(err)
.catch(err => {
console.error(err);
});
 
})

//anti bots

//CopyRights ToxicCodes 04/28/2019 🌠☭ 🕅ØŇŞŦ€Ř ҜƗŇᎶ 👺❦❧#8722
client.on("message", message =>{
    let command = message.content.split(" ")[0].slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if(command === "welcome") {
        let welcomechann = args.join(" ");
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You must have the **`ADMINISTRATOR`** permission!")
        if(!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("I must have the **`ADMINISTRATOR`** permissions!")
        if(!message.member.guild.channels.find(x => x.name === welcomechann)) return message.reply("Usage: **`(channel name)`**");
        message.reply("Successfully applied welcome to **`" + welcomechann + "`**")
        WelcomeChannel[message.guild.id] = {
            guild: message.guild.name,
            channel: welcomechann
        }
        fs.writeFile("./welcomer.json", JSON.stringify(WelcomeChannel, null, 4), err => {
            if(err) throw err;
    });
  }
  });
  client.on('guildMemberAdd', async function (Monster) {
    const WelcomeChannelMK =  Monster.guild.channels.find(mk => mk.name === WelcomeChannel[Monster.guild.id].channel);
    if(!WelcomeChannelMK) return;
    Monster.guild.fetchInvites().then(guildInvites => {
        const uses = guildInvites.find(codes => codes.uses);
        const UserInvited = client.users.get(uses.inviter.id);
              let itsMe = client.emojis.find(copy => copy.name === "diamondmk");
              var EmbedWelcome = new Discord.RichEmbed()
              .setDescription(`${itsMe} __**New Member Joined**__
              ➤ Welcome <@${Monster.user.id}> To **${Monster.guild.name}**
              ➤ You Are Nr: **${Monster.guild.memberCount}**
              ➤ Invited By: <@${UserInvited.id}>`)
              .setColor('#383c41');
    const MKPIC = ['./imgs/w1.png'];
    let Image = Canvas.Image,
       CodesMK = new Canvas(400, 200),
       ctx = CodesMK.getContext('2d');
   fs.readFile(MKPIC, function (err, Background) {
       if (err) return console.log(err);
       let BG = Canvas.Image;
       let ground = new Image;
       ground.src = Background;
       ctx.drawImage(ground, 0, 0, 400, 200);
           let url = Monster.user.displayAvatarURL.endsWith(".webp") ? Monster.user.displayAvatarURL.slice(100) + ".png" : Monster.user.displayAvatarURL;
           jimp.read(url, (err, ava) => {
               if (err) return console.log(err);
               ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
                   if (err) return console.log(err);
                    ctx.font = "bold 16px Arial";
                    ctx.fontSize = '20px';
                    ctx.fillStyle = "#f1f1f1";
                    ctx.textAlign = "center";
                    ctx.fillText(Monster.guild.name, 254, 67);
                    ctx.font = "bold 16px Arial";
                    ctx.fontSize = '20px';
                    ctx.fillStyle = "#f1f1f1";
                    ctx.textAlign = "center";
                    ctx.fillText(Monster.guild.memberCount, 338, 161);
                    ctx.font = "bold 16px Arial";
                    ctx.fontSize = '20px';
                    ctx.fillStyle = "#f1f1f1";
                    ctx.textAlign = "center";
                    ctx.fillText(Monster.user.username, 77, 183);
                    let Avatar = Canvas.Image;
                    let ava = new Avatar;
                    ava.src = buf;
                    ctx.beginPath();
                    ctx.arc(77, 101, 62, 0, Math.PI*2);
                    ctx.stroke();
                    ctx.clip();
                    ctx.drawImage(ava, 13, 38, 128, 126);
            WelcomeChannelMK.send({embed: EmbedWelcome, file: CodesMK.toBuffer()});
                })
            })
        });
    })
  });

//welcome
let antijoin = JSON.parse(fs.readFileSync('./antijoin.json' , 'utf8'));
/*يحتاج تعرف بكج const fs = require('fs')
طبعا لو مو معرف البكج ^
+ تثبت البكج npm i fs
*/
client.on('message', message => {
    if(message.content.startsWith(prefix + "antijoin on")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
antijoin[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`**✅ The AntiJoin Is __𝐎𝐍__ !**`)
          fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
            if (err) return console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
 
 
 
client.on('message', message => {
    if(message.content.startsWith(prefix + "antijoin off")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
antijoin[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`**⛔ The AntiJoin Is __𝐎𝐅𝐅__ !**`)
          fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
            if (err) return console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
         client.on('message', message => {
          if (!message.channel.guild) return;
 
 
   if(message.content.startsWith(prefix + "setJoin")) {
          let time = message.content.split(" ").slice(1).join(" ");
       if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
       if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
if (!time) return message.channel.send('Please Type The Account Created Time [Days]');
let embed = new Discord.RichEmbed()
.setTitle('**Done The AntiJoin Code Has Been Setup**')
.addField('Account Create Time:', `${time}.`)
.addField('Requested By:', `${message.author}`)
.setThumbnail(message.author.avatarURL)
.setFooter(`${client.user.username}`)
message.channel.sendEmbed(embed)
antijoin[message.guild.id] = {
created: time,
onoff: 'On',
}
fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
if (err) console.error(err)
})
   }})
 
client.on("guildMemberAdd", async member => {
  if(!antijoin[member.guild.id]) antijoin[member.guild.id] = {
    onoff: 'Off'
  }
  if(antijoin[member.guild.id].onoff === 'Off') return;
  if(!member.user.bot) return;
    let accounttime = `${antijoin[member.guild.id].created}`
    let moment2 = require('moment-duration-format'),
        moment = require("moment"),
        date = moment.duration(new Date() - member.user.createdAt).format("d");
 
    if(date < accounttime) {
      member.ban(`Member account age is lower than ${antijoin[member.guild.id].created} days.`)
    }
  });
//منع الوهمي



client.on('message', message => {
  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "ban") {
               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.reply("**You Don't Have ` BAN_MEMBERS ` Permission**");
  if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply("**I Don't Have ` BAN_MEMBERS ` Permission**");
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  /*let b5bzlog = client.channels.find("name", "5bz-log");

  if(!b5bzlog) return message.reply("I've detected that this server doesn't have a 5bz-log text channel.");*/
  if (message.mentions.users.size < 1) return message.reply("**منشن شخص**");
  if(!reason) return message.reply ("**اكتب سبب الطرد**");
  if (!message.guild.member(user)
  .bannable) return message.reply("**لايمكنني طرد شخص اعلى من رتبتي يرجه اعطاء البوت رتبه عالي**");

  message.guild.member(user).ban(7, user);

  const banembed = new Discord.RichEmbed()
  .setAuthor(`BANNED!`, user.displayAvatarURL)
  .setColor("RANDOM")
  .setTimestamp()
  .addField("**User:**",  '**[ ' + `${user.tag}` + ' ]**')
  .addField("**By:**", '**[ ' + `${message.author.tag}` + ' ]**')
  .addField("**Reason:**", '**[ ' + `${reason}` + ' ]**')
  message.channel.send({
    embed : banembed
  })
}
});
//ban
client.on('message', message => {
  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "kick") {
               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.reply("**You Don't Have ` KICK_MEMBERS ` Permission**");
  if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply("**I Don't Have ` KICK_MEMBERS ` Permission**");
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  /*let b5bzlog = client.channels.find("name", "5bz-log");

  if(!b5bzlog) return message.reply("I've detected that this server doesn't have a 5bz-log text channel.");*/
  if (message.mentions.users.size < 1) return message.reply("**منشن شخص**");
  if(!reason) return message.reply ("**اكتب سبب الطرد**");
  if (!message.guild.member(user)
  .kickable) return message.reply("**لايمكنني طرد شخص اعلى من رتبتي يرجه اعطاء البوت رتبه عالي**");

  message.guild.member(user).kick();

  const kickembed = new Discord.RichEmbed()
  .setAuthor(`KICKED!`, user.displayAvatarURL)
  .setColor("RANDOM")
  .setTimestamp()
  .addField("**User:**",  '**[ ' + `${user.tag}` + ' ]**')
  .addField("**By:**", '**[ ' + `${message.author.tag}` + ' ]**')
  .addField("**Reason:**", '**[ ' + `${reason}` + ' ]**')
  message.channel.send({
    embed : kickembed
  })
}
});

//Kick CODE

bot.on('guildMemberAdd', m => {
  let enabled = db.get(`autorole.${m.guild.id}.enabled`)
  if(enabled === 'off') return
  let roleID = db.get(`autorole.${m.guild.id}.role`)
  if(roleID === null) return
  let role = m.guild.roles.get(roleID)
  if(role === undefined) return
  m.addRole(role,'auto role')
})
bot.on('message', msg => {
  let params = msg.content.slice(prefix.length).trim().split(/ +/g);
  if(msg.author.bot) return;
  if(msg.content.startsWith(prefix + "autorole")) {
    if(params[1].toLowerCase() === 'set') {
      if(!params[2]) return msg.channel.send(`**اكتب اسم الرتبة او منشنها**`)
    let role = msg.mentions.roles.first() || msg.guild.roles.find(r => r.name.toLowerCase().startsWith(params[2].toLowerCase()))
    if(role === undefined) return msg.channel.send(`**لم استطع العثور على هذه الرتبة**`)
    db.set(`autorole.${msg.guild.id}.role`, role.id)
    msg.channel.send(`تم اعداد الاوتو رول للرتبة ${role}`)
  }
    if(params[1].toLowerCase() === 'off') {
      let enabled = db.get(`autorole.${msg.guild.id}.enabled`)
      if(enabled === 'off') return msg.channel.send(`**الاوتو رول موقفة بالفعل**`)
      db.set(`autorole.${msg.guild.id}.enabled`, 'off')
      msg.channel.send(`**تم ايقاف الاوتو رول بنجاح**`)
    }
    if(params[1].toLowerCase() === 'on') {
      let enabled = db.get(`autorole.${msg.guild.id}.enabled`)
      if(enabled === 'on') return msg.channel.send(`**الاوتو رول مفعلة بالفعل**`)
 
      db.set(`autorole.${msg.guild.id}.enabled`, 'on')
      msg.channel.send(`**تم تشغيل الاوتو رول بنجاح**`)
    }
  }
})

//autu role


client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "bans") { // الامر
    message.delete(5000)
    if (!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.reply("Error : \` I Dont Have ADMINISTRATOR Permission\`").then(message => message.delete(5000));
    if (!message.member.hasPermission('ADMINISTRATOR')) return;
    if (!message.channel.guild) return;
    message.guild.fetchBans()
      .then(bans => message.channel.send(`\`${bans.size}\` ***: عدد الاشخاص المبندين من السيرفر ***`)).then(message => message.delete(5000))

      .catch(console.error);
  }
});

client.on('message', message => {
  if (message.content.includes('discord.gg', '.com', '.net', '.tv', '.io', 'https://', 'http://', 'youtube.com')) {
    if (!message.channel.guild) return message.reply('** advertising me on DM ? 🤔   **');
    if (!message.member.hasPermissions(['ADMINISTRATOR'])) {
      message.delete()
      return message.reply(`** ممنوع نشر الروابط :angry: ! **`)
    }
  }
});

//مسح الروابط
client.on('message', function (message) {
  if (message.content.startsWith(prefix + "report")) {
    let messageArgs = message.content.split(" ").slice(1).join(" ");
    let messageReason = message.content.split(" ").slice(2).join(" ");
    if (!messageReason) return message.reply("**# Specify a reason!**");
    let mUser = message.mentions.users.first();
    if (!mUser) return message.channel.send("Couldn't find user.");
    let Rembed = new Discord.RichEmbed()
      .setTitle("`New Report!`")
      .setThumbnail(message.author.avatarURL)
      .addField("**# - Reported User:**", mUser, true)
      .addField("**# - Reported User ID:**", mUser.id, true)
      .addField("**# - Reason:**", messageReason, true)
      .addField("**# - Channel:**", message.channel, true)
      .addField("**# - Time:**", message.createdAt, true)
      .addField("**# - By:**", message.author.tag, true)
      .setFooter("**لو ان الابلاغ فيه مزح راح يتعرض صاحب الابلاغ لقوبات**")
    message.channel.send(Rembed)
    message.channel.send("**متأكد أنك تبي ترسل البلاغ...؟**").then(msg => {
      msg.react("✅")
      msg.react("❌")
        .then(() => msg.react('❌'))
        .then(() => msg.react('✅'))
      let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
      let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

      let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
      let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
      reaction1.on("collect", r => {
        let c = message.guild.channels.find(r => r.name === "البلاغات");
        if (!c) return message.reply("Channel not found");
        c.send(Rembed)
        message.reply("**# - Done! 🎇**");
      })
      reaction2.on("collect", r => {
        message.reply("**# - Canceled!**");
      })
    })
  }
});
//report
client.on('message', message => {
  var prefix = "%"
  var args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + 'id')) {
    var year = message.author.createdAt.getFullYear()
    var month = message.author.createdAt.getMonth()
    var day = message.author.createdAt.getDate()
    var men = message.mentions.users.first();
    let args = message.content.split(' ').slice(1).join(' ');
    if (args == '') {
      var z = message.author;
    } else {
      var z = message.mentions.users.first();
    }

    let d = z.createdAt;
    let n = d.toLocaleString();
    let x;
    let y;

    if (z.presence.game !== null) {
      y = `${z.presence.game.name}`;
    } else {
      y = "No Playing... |💤.";
    }
    if (z.bot) {
      var w = 'بوت';
    } else {
      var w = 'عضو';
    }
    let embed = new Discord.RichEmbed()
      .setColor("#502faf")
      .addField('🔱| اسمك:', `**<@` + `${z.id}` + `>**`, true)
      .addField('🛡| ايدي:', "**" + `${z.id}` + "**", true)
      .addField('♨| Playing:', '**' + y + '**', true)
      .addField('🤖| نوع حسابك:', "**" + w + "**", true)
      .addField('📛| الكود حق حسابك:', "**#" + `${z.discriminator}**`, true)
      .addField('**التاريح الذي انشئ فيه حسابك | 📆 **: ', year + "-" + month + "-" + day)
      .addField("**تاريخ دخولك للسيرفر| ⌚   :**", message.member.joinedAt.toLocaleString())

      .addField('**⌚ | تاريخ انشاء حسابك الكامل:**', message.author.createdAt.toLocaleString())
      .addField("**اخر رسالة لك | 💬  :**", message.author.lastMessage)

      .setThumbnail(`${z.avatarURL}`)
      .setFooter(message.author.username, message.author.avatarURL)

    message.channel.send({ embed });
    if (!message) return message.reply('**ضع المينشان بشكل صحيح  ❌ **').catch(console.error);

  }

});
//id
client.on('message', message => {
  if (message.content.startsWith(prefix + "invites")) {
    message.guild.fetchInvites().then(invs => {
      let user = message.mentions.users.first() || message.author
      let personalInvites = invs.filter(i => i.inviter.id === user.id);
      let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
      let mmmmEmbed = new Discord.RichEmbed()
        .setAuthor(client.user.username)
        .setThumbnail(message.author.avatarURL)
        .addField(` لقد قمت بدعوة :`, ` ${inviteCount} `)
        .setFooter(`- Requested By: ${message.author.tag}`);
      message.channel.send(mmmmEmbed)
    });
  }
});
//invites
client.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
    if (message.guild.channels.exists("name", "ticket" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
    message.guild.createChannel(`ticket${message.author.id}`, "text").then(c => {
      let role = message.guild.roles.find("name", "Support Team");
      let role2 = message.guild.roles.find("name", "@everyone");
      c.overwritePermissions(role, {
        SEND_MESSAGES: true,
        READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
        SEND_MESSAGES: false,
        READ_MESSAGES: false
      });
      c.overwritePermissions(message.author, {
        SEND_MESSAGES: true,
        READ_MESSAGES: true
      });
      message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
      const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `Please try explain why you opened this ticket with as much detail as possible. Our **Support Team** will be here soon to help.`)
        .setTimestamp();
      c.send({ embed: embed });
    }).catch(console.error);
  }
  if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

    message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`%confirm\`. This will time out in 10 seconds and be cancelled.`)
      .then((m) => {
        message.channel.awaitMessages(response => response.content === '%confirm', {
          max: 1,
          time: 10000,
          errors: ['time'],
        })
          .then((collected) => {
            message.channel.delete();
          })
          .catch(() => {
            m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
            }, 3000);
          });
      });
  }

});

//teckit
////////////////////////
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://citybotsolo.glitch.me/`);
}, 280000);
/////////////////////////////////



/* backup code by IiKaReeeM#0001
* copy right codes
*/
// ذا كود الباك اب
bot.on('message', msg => {
  if (!msg.guild.owner.id.includes(msg.author.id)) return;
  if(msg.author.bot) return
  if(msg.content.startsWith(prefix + 'backup')) {
    db.set(`backup.${msg.author.id}.channels`, [])
    db.set(`backup.${msg.author.id}.roles`, [])
    db.set(`backup.${msg.author.id}.categories`, [])
    let channels = msg.guild.channels.filter(c => c.type === 'text')
    let categories = msg.guild.channels.filter(c => c.type === 'category')
    channels.forEach(c => {
      db.push(`backup.${msg.author.id}.channels`, {cn: c.name, ccn: c.parent.name})
 
    })
    categories.forEach(c => {
      db.push(`backup.${msg.author.id}.categories`, c.name)
 
    })
 
    msg.guild.roles.forEach(r => {
      if(r.name === '@everyone') return
      db.push(`backup.${msg.author.id}.roles`, {rn: r.name, rc: r.color, rp: r.permissions})
    })
 
    msg.channel.send(`**Done backup this server**`)
 
  }
})
 
bot.on('ready', () => {
  console.log(`backup code by IiKaReeeM#0001`)
})
 
 
// وذا كود اللود load
bot.on('message', msg => {
  if (!msg.guild.owner.id.includes(msg.author.id)) return;
  if(msg.author.bot) return
  if(msg.content.startsWith(prefix + 'load')) {
   let channels = db.get(`backup.${msg.author.id}.channels`)
   let roles = db.get(`backup.${msg.author.id}.roles`)
   let categories = db.get(`backup.${msg.author.id}.categories`)
   if(channels === null && roles === null && categories === null) return msg.channel.send(`**You don't have a backup to be uploaded here.  :/**`)
  msg.channel.send(`**loading...**`).then(m => {
    setTimeout(() => {
                   m.edit(`**done load!**`)
                 },6000);
               })
 
if(categories != null) {
  for(let j = 0; j < categories.length; j++) {
    msg.guild.createChannel(categories[j], "category")
  }
}
if(roles != null) {
for(let r = 0; r < roles.length; r++) {
msg.guild.createRole({
  name: roles[r].rn,
  color: roles[r].rc,
  permissions: roles[r].rp
})
}
}
if(channels != null) {
 
  for(let i = 0; i < channels.length; i++) {
    msg.guild.createChannel(channels[i].cn, "text").then(channel => {
      channel.setParent(msg.guild.channels.find(c => c.name == channels[i].ccn))
    })
}
}
 }
})
///////////////////////////////////////////
bot.mutes = require("./mutes.json")
client.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
    bot.setInterval(() => {
        for (let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let member = bot.mutes[i].muted
            let mutereason = "Mute time is over"
            if (Date.now() > time) {
                bot.guilds.get(bot.mutes[i].guildid).members.get(`${member}`).removeRole(bot.mutes[i].roleid, mutereason)
                delete bot.mutes[i];
                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), (err) => {
                    if (err) throw err;
                    console.log(`${bot.users.get(member).username} has been unmuted`)
                })
            }
        }
    }, 5000)
})
bot.on("guildMemberAdd", async (member) => {
    for (let i in bot.mutes) {
        let data = bot.mutes[i];
        if (data === undefined) return;
        if (data.guildid !== member.guild.id) return;
        let mutereason = "ليه تهرب ي بابا امواح م رح أسيبك"
        let guildID = bot.mutes[i].guildid;
        if (member.id === bot.mutes[i].muted) {
            bot.guilds.get(`${guildID}`).members.get(`${member.id}`).addRole(`${bot.mutes[i].roleid}`, mutereason)
        } else {
            return;
        }
    }
})
client.on('message', async message => {
    let prefix = "%"
    let messageArray = message.content.split(' ')
    let args = messageArray.slice(1)
    let cmd = messageArray[0]
    if (cmd === `%mute`) {
        message.delete();
        // هنا يمديك تحط الرولات الي يمديها تستعمل الكوماند
        if (!message.member.roles.some(r => ['Founder', 'The One', 'Owner', 'Co-Owner', 'Admin', 'Sr-MOD', 'MOD', 'Helper', 'STAFF'].includes(r.name))) return message.reply('You do not have permissions').then(msg => msg.delete(30000))
        let themuteguy = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!themuteguy) return message.channel.send("**الرجاء وضع المنشن**").then(msg => msg.delete(8000))
        if (themuteguy.id == message.author.id) return message.reply('You cannot mute yourself can you 🌚? ')
        let roleid = message.guild.roles.find(c => c.name === "Muted")
        if (!roleid) return message.reply(`Please use \`${prefix}setup\` first`)
        let mutereason = args.join(" ").slice(25)
        if (!mutereason) return message.reply(`\`Usage: ${prefix}mute mention time reason\``)
        let time = args[1]
        if (ms(time) > 2.592e+9) return message.reply('Must be lower or equal to 30 days') // هنا لو الوقت اكثر من 30 يوم بيقلك م يمديك تسويله ميوت وهذي الجزئية مالها داعي لكن بتساعدك لو تبي تخلي ماكس للوقت
        if (themuteguy.roles.has(roleid.id)) return message.channel.send("This guy already is muted")
        bot.mutes.count++ + 1
        if (isNaN(bot.mutes.count)) bot.mutes.count = 0 + 1;
        bot.mutes[bot.mutes.count] = {
            time: Date.now() + ms(time),
            muted: themuteguy.id,
            roleid: roleid.id,
            guildid: message.guild.id
        }
        await message.guild.member(themuteguy.id).addRole(roleid.id, mutereason)
        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
            if (err) throw err;
            message.reply(`Done <@!${themuteguy.id}> Has been muted!`).then(msg => msg.delete(20000))
            let muteembed = new Discord.RichEmbed()//اللوق
                .setAuthor("Mute log!")
                .setColor("#FFFFFF")
                .setTimestamp()
                .addField("For:", `${themuteguy} \`(${themuteguy.id})\``)
                .addField("By:", `${message.author} \`(${message.author.id})\``)
                .addField("Reason:", mutereason)
                .addField("Time", `${ms(ms(time), { long: true })}`)
            let mutechannel = bot.channels.find(c => c.name === "logs")
            if (!mutechannel) return;
            mutechannel.send(muteembed)
        })
    }
    if (cmd == `%unmute`) {
        if (!message.member.roles.some(r => ['Founder', 'The One', 'Owner', 'Co-Owner', 'Admin', 'Sr-MOD', 'MOD', 'Helper', 'STAFF'].includes(r.name))) return message.reply('You do not have permissions').then(msg => msg.delete(30000))
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!tounmute) return message.reply('**Mention someone to unmute!**')
        let muterole = message.guild.roles.find(c => c.name == 'Muted')
        if (!muterole) {
            aaa = await message.guild.createRole({
                name: "Muted",
                permissions: []
            });
        }
        if(!tounmute.roles.has(muterole.id)) return message.reply('Uhhh he\'s not muted!')
        for(var i in bot.mutes) {
            let data = bot.mutes[i];
            if(data.muted == tounmute.id && data.guild == message.guild.id){
            message.guild.members.get(`${tounmute.id}`).removeRole(message.guild.roles.find(c => c.name == 'Muted'), "Unmute command")
            delete bot.mutes[i];
            }
        }
        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
            message.channel.send('Done')
            if (err) throw err;
        })
    }
    if (cmd == `%setup`) { // الكوماند هذا لو انت سويت كاتقوري جديد وسويت فيه شانلات جديدة مو موجود فيها منع للميوت اكتب الكوماند ذا
        if (!message.member.roles.some(r => ['Founder', 'The One', 'Owner', 'Co-Owner'].includes(r.name))) return message.reply('You do not have permissions').then(msg => msg.delete(30000))
        let role = message.guild.roles.find(c => c.name === "Muted")
        if (!role) {
            muterole = await message.guild.createRole({
                name: "Muted",
                permissions: []
            });
        }
        message.guild.channels.forEach(async (channel) => {
            await channel.overwritePermissions(role.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
        message.channel.send('Done')
    }
})
//mute
client.login("NTIyMjI0NzAwNjAxMDA4MTM0.XXKeOA.DW9fsPhvOaWaN5irOSdljaapeXA");
