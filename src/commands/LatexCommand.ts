import { Command } from "../Command";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { unknownSubcommandEdit } from "../util/unknownSubcommand";
import { renderEquation, renderMixed, getImage } from "../util/latexCommand/latexRendering";

class Latex extends Command {
	constructor() {
		super("latex");
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		const subcommand = interaction.options.getSubcommand();
		const input = interaction.options.getString("input", true);

		if (subcommand === "latex") {
			renderEquation(input);
			this.answerWithImage(interaction);
		} else if (subcommand === "mixed") {
			renderMixed(input);
			this.answerWithImage(interaction);
		} else {
			unknownSubcommandEdit(interaction);
		}
	}

	answerWithImage(interaction: CommandInteraction) {
		getImage();
		interaction.editReply("Test");
	}

	register(): SlashCommandSubcommandsOnlyBuilder {
		return new SlashCommandBuilder()
			.setName("latex")
			.setDescription("Lets you render beautiful LaTeX equations.")
			.addSubcommand((option) =>
				option
					.setName("equation")
					.setDescription("Lets you render a single LaTeX equation.")
					.addStringOption((option) =>
						option.setName("input").setDescription("Your equation in LaTeX notation.").setRequired(true)
					)
			)
			.addSubcommand((option) =>
				option
					.setName("mixed")
					.setDescription(
						"Lets you write mixed LaTeX code with text, inline equations ($x^2$) and block equations ($$x^2$$)."
					)
					.addStringOption((option) =>
						option.setName("input").setDescription("Your LaTeX input to render.").setRequired(true)
					)
			);
	}
}

export default new Latex();