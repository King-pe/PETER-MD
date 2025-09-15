const { smd } = require("../lib");
const fetch = require("node-fetch");

function weatherEmoji(desc = "") {
  const d = ("" + desc).toLowerCase();
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("storm")) return "⛈️";
  if (d.includes("drizzle")) return "🌦️";
  if (d.includes("rain")) return "🌧️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("sleet")) return "🌨️";
  if (d.includes("hail")) return "🌨️";
  if (d.includes("clear")) return "☀️";
  if (d.includes("sunny")) return "☀️";
  if (d.includes("partly") || d.includes("intervals")) return "⛅";
  if (d.includes("cloud")) return "☁️";
  if (d.includes("overcast")) return "☁️";
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "🌫️";
  return "🌡️";
}

smd(
  {
    pattern: "weather",
    desc: "Angalia hali ya hewa ya sasa kwa mji uliotaja",
    category: "tools",
    filename: __filename,
    use: "weather <mji>",
  },
  async (message, input) => {
    try {
      const city = (input || "").trim() || (message.reply_text || "").trim();
      if (!city) {
        return message.reply("Taja mji: .weather Dar es Salaam");
      }
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
      const res = await fetch(url);
      if (!res.ok) return message.reply("Imeshindikana kupata hali ya hewa.");
      const data = await res.json();
      const current = data.current_condition && data.current_condition[0] ? data.current_condition[0] : null;
      const area = data.nearest_area && data.nearest_area[0] ? data.nearest_area[0] : null;
      if (!current) return message.reply("Hakuna taarifa za hali ya hewa sasa.");
      const locName = area ? (area.areaName?.[0]?.value || city) : city;
      const tempC = current.temp_C;
      const feelsC = current.FeelsLikeC;
      const desc = current.weatherDesc?.[0]?.value || "";
      const humidity = current.humidity;
      const windKph = current.windspeedKmph;
      const precipMM = current.precipMM;
      const visibility = current.visibility;
      const icon = weatherEmoji(desc);
      const out = (
        `${icon}  Hali ya Hewa: ${locName}\n\n` +
        `- Joto: ${tempC}°C (yahisika ${feelsC}°C)\n` +
        `- Upepo: ${windKph} km/h\n` +
        `- Unyevu: ${humidity}%\n` +
        `- Mvua: ${precipMM} mm\n` +
        `- Uangavu: ${visibility} km\n` +
        `- Maelezo: ${desc}`
      );
      await message.send(out);
      try {
        const imgUrl = `https://wttr.in/${encodeURIComponent(locName)}.png?m`;
        await message.bot.sendMessage(message.chat, { image: { url: imgUrl }, caption: `Grafu ya hali ya hewa: ${locName}` });
      } catch {}
      return;
    } catch (e) {
      await message.error(e + "\n\ncommand: weather", e, "Imeshindikana kupata hali ya hewa.");
    }
  }
);

smd(
  {
    pattern: "forecast",
    alias: ["wforecast"],
    desc: "Utabiri wa siku 3 kwa mji uliotaja",
    category: "tools",
    filename: __filename,
    use: "forecast <mji>",
  },
  async (message, input) => {
    try {
      const city = (input || "").trim() || (message.reply_text || "").trim();
      if (!city) {
        return message.reply("Taja mji: .forecast Arusha");
      }
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
      const res = await fetch(url);
      if (!res.ok) return message.reply("Imeshindikana kupata utabiri.");
      const data = await res.json();
      const weather = data.weather || [];
      if (!weather.length) return message.reply("Hakuna taarifa za utabiri.");
      const lines = weather.slice(0, 3).map((d) => {
        const date = d.date;
        const avg = d.avgtempC;
        const max = d.maxtempC;
        const min = d.mintempC;
        const desc = d.hourly && d.hourly[4] ? (d.hourly[4].weatherDesc?.[0]?.value || "") : "";
        const icon = weatherEmoji(desc);
        return `${icon} ${date}: ${min}°C–${max}°C (avg ${avg}°C) — ${desc}`;
      });
      const out = `Utabiri wa Siku 3: ${city}\n\n` + lines.join("\n");
      await message.send(out);
      try {
        const imgUrl = `https://wttr.in/${encodeURIComponent(city)}.png?m&3`;
        await message.bot.sendMessage(message.chat, { image: { url: imgUrl }, caption: `Grafu ya utabiri: ${city}` });
      } catch {}
      return;
    } catch (e) {
      await message.error(e + "\n\ncommand: forecast", e, "Imeshindikana kupata utabiri.");
    }
  }
);


