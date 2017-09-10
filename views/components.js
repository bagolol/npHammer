import React from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

// Rendering a simple centered box
const Navbar = props => {
    return(
        <box top="0"
            left="center"
            width="100%"
            align="center"
            height="10%"
            style={{bg: props.color, fg: "white", bold: true }}>
            npHammer
        </box>
    )
}

const Footer = props => {
    return(
        <box bottom="0"
            left="center"
            width="100%"
            height="8%"
            align="center"
            style={{bg: props.color}}>
        </box>
    )
}

const Repo = props => {
    return(
        <box top={props.offset}
            left="center"
            width="10%"
            height="10%"
            align="center"
            style={{bg: props.color, fg: "orange"}}>
            {props.name}
        </box>
    )
}

const Button = props => {
    return(
        <box top="800"
            onClick={props.handleClick}
            clickable={ true }
            left="center"
            width={props.width}
            mouse={ true }
            height={props.height}
            style={props.style}>
            {props.text}
        </box>
    )
}
export { Navbar, Footer, Repo, Button };
