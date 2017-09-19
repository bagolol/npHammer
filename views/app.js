import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import getData from '../ghParser';
import {
    Cell,
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
            showGrid: false,
            showRepo: false,
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
    getData().then(data => Promise.all(data)
      .then(repos => this.setState({repos: repos, loading: false, showGrid: true })));
  }

    handleClickOnRepo(repo) {
      const showGrid = !this.state.showGrid;
      const showRepoInfo = !this.state.showRepoInfo;
      this.setState({
        currentRepo: repo,
        showGrid: showGrid,
        showRepoInfo: showRepoInfo
      })
    }

    showRepos() {
      if(this.state.showGrid) {
        return this.state.repos.map((repo, i) => {
            const color = repo.releaseAge > 500 ? "red" : "green";
            return <Cell
                key={repo.locVerReleaseDate}
                handleClick={this.handleClickOnRepo}
                color={color}
                repo={repo}
            />
        });
      }
    }
    showLoading(){
        if (this.state.loading) {
            return <Loading style={loadingStyle}/>
        }
    }
    showRepoInfo() {
        if(this.state.showRepoInfo) {
          return <Repo
                  color="magenta"
                  repo={this.state.currentRepo}
                  handleClick={this.handleClickOnRepo}
            />
        }
    }

    render() {
      const position = {
          top: "200",
          width: "70%",
          height: "50%"
      }
        return (
            <element style={{bg: "white"}}>
                <Navbar style={barStyle}/>
                <Layout position={position} style={{bg: "white"}}>
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
