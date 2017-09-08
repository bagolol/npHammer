import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

// Rendering a simple centered box
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {color: 'green'}
        screen.log('hello')
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        screen.log('hello')
        this.setState({color: 'red'});
    }
    render() {
        return (
            <box top="center"
                onClick={this.handleClick}
                left="center"
                width="20%"
                height="20%"
                keys={ true }
                onKeyPress={this.handleClick}
                border={{type: 'line'}}
                style={{bg: this.state.color}}>
                Hello World!
            </box>
        );
    }
}

// Creating our screen
const screen = blessed.screen({
    debug: true,
    autoPadding: true,
    smartCSR: true,
    title: 'react-blessed hello world'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<App />, screen);
