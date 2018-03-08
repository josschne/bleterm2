# bleterm2

BLE terminal for Nordic UART Service devices and similar.

Simple. Minimal dependencies.

## Installation

`npm install -g bleterm2`


## Usage 

`bleterm2 <device name>`

OR with custom service UUID or characteristic UUIDs

`bleterm2 --serviceUUID "xxxx..." --charUUIDS "xxxx...","xxxx..." <device name>`

Type CTRL-D to exit.
