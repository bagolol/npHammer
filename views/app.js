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
        this.state = {
            loading: false,
            repos: [],
            currentRepo: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.showRepos = this.showRepos.bind(this);
        this.showRepoInfo = this.showRepoInfo.bind(this);
        this.handleClickOnRepo = this.handleClickOnRepo.bind(this);
        this.showLoading = this.showLoading.bind(this);
    }

    handleClick() {
        this.setState({loading: true});
        getData().then(data => Promise.all(data).then(repos => this.setState({repos: repos, loading: false })));
    }

    handleClickOnRepo(repo) {
        this.setState({currentRepo: repo})
    }

    showRepos() {
        return this.state.repos.map((repo, i) => {
            const color = repo.releaseAge > 365 ? "red" : "green";
            return <Repo
                key={repo.locVerReleaseDate}
                handleClick={this.handleClickOnRepo}
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
    showRepoInfo() {
        if(this.state.currentRepo.name) {
            return <Repo name={this.state.currentRepo.name}/>
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
                {this.showRepoInfo()}
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
