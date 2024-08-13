
import axios from "axios";
import React, { Component } from "react";

class App extends Component {
    state = {
        selectedFile: null,
        errorData: [],    // Initialize as empty array
        chartOfAccounts: [], // Initialize as empty array
        collectionsList: [], // Initialize as empty array
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
            return;  
        }

        const formData = new FormData();
        formData.append(
            "myfile",  
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        axios.post("http://127.0.0.1:5000/view", formData)
            .then(response => {
                console.log("API Response:", response); // Log the API response

                // Extract data from the response
                const errorData = response.data.error_data;
                const chartOfAccounts = response.data.chart_of_accounts;
                const collectionsList = response.data.collections_list;

                console.log("Error Data from API:", errorData);
                console.log("Chart of Accounts from API:", chartOfAccounts);
                console.log("Collections List from API:", collectionsList);

                // Sanitize data to handle potential NaN values
                const sanitizeData = (data) => {
                    return data.map(item => {
                        Object.keys(item).forEach(key => {
                            if (item[key] === 'NaN') {
                                item[key] = null;
                            } else if (typeof item[key] === 'object') {
                                // Convert objects to strings for rendering
                                item[key] = JSON.stringify(item[key]);
                            }
                        });
                        return item;
                    });
                };
 

                if (Array.isArray(errorData)
                     && Array.isArray(chartOfAccounts)
                     && Array.isArray(collectionsList)) {
                    this.setState({
                        errorData: sanitizeData(errorData),
                        chartOfAccounts: sanitizeData(chartOfAccounts),
                        collectionsList: sanitizeData(collectionsList),
                        uploadStatus: "Upload successful!",
                    });
                } else {
                    console.error("Invalid data format from API. Expected arrays for all data types.");
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
            return <></>;
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
                                <td key={colIndex}>
                                    {typeof row[header] === 'object'
                                        ? JSON.stringify(row[header])
                                        : row[header] || "N/A"}
                                </td>
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
                {this.state.errorData.length !== 0 && <h2>Error Data</h2>}
                {this.renderTable(this.state.errorData, "Error Data")}
                {this.state.chartOfAccounts.length !== 0 && <h2>Chart of Accounts</h2>}
                {this.renderTable(this.state.chartOfAccounts, "Chart of Accounts")}
                {this.state.collectionsList.length !== 0 && <h2>Accounts Needing Collections</h2>}
                {this.renderTable(this.state.collectionsList, "Accounts Needing Collections")}
            </div>
        );
    }
}

export default App;

