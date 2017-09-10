import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Navbar, Footer, Repo, Button } from './components';
import getData from '../ghParser';


const style = {
    fg: 'black',
    hover: {
        bg: 'red'
    }
};

// Rendering a simple centered box
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {color: 'green', repos: []};
        this.handleClick = this.handleClick.bind(this);
        this.showRepos = this.showRepos.bind(this);
    }

    handleClick() {
        console.log('CLICKED')
        getData().then(data => console.log(data));
    }
    showRepos() {
        return this.state.repos.map(repo => {
            let offset = (100 * repo.id).toString();
            return <Repo
                    offset={offset}
                    key={repo.id}
                    color="green"
                    name={repo.name}
                />
        });
    }

    render() {
        return (
            <element>
                <Navbar color="blue"/>
                {this.showRepos()}
                <Button
                    handleClick={this.handleClick}
                    width="20%"
                    height="10%"
                    style={style}
                    text="Get package info"
                />
                <Footer color="red"/>
            </element>
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
