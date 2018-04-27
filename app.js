import React, { Component } from 'react';
import fs from 'fs';
import {
  render,
  Window,
  App,
  TextInput,
  Dialog,
  Menu,
  Box,
  Button
} from 'proton-native';

class Notepad extends Component {
  state = { running: true, text: 'Enter here!' };

  render() {
    console.log(this.state.running);
    return (
        this.state.running && <Window
          title="Notes"
          size={{ w: 500, h: 500 }}
        >
          <Box>
            <TextInput
              onChange={text => this.setState({ text })}
            >
              {this.state.text}
            </TextInput>
            <Button onClick={()=>this.setState({running: false})}>Test</Button>
          </Box>
        </Window>
    );
  }
}

export default Notepad;