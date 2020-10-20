# SB3
Makes creating .sb3 files for Scratch 3 easy

## Install
With npm:
```
npm install ajzat34/SB3
```
With yarn:

```
yarn add ajzat34/SB3
```

## Usage
Example
```node
// require
const Sb3 = require('sb3');

// create a project
const project = new Sb3();

// get the main execution branch
const ctx = project.main;

// create some blocks
ctx.block('event.whenflagclicked');                             // [^When Green Flag Clicked]
ctx.block('motion.gotoxy', 100, ctx.block('motion.xposition')); // [goto x:(100) y:(x position)]

// write the file
project.export(path);
```

### Command line tool:
Interactive block explorer
```bash
sb3 blocktool
```
Interactive .sb3 file explorer
```bash
sb3 inspect file.sb3
```
Dump the project.json from an sb3
```bash
sb3 dumo file.sb3
```