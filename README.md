# react-goban

*A stateless React component displaying a Goban.*

Its concern is the View: it implements neither Go rules nor game state.

**Live demo at** [https://desgeeko.github.io/react-goban/](https://desgeeko.github.io/react-goban/)

![SVGoban demo](demo/demo.png)

## Usage

Install the package: `npm install react-goban --save`

Require it and use its `Goban` object:

```jsx
<Goban stones={{"P16":"black","Q4":"white","D4":"black","E16":"white"}} 
       onIntersectionClick={handler}
/>
```

### Goban Attributes
* `size` = a number between `9` and `19` (default)
* `theme` = `"classic"` (default) or `"paper"`
* `coordSystem` = `"A1"` (default) or `"aa"`
* `stones` = an object containing coordinates and colors as keys and values
* `markers` = an object containing coordinates and types (for example "circle") as keys and values
* `onIntersectionClick` = callback function from (statefull) parent Component
* `hideBorder` = true or false (default)
* `zoom` = an object describing the region to zoom in, or null (default)
* `noMargin` = true or false (default)
* `nextToPlay` = color of hover effet on placeholders

## Demo

You may `make demo` and browse the bundled app at `demo\index.html`

