

import axios from "axios";
import React, { Component } from "react";

class App extends Component {
    state = {
        selectedFile: null,
        cleanData: [],    // Initialize as empty array
        errorData: [],    // Initialize as empty array
        uploadStatus: "", // To show status messages
    };

    onFileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            uploadStatus: "", // Reset status when a new file is selected
        });
    };

    onFileUpload = () => {
        if (!this.state.selectedFile) {
            alert("Please select a file before uploading.");
            return;  // Stop further execution
        }

        const formData = new FormData();
        formData.append(
            "myfile",  // Ensure this key matches the key used on the server
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        axios.post("http://127.0.0.1:5000/view", formData)
            .then((response)=>JSON.parse(response.data))
            .then(response => {
              //here I CHANGED CONSOLE.LOG TO RESPONSE WHILE IT WAS 'RESPONSE.DATA'
                console.log("API Response:", response); // Log the API response

                // Extract data from the response
                
                const cleanData = response.clean_data;
                const errorData = response.error_data;

                console.log("Clean Data from API:", cleanData);
                console.log("Error Data from API:", errorData);

                // Sanitize data to handle potential NaN values
                const sanitizeData = (data) => {
                    return data.map(item => {
                        Object.keys(item).forEach(key => {
                            if (item[key] === 'NaN') {
                                item[key] = null;
                            }
                        });
                        return item;
                    });
                };

                if (Array.isArray(cleanData) && Array.isArray(errorData)) {
                    this.setState({
                        cleanData: sanitizeData(cleanData),
                        errorData: sanitizeData(errorData),
                        uploadStatus: "Upload successful!",
                    });
                } else {
                    console.error("Invalid data format from API. Expected arrays for clean_data and error_data.");
                    this.setState({
                        uploadStatus: "Upload successful but data format is incorrect.",
                    });
                }
            })
            .catch(error => {
                console.error("There was an error uploading the file!", error);
                this.setState({
                    uploadStatus: "Upload failed. Please try again.",
                });
            });
    };

    renderTable = (data, title) => {
        if (data.length === 0) {
            return <p>No data available</p>;
        }

        const headers = Object.keys(data[0]);
        return (
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, colIndex) => (
                                <td key={colIndex}>{row[header] || "N/A"}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    render() {
        return (
            <div>
                <h1>Upload CSV</h1>
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>Upload!</button>
                <p>{this.state.uploadStatus}</p>
                <h2>Clean Data</h2>
                {this.renderTable(this.state.cleanData, "Clean Data")}
                <h2>Error Data</h2>
                {this.renderTable(this.state.errorData, "Error Data")}
            </div>
        );
    }
}

export default App;

