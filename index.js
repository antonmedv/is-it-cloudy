#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const os = require('os');
const http = require('http');
const {version} = require('./package.json');

program
  .version(version)
  .option('--city [city]', 'City name', 'Phuket')
  .option('--appid [id]', 'App id for openweathermap.org', 'ef375f150e425a7d8a3a54caa21620f2')
  .option('-f, --fetch', 'Do not check mtime, fetch every time')
  .option('--format [format]', 'Format output, %e for emoji, %t for temp', '%e')
  .parse(process.argv);

const cacheFile = os.homedir() + '/.is-it-cloudy';
const hour = program.fetch ? 0 : 60 * 60 * 1000;
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

fs.stat(cacheFile, (err, stat) => {
  if (err) {
    fetch();
  } else if (new Date() - stat.mtime > hour) {
    fetch();
  } else {
    echo();
  }
});

function fetch() {
  http.get(endpoint(program.city, program.appid), response => {
    let body = '';
    response.on('data', (chunk) => body += chunk);
    response.on('end', () => {
      const data = JSON.parse(body);
      try {
        const code = data.weather[0].id;
        const temp = data.main.temp;
        fs.writeFile(cacheFile, format(code, temp), echo);
      } catch (err) {
        // Can't parse.
      }
    });
  });
}

function format(code, temp) {
  return program.format
    .replace('%e', match(code))
    .replace('%t', Math.floor(temp) + '°');
}

function match(code) {
  for (let [pattern, icon] of icons) {
    if (pattern.test(code)) {
      return icon;
    }
  }
}

function echo() {
  fs.readFile(cacheFile, (err, data) => {
    process.stdout.write(err ? '🌈' : data.toString('utf8'));
  });
}
