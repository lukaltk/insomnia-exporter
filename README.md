# insomnia-exporter
CLI Insomnia exporter for JSON format

## Getting Started

### Using `npx`

```sh
npx insomnia-exporter -i /path/to/.insomnia
```

### By installing the package globally

```sh
npm i -g insomnia-documenter
insomnia-exporter -i /path/to/.insomnia
```

### Command line flags

```
Options:
  
  -i, --input  <path>  Location of .insomnia directory
  -o, --output <path>  Where to save the file (defaults to current working directory)
  -c, --config <path>  Location of config file (JSON)
  -h, --help           display help for command
```

### Alternative way 
You can just use `npx insomnia-exporter`. Then the CLI going to wait you to answer the input and the output paths.

```sh
npx insomnia-exporter

? Please enter the path of .insomnia directory:
/path/to/.insomnia

? Please enter the relative path of the file to export or press Enter to use the current path:
/path/to/output/insomnia.json
```

### Configuration
If you want to filter out some data that will be exported, you can set a JSON like [config-example.json](https://github.com/lukaltk/insomnia-exporter/blob/85cc345fa96f8bcfcde44fed458a1a95794eb827/config-example.json) and pass it with the `--config` flag.
