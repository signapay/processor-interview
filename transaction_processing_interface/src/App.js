/*

import axios from "axios";

import React, { Component } from "react";

class App extends Component {
    state = {
        // Initially, no file is selected
        selectedFile: null,
    };

    // On file select (from the pop up)
    onFileChange = (event) => {
        // Update the state
        this.setState({
            selectedFile: event.target.files[0],
        });
    };

    // On file upload (click the upload button)
    onFileUpload = () => {
      // Check if a file is selected
      if (!this.state.selectedFile) {
          alert("Please select a file before uploading.");
          return;  // Stop further execution
      }
  
      // Create an object of formData
      const formData = new FormData();
  
      // Update the formData object
      formData.append(
          "myFile",
          this.state.selectedFile,
          this.state.selectedFile.name
      );
  
      // Details of the uploaded file
      console.log(this.state.selectedFile);
  
      // Request made to the backend api
      // Send formData objectsss
      axios.post("http://127.0.0.1:5000/view", formData);
  };

    // File content to be displayed after
    // file upload is complete
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>
                        File Name:{" "}
                        {this.state.selectedFile.name}
                    </p>

                    <p>
                        File Type:{" "}
                        {this.state.selectedFile.type}
                    </p>

                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>
                        Choose before Pressing the Upload
                        button
                    </h4>
                </div>
            );
        }
    };

    render() {
        return (
            <div>
                <h1>Transaction Processor</h1>
                <h3>File Upload using React!</h3>
                <div>
                    <input
                        accept="text/csv"
                        type="file"
                        onChange={this.onFileChange}
                    />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
}

export default App;

*/


/*

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
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        axios.post("http://127.0.0.1:5000/view", formData)
            .then(response => {
                console.log("API Response:", response.data); // Log the response data
                this.setState({
                    cleanData: Array.isArray(response.data.clean_data) ? response.data.clean_data : [],
                    errorData: Array.isArray(response.data.error_data) ? response.data.error_data : [],
                    uploadStatus: "Upload successful!"
                });
                console.log("Clean Data State:", this.state.cleanData);
                console.log("Error Data State:", this.state.errorData);
            })
            .catch(error => {
                console.error("There was an error uploading the file!", error);
                this.setState({
                    uploadStatus: "Upload failed. Please try again."
                });
            });
    };

    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>Last Modified: {this.state.selectedFile.lastModifiedDate.toDateString()}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose a file before pressing the Upload button</h4>
                </div>
            );
        }
    };

    renderTable = (data) => {
        if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;

        const headers = Object.keys(data[0]);
        return (
            <table border="1">
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map(header => (
                                <td key={header}>{row[header]}</td>
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
                <h1>Transaction Processor</h1>
                <h3>File Upload using React!</h3>
                <div>
                    <input
                        accept="text/csv"
                        type="file"
                        onChange={this.onFileChange}
                    />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.fileData()}
                {this.state.uploadStatus && <p>{this.state.uploadStatus}</p>}
                <h3>Clean Data</h3>
                {this.renderTable(this.state.cleanData)}
                <h3>Error Data</h3>
                {this.renderTable(this.state.errorData)}
            </div>
        );
    }
}

export default App;

*/

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

