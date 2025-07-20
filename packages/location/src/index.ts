import continents from "@optima/location/continents";
import countries from "@optima/location/countries";
import timezones from "@optima/location/timezones";
import flags from "./country-flag";
import { EU_COUNTRY_CODES } from "./eu-countries";
import { getCountryCode } from "./helpers";

const countriesMap = new Map(countries.map((c) => [c.name, c]));
export {
	timezones,
	countries,
	continents,
	countriesMap,
	getCountryCode,
	flags,
	EU_COUNTRY_CODES,
};

// export async function getTimezone() {
//   return (await headers()).get("x-vercel-ip-timezone") || "Europe/Berlin";
// }

// export function getTimezones() {
//   return timezones;
// }

// export async function getCountryInfo() {
//   const country = await getCountryCode();

//   const countryInfo = countries.find((x) => x.cca2 === country);

//   const currencyCode = countryInfo?.currencies
//     ? (Object.keys(
//         countryInfo.currencies,
//       )[0] as keyof typeof countryInfo.currencies)
//     : undefined;
//   const currency =
//     currencyCode && countryInfo?.currencies
//       ? countryInfo.currencies[currencyCode]
//       : null;
//   const languages = countryInfo?.languages
//     ? Object.values(countryInfo.languages).join(", ")
//     : undefined;

//   return {
//     currencyCode,
//     currency,
//     languages,
//   };
// }

// export async function isEU() {
//   const countryCode = (await headers()).get("x-vercel-ip-country");

//   if (countryCode && EU_COUNTRY_CODES.includes(countryCode)) {
//     return true;
//   }

//   return false;
// }

// export async function getCountry() {
//   const country = await getCountryCode();

//   // Type assertion since we know flags will have an entry for valid country codes
//   return flags[country as keyof typeof flags];
// }
