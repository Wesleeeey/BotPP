const { Client, Intents } = require('discord.js');
const client = new Client({ fetchAllMembers: true, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const axios = require('axios');

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(async () => {
        const user = client.users.cache.random()
        if (user.bot) return;
        console.log(`pp/banner: ${user.tag}`)
        client.channels.cache.get("955160544476815450").send({
            embeds: [
                {
                    color: '#2f3136',
                    image: {
                        url: user.avatarURL({ dynamic: true })
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Click to download",
                            style: 5,
                            url: user.avatarURL({ dynamic: true }),
                            emoji: {
                                id: "944707603752169573"
                            }
                        },
                    ],
                }
            ]
        }).catch(err => err)
        const banners = await banner(user.id, client, { size: 512 })
        client.channels.cache.get("955160569437122630").send({
            embeds: [
                {
                    color: '#2f3136',
                    image: {
                        url: banners
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Click to download",
                            style: 5,
                            url: banners,
                            emoji: {
                                id: "944707603752169573"
                            }
                        },
                    ],
                }
            ]
        }).catch(err => err)
    }, 5000)
})

async function banner(userId, client, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
    if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
        throw new Error(`The size '${size}' is not supported!`);
    }
    if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
        throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
    }
    const user = await client.api.users(userId).get();
    if (!user.banner) return null;
    const query = `?size=${size}`;
    const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;
    if (dynamicFormat) {
        const { headers } = await axios.head(baseUrl);
        if (headers && headers.hasOwnProperty("content-type")) {
            return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
        }
    }
    return baseUrl + `.${defaultFormat}` + query;
}

client.login('OTU1MTU3OTc3Mjg1OTE4NzMw.YjdmLw.dWXkN_Tgk1MyZsg8npWNgwm5mVs');