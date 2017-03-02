#!/usr/bin/env node
const program = require('commander');
const http = require('http');
const {version} = require('./package.json');

program
  .version(version)
  .option('-c, --city [city]', 'city name for weather info', 'Phuket')
  .option('-a, --appid [id]', 'app id for openweathermap.org', 'ef375f150e425a7d8a3a54caa21620f2')
  .option('-f, --format [format]', 'format output, %e for emoji, %t for temp', '%e')
  .parse(process.argv);

const endpoint = (city, appid) => ({
  host: 'api.openweathermap.org',
  path: `/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${appid}&units=metric`
});
//Based on http://www.openweathermap.org/weather-conditions
const icons = [
  [/23./, '⛈'],
  [/2../, '🌩'],
  [/3../, '🌧'],
  [/50./, '🌦'],
  [/5../, '🌧'],
  [/602/, '❄️'],
  [/6../, '🌨'],
  [/800/, '☀️'],
  [/801/, '🌤'],
  [/802/, '⛅️'],
  [/803/, '🌥'],
  [/804/, '☁️'],
  [/900/, '🌪'],
  [/90[12]/, '🌊'],
  [/903/, '❄️'],
  [/904/, '🔥'],
  [/905/, '🌬'],
  [/906/, '🍇'],
  [/.../, '☁️'],
];

fetch();

function fetch() {
  http.get(endpoint(program.city, program.appid), response => {
    let body = '';
    response.on('data', (chunk) => body += chunk);
    response.on('end', () => {
      const data = JSON.parse(body);
      try {
        const code = data.weather[0].id;
        const temp = data.main.temp;
        process.stdout.write(format(code, temp));
      } catch (err) {
        // Can't parse.
      }
    });
  });
}

function format(code, temp) {
  return program.format
    .replace('%e', match(code))
    .replace('%t', Math.floor(temp) + '°')
    .toString('utf8');
}

function match(code) {
  for (let [pattern, icon] of icons) {
    if (pattern.test(code)) {
      return icon;
    }
  }
}
