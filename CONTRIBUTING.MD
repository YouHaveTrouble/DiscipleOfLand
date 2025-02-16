# How to contribute

All meaningful contributions are welcome. If you're not sure about something,
open an issue or [join the discord server](https://discord.youhavetrouble.me/)
to talk it out.

## Reporting issues

If you find a bug or unexpected behavior, open an issue. Include information about
how to reproduce the issue, and any relevant error messages from your browser's
console.

## Pull requests
PLEASE OPEN AN ISSUE OR DISCUSS ON DISCORD BEFORE MAKING A PULL REQUEST.

Noone likes to waste time on a PR that won't be accepted, so please ask first!

## Inputting data

Entire project is data-driven and contributions can be made either via pull request or
submitting a json file with the data formatted as described below. If anything's unclear,
[ask on discord](https://discord.youhavetrouble.me/).

### Items
You can see the existing data [here](https://github.com/YouHaveTrouble/DiscipleOfLand/blob/master/public/data/items.json).
Item data adheres to following json schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "patternProperties": {
    "^[a-zA-Z0-9-]+$": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "level": { "type": "integer" },
        "stars": { "type": "integer" },
        "perception": { "type": "integer" }
      },
      "required": ["name", "level"]
    }
  },
  "additionalProperties": false
}

```

### Zones
You can see the existing data [here](https://github.com/YouHaveTrouble/DiscipleOfLand/blob/master/public/data/zones.json).
Zone data adheres to following json schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "patternProperties": {
    "^[a-zA-Z0-9-]+$": {
      "type": "object",
      "properties": {
        "name": {
          "type": "object",
          "properties": {
            "en": { "type": "string" }
          },
          "required": ["en"]
        },
        "aetherytes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "position": {
                "type": "object",
                "properties": {
                  "x": { "type": "number" },
                  "y": { "type": "number" }
                },
                "required": ["x", "y"]
              },
              "name": {
                "type": "object",
                "properties": {
                  "en": { "type": "string" }
                },
                "required": ["en"]
              }
            },
            "required": ["position", "name"]
          }
        }
      },
      "required": ["name", "aetherytes"]
    }
  },
  "additionalProperties": false
}
```

### Nodes
You can see the existing data [here](https://github.com/YouHaveTrouble/DiscipleOfLand/blob/master/public/data/nodes.json).
Node data adheres to following json schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "job": { 
      "type": "string",
      "enum": ["botanist", "miner"]
    },
    "type": { 
      "type": "string",
      "enum": ["unspoiled", "legendary"]
    },
    "position": {
      "type": "object",
      "properties": {
        "zone": { "type": "string" },
        "x": { "type": "number" },
        "y": { "type": "number" }
      },
      "required": ["zone", "x", "y"]
    },
    "times": {
      "type": "array",
      "items": { "type": "string", "pattern": "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$" },
      "minItems": 2,
      "maxItems": 2
    },
    "items": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["job", "type", "position", "times", "items"]
}
```
`times` is an array of two strings representing the time the node is available in Eorzea time.
First value is the time the node becomes available, second value is the time the node disappears.

`items` elements are ids corresponding to the items in the items.json file.

