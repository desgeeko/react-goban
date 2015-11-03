# react-goban

*A stateless React component displaying a Goban.*

Its concern is the View: it implements neither Go rules nor game state.

![SVGoban demo](demo/demo.png)

## Usage

Install the package: `npm install react-goban --save`
Require it and use its `Goban` object:

```jsx
<Goban  size="19" 
	stones={{"P16":"black","Q4":"white","D4":"black","E16":"white"}} 
	onIntersectionClick={handler}
/>
```

### Goban Attributes
* `size` = a number between `9` and `19`
* `theme` = `"classic"` or `"paper"`
* `stones` = an object containing coordinates and colors as keys and values 
* `onIntersectionClick` = callback function from (statefull) parent Component 

## Roadmap

This is a Work In Progress.
* Optimize rerendering
* Add markers (last stone played,...)

