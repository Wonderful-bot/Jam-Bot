import { Command } from "../interactions/interactionClasses";
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { logger } from "../logger";
import { addProposal, deleteProposal, editProposal } from "../util/proposalCommand/manageProposals";
import { listProposals, viewProposal } from "../util/proposalCommand/listProposals";

class PollCommand extends Command {
	constructor() {
		super("proposal");
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();

		const commands: { [key: string]: (interaction: ChatInputCommandInteraction) => Promise<void> } = {
			add: addProposal,
			delete: deleteProposal,
			edit: editProposal,
			view: viewProposal,
			list: listProposals,
		};

		if (commands[subcommand]) {
			await commands[subcommand](interaction);
		} else {
			await interaction.reply("I don't know that subcommand... Please contact a developer.");
			logger.error("Unkown subcommand: " + subcommand);
		}
	}

	register(): SlashCommandSubcommandsOnlyBuilder {
		return new SlashCommandBuilder()
			.setName("proposal")
			.setDescription("To manage all the proposals for upcoming jams.")
			.addSubcommand((subcommand) => subcommand.setName("add").setDescription("Create a proposal."))
			.addSubcommand((subcommand) =>
				subcommand
					.setName("delete")
					.setDescription("Delete a proposal.")
					.addStringOption(proposalSelectStringOption)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("edit")
					.setDescription("Edit a proposals title, description or time period.")
					.addStringOption(proposalSelectStringOption)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("view")
					.setDescription("View one of the proposals.")
					.addStringOption(proposalSelectStringOption)
			)
			.addSubcommand((subcommand) => subcommand.setName("list").setDescription("Lists all the proposals."));
	}
}

export default new PollCommand();

const proposalSelectStringOption = (option: SlashCommandStringOption) =>
	option
		.setName("title")
		.setDescription("The title of the proposal to select.")
		.setRequired(true)
		.setAutocomplete(true);
