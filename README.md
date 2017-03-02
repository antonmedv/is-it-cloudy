# Is it cloudy? 🌦

Node command line tool to printing weather info.

<p align="center"><img width="551" alt="Bash prompt with weather info" src="https://cloud.githubusercontent.com/assets/141232/23497068/0d46f7dc-ff54-11e6-88e5-9ca9ff9180e7.png"></p>

## Installation

```sh
npm install -g is-it-cloudy
```

## Usage

```
  Usage: is-it-cloudy [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -c, --city [city]      city name for weather info
    -a, --appid [id]       app id for openweathermap.org
    -f, --format [format]  format output, %e for emoji, %t for temp
```

## Example

You can use this command to display weather in bash prompt.
Add next command to crontab to update status every 30 minutes:

```sh
0,30 * * * * /usr/local/bin/node /usr/local/bin/is-it-cloudy > ~/.is-it-cloudy
```

Add to your *.profile* file:

```sh
function set_ps1 {
  weather=$(cat ~/.is-it-cloudy);
  export PS1="${weather} \w\$"
}

export PROMPT_COMMAND="set_ps1;"
```

## License

MIT
