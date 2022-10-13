import { ChatInputCommandInteraction, EmbedBuilder, inlineCode } from "discord.js";
import { handleUndefinedCountry } from "./generalCountryCommandUtil";
import { addDefaultEmbedFooter } from "../embeds";
import { getCountryByName } from "./countryDataManager";
import { pickRandomFromList } from "../random";
import { formatNumber } from "../numbers";
import { Country } from "./typesCountryCommand";
import { countryData } from "./countryDataLoader";

export function overviewSubcommand(interaction: ChatInputCommandInteraction) {
	const country: Country | undefined = getCountryByName(
		interaction.options.getString("country", true)
	);

	if (country) {
		interaction.reply({ embeds: [getOverviewEmbed(country, interaction.locale)] });
	} else {
		handleUndefinedCountry(interaction);
	}
}

export function randomOverviewSubcommand(interaction: ChatInputCommandInteraction) {
	interaction.reply({
		embeds: [getOverviewEmbed(pickRandomFromList(countryData), interaction.locale)],
	});
}

function getOverviewEmbed(country: Country, locale: string): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle(country.name)
		.setThumbnail(country.flags.png)
		.setDescription(`(officially: ${country.official_name}, code: ${country.cca2})`)
		.addFields(
			{
				name: "Demographics",
				value: `- Population size: ${formatNumber(country.population, locale)} (${
					countryData.indexOf(country) + 1
				}.)
			 - Is ${!country.unMember ? "not" : ""} a member of the UN
			 - Top Level Domain: ${inlineCode(country.tld.join(" / "))}
			 - Currencie(s): ${country.currencies.join(", ")}
			 - Language(s): ${Object.values(country.languages).join(", ")}`,
			},
			{
				name: "Geographics",
				value: `- Capital: ${country.capital.join(", ")}
			 - Region: ${country.region}, Subregion: ${country.subregion}
			 - Coordinates: ${Math.round(country.latitude)}° N/S, ${Math.round(country.longitude)}° E/W
			 - Timezone(s): ${country.timezones.join(", ")}
			 - Area: ${formatNumber(country.area, locale)} km²
			 - [Google Maps](${country.maps.googleMaps})`,
			}
		);

	return addDefaultEmbedFooter(embed);
}
