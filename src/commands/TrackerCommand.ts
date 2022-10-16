import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder,  } from "discord.js";
import { Command } from "../handler";
import { hasAdminPerms } from "../util/permissions";
import { addDefaultEmbedFooter } from "../util/embeds";
import { activityTrackerLogDb, activityTrackerBlacklistDb } from "../db";
import { config } from "../config";

class TrackerCommand extends Command {
	constructor() {
		super("tracker");
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const group: string | null = interaction.options.getSubcommandGroup()
        const sub: string | null = interaction.options.getSubcommand()
	
        if (group === "blacklist") {
            if (sub === "add") {
                await blacklistAdd(interaction)
            } else if (sub === "remove") {
                await blacklistRemove(interaction)
            } else if (sub === "show") {
                await blacklistShow(interaction)
            }
        } else if (group === "statistics") {
            if (sub === "mystats") {
                await statisticsMystats(interaction)
            } else if (sub === "gamestats") {
                await statisticsGamestats(interaction)
            } else if (sub === "allstats") {
                await statisticsAllstats(interaction)
            }
        } else if (group === "admin") {
            if (!hasAdminPerms(interaction)) {
                return
            } else if (sub === "reset") {
                await adminReset(interaction)
            } else if (sub === "blacklistgame") {
                await adminBlacklistgame(interaction)
            } else if (sub === "whitelistgame") {
                await adminWhitelistgame(interaction)
            } else if (sub === "look") {
                await adminLook(interaction)
            }
        } else if (sub === "disabled") {
            interaction.reply({content:"The activity logging is disabled.\nIf feature gets activated you can find the commands which come with the feature.", ephemeral:true})
        }
    }

	register(): 
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> {

        if (!config.logActivity) {
            return new SlashCommandBuilder()
                .setName("tracker")
                .setDescription("Tracking is disabled")
                .addSubcommand(sub => sub
                    .setName("disabled")
                    .setDescription("Tracking is disabled")    
                )
        }
        return new SlashCommandBuilder()
            .setName("tracker")
            .setDescription("All commands associated with the Game activity tracker!")
            .addSubcommandGroup(group => group
                .setName("blacklist")
                .setDescription("Tracking blacklist")
                .addSubcommand(sub => sub
                    .setName("add")
                    .setDescription("add a game to your blacklist")
                    .addStringOption(opt => opt
                        .setName("game")
                        .setDescription("Enter game or dont enter anything to disable your logging")    
                    )
                )
                .addSubcommand(sub => sub
                    .setName("remove")
                    .setDescription("remove a game from your blacklist")
                    .addStringOption(opt => opt
                        .setName("game")
                        .setDescription("Enter game or dont enter anything to enable your logging")
                        .setAutocomplete(true)
                    )
                    
                )
                .addSubcommand(sub => sub
                    .setName("show")
                    .setDescription("See what is on your blacklist")    
                )
            )
            .addSubcommandGroup(group => group
                .setName("statistics")
                .setDescription("Show statistics")
                .addSubcommand(sub => sub
                    .setName("mystats")
                    .setDescription("Show your activity statistics")
                    .addStringOption(opt => opt
                        .setName("game")
                        .setDescription("Show statistics for a specific game")
                        .setAutocomplete(true)
                    )
                )
                .addSubcommand(sub => sub
                    .setName("gamestats")
                    .setDescription("Show statistics for a specific game across all users")
                    .addUserOption(opt => opt
                        .setName("user")
                        .setDescription("Show statistics for a specific user")
                    )
                )
                .addSubcommand(sub => sub
                    .setName("allstats")
                    .setDescription("Show statistics about all games across all users")
                )
            )
            .addSubcommandGroup(group => group
                .setName("admin")
                .setDescription("admin only commands")
                .addSubcommand(sub => sub
                    .setName("reset")
                    .setDescription("Reset every log and blacklist entry")
                    .addBooleanOption(opt => opt
                        .setName("sure")
                        .setDescription("Are you really sure?")
                        .setRequired(true)    
                    )
                    .addStringOption(opt => opt
                        .setName("really")
                        .setDescription("Are you really sure you want to delete every entry?")
                        .addChoices(
                            {name: "No. I dont want to delete every log and blacklist entry!", value: "no"},
                            {name: "Yes I am sure. I want to delete every log and blacklist entry!", value: "yes"}
                        )
                        .setRequired(true)
                    )
                )
                .addSubcommand(sub => sub
                    .setName("blacklistgame")
                    .setDescription("Blacklist a game for all users.")
                    .addStringOption(opt => opt
                        .setName("game")
                        .setDescription("The game which should get blacklisted globaly")
                        .setRequired(true)
                    )
                )
                .addSubcommand(sub => sub
                    .setName("whitelistgame")
                    .setDescription("Remove a game from the global blacklist")
                    .addStringOption(opt => opt
                        .setName("game")
                        .setDescription("The game which should get removed from the global blacklist")
                        .setRequired(true)
                        .setAutocomplete(true)
                    )    
                )
                .addSubcommand(sub => sub
                    .setName("look")
                    .setDescription("take a look into the blacklist of someone else")
                    .addUserOption(opt => opt
                        .setName("user")
                        .setDescription("the user of whos blacklist should get shown")
                        .setRequired(true)
                    )   
                )
            )
	}
}
export default new TrackerCommand();


// commands

async function blacklistAdd(interaction: ChatInputCommandInteraction): Promise<void> {
    
}
async function blacklistRemove(interaction: ChatInputCommandInteraction): Promise<void> {
    
}
async function blacklistShow(interaction: ChatInputCommandInteraction): Promise<void> {
    
}

async function statisticsMystats(interaction: ChatInputCommandInteraction): Promise<void> {
    
}
async function statisticsGamestats(interaction: ChatInputCommandInteraction): Promise<void> {
    
}
async function statisticsAllstats(interaction: ChatInputCommandInteraction): Promise<void> {
    
}

// done
async function adminReset(interaction: ChatInputCommandInteraction): Promise<void> {
    let sure: boolean = interaction.options.getBoolean('sure', true)
    let really: string= interaction.options.getString('really', true)

    if (!(sure && really == "yes")) {
        let embed = new EmbedBuilder()
            .setTitle("Seams like your are not really sure.")
            .setDescription("Because you are not really sure if you should reset everything related to Tracking, the reset wasnt executed.")
            .setColor("#9d4b4b")
        embed = addDefaultEmbedFooter(embed)
        await interaction.reply({embeds:[embed]})
        return
    } else {
        let embed = new EmbedBuilder()
            .setTitle("Reseting Logs and Blacklist...")
            .setColor("#9d9e4c")
        embed = addDefaultEmbedFooter(embed)
        await interaction.reply({embeds:[embed]})
    }

    activityTrackerLogDb.clear()
    activityTrackerBlacklistDb.clear()
    activityTrackerBlacklistDb.ensure("general-user", []);
    activityTrackerBlacklistDb.ensure("general-game", []);

    let embed = new EmbedBuilder()
        .setTitle("Reset done!")
        .setColor("#4c9e4f")
    embed = addDefaultEmbedFooter(embed)
    await interaction.editReply({embeds:[embed]})
}
// done
async function adminBlacklistgame(interaction: ChatInputCommandInteraction): Promise<void> {
    let game = interaction.options.getString('game', true)
    activityTrackerBlacklistDb.push('general-game', game)

    let embed = new EmbedBuilder()
        .setTitle("added a game to blacklist")
        .setDescription(`No activity about "${game}" will be logged anymore.`)
    embed = addDefaultEmbedFooter(embed)
    await interaction.reply({embeds:[embed]})
}
//done
async function adminWhitelistgame(interaction: ChatInputCommandInteraction): Promise<void> {
    let game = interaction.options.getString('game', true)
    
    let blacklistedGames: string[] | undefined = activityTrackerBlacklistDb.get('general-game')
    
    if (blacklistedGames === undefined) {
        let embed = new EmbedBuilder()
            .setTitle("Something went wrong")
        embed = addDefaultEmbedFooter(embed)
        await interaction.reply({embeds:[embed]})
        return
    }

    blacklistedGames = blacklistedGames?.filter(e => e !== game)


    activityTrackerBlacklistDb.set('general-game', blacklistedGames)

    let embed = new EmbedBuilder()
        .setTitle("Removed a game from global blacklist")
        .setDescription(`Removed "${game}" from global blacklist.`)
    embed = addDefaultEmbedFooter(embed)
    await interaction.reply({embeds:[embed]})
    return

}
async function adminLook(interaction: ChatInputCommandInteraction): Promise<void> {

}


// helper functions
