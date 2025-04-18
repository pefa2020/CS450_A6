/*
Name: Percy Flores
Assignment: Assignment 6
Course CS450
Date: 04/18/2025

*/

import React, { Component } from 'react'
import * as d3 from 'd3';

class FileUpload extends Component {
    state = { file: null }

    handleFileSubmit = (e) => {
        e.preventDefault();
        console.log("This is the file: ", this.state.file)
        if (this.state.file === null) console.log("No file selected")
        if (this.state.file) {

            const reader = new FileReader()
            console.log("im rather here")

            reader.onload = (e) => {
                console.log("This is the file reader: ", e.target.result)
                const csvText = e.target.result
                const blob = new Blob([csvText], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)

                d3.csv(url).then(data => {
                    // console.log(data)
                    const formattedData = data.map(d => (
                        {
                            // convert string date to date
                            month: new Date(d['Date']),
                            gpt4: +d['GPT-4'],
                            gemini: +d['Gemini'],
                            palm2: +d['PaLM-2'],
                            claude: +d['Claude'],
                            llama31: +d['LLaMA-3.1'],
                        }
                    ))
                    console.log(formattedData)
                    this.props.set_data(formattedData)
                    URL.revokeObjectURL(url)
                }).catch(console.error)
            };
            reader.readAsText(this.state.file)
        }
    }

    render = () => (
        <div style={{ backgroundColor: "#f0f0f0", padding: 20 }}>
            <h2>Upload a CSV File</h2>
            <form onSubmit={this.handleFileSubmit}>
                <input
                    type='file'
                    accept='.csv'
                    onChange={(e) => this.setState({
                        file: e.target.files[0]
                    })}
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default FileUpload;