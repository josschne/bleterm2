# bleterm2

BLE terminal for Nordic UART Service devices and similar.

Simple. Minimal dependencies.

## Installation

`npm install -g bleterm2`

NOTE: If you see the following errors, it means npm cannot find python 2.x on your system
    
    gyp ERR! stack Error: Python executable "/usr/local/bin/python" is v3.6.4, which is not supported by gyp.
    gyp ERR! stack You can pass the --python switch to point to Python >= v2.5.0 & < 3.0.0.
    
On OSX, please use the following incantation:
    `npm config set python python2.7`

On other OS's, please replace python2.7 with the name/path of your Python 2.7 executable:
    `npm config set python <path to python2.7>`

NOTE: On OSX, the message `SKIPPING OPTIONAL DEPENDENCY: bluetooth-hci-socket@0.5.1` is expected and normal.

## Usage 

`bleterm2 <device name>`

OR with custom service UUID or characteristic UUIDs

`bleterm2 --serviceUUID "xxxx..." --charUUIDS "xxxx...","xxxx..." <device name>`

Type CTRL-D to exit.

###### Built while working on client project for [Punch Through](https://punchthrough.com)
