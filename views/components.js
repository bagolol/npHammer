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

const listInfo = props => {
    let lines = [];
    for (let prop in props.repo) {
        lines.push([prop, props.repo[prop]]);
    }
    return lines.map(line => {
        return(
            <Line
                color={props.color}
                key={line[0]}
                description={line[0]}
                value={line[1]}
            />
        )
    });
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
            onClick={props.handleClick}
            align="center"
            top={props.position.top}
            left="center"
            style={props.style}
            width={props.position.width}
            height={props.position.height}>
            {props.children}
        </layout>
    )
}
const Line = props => {
    return(
        <box
            width="100%"
            height="12%"
            bold={true}
            align="center"
            style={{
                bg: props.color,
            }}>{props.description}: {props.value}</box>
    )
}
const Repo = props => {
    const hoverColor = `light${props.color}`;
    const position = {
        top: "350",
        width: "30%",
        height: "20%"
    }
    return(
        <Layout
            handleClick={props.handleClick}
            clickable={ true }
            position={position}
            style={{
                bg: props.color,
                hover:{bg: hoverColor},
            }}>
            {listInfo(props)}
        </Layout>
    )
}


const Cell = props => {
    const hoverColor = `light${props.color}`;
    return(
        <box
            onClick={() => props.handleClick(props.repo)}
            clickable={ true }
            width="20%"
            height="30%"
            align="center"
            style={{
                bg: props.color,
                hover:{bg: hoverColor},
                border:{bg: props.color}
            }}>
            {props.repo.repository}
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
    Layout,
    Cell
};
