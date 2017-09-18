import React from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

const Navbar = props => {
    return(
        <box top="0"
            left="center"
            width="100%"
            align="center"
            bold={true}
            height="10%"
            style={{...props.style,
                fg: "white",
                bold: true
            }}
        >npHammer</box>
    )
}

const Footer = props => {
    return(
        <box bottom="0"
            left="center"
            width="100%"
            height="8%"
            align="center"
            style={props.style}>
        </box>
    )
}
const Loading = props => {
    return(
        <box top="500"
            left="center"
            width="20%"
            height="8%"
            align="center"
            style={props.style}
        >loading info from github...
        </box>
    )
}
const Layout = props => {
    return(
        <layout
            align="center"
            top="200"
            left="center"
            style={props.style}
            width="80%"
            height="50%">
            {props.children}
        </layout>
    )
}

const Repo = props => {
    const hoverColor = `light${props.color}`;
    return(
        <box
            onClick={() => props.handleClick(props)}
            clickable={ true }
            width="20%"
            height="30%"
            align="center"
            style={{
                bg: props.color,
                hover:{bg: hoverColor},
                border:{bg: props.color}
            }}>
            {props.name}
        </box>
    )
}

const Button = props => {
    return(
        <box
            top="800"
            onClick={props.handleClick}
            clickable={ true }
            left="center"
            width={props.width}
            mouse={ true }
            align="center"
            height={props.height}
            style={props.style}>
            {props.text}
        </box>
    )
}

export {
    Navbar,
    Footer,
    Repo,
    Button,
    Loading,
    Layout
};
