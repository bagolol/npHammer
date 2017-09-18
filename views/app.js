import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import getData from '../ghParser';
import {
    Navbar,
    Footer,
    Repo,
    Button,
    Loading,
    Layout
} from './components';
import {
    buttonStyle,
    barStyle,
    loadingStyle
} from '../styles/styles';


// Rendering a simple centered box
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false, repos: []};
        this.handleClick = this.handleClick.bind(this);
        this.showRepos = this.showRepos.bind(this);
        this.showRepoInfo = this.showRepoInfo.bind(this);
        this.showLoading = this.showLoading.bind(this);
    }

    handleClick() {
        this.setState({loading: true});
        getData().then(data => Promise.all(data).then(repos => this.setState({repos: repos, loading: false })));
    }

    showRepoInfo(el) {
        console.log(el.name)
    }

    showRepos() {
        return this.state.repos.map((repo, i) => {
            const color = repo.releaseAge > 365 ? "red" : "green";
            return <Repo
                key={repo.locVerReleaseDate}
                handleClick={this.showRepoInfo}
                color={color}
                name={repo.repository}
            />
        });
    }
    showLoading(){
        if (this.state.loading) {
            return <Loading style={loadingStyle}/>
        }
    }

    render() {
        return (
            <element style={{bg: "white"}}>
                <Navbar style={barStyle}/>
                <Layout style={{bg: "white"}}>
                    {this.showRepos()}
                </Layout>
                {this.showLoading()}
                <Button
                    handleClick={this.handleClick}
                    width="20%"
                    height="10%"
                    style={buttonStyle}
                    text="Get package info"
                />
                <Footer style={barStyle}/>
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
