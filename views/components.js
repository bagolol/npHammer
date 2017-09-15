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
            bold={true}
            border={{type: ""}}
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
            border={{type: 'line'}}
            style={props.style}
        >loading info from github...
        </box>
    )
}

const Repo = props => {
    const hoverColor = `light${props.color}`;
    return(
        <box
            top="200"
            onClick={() => props.handleClick(props)}
            clickable={ true }
            left={props.offset}
            width="13%"
            height="10%"
            align="center"
            style={{
                bg: props.color,
                hover:{bg: hoverColor}
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
            border={{type: ""}}
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
    Loading
};
