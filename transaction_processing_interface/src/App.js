

import axios from "axios";
import React, { Component } from "react";
import './App.css';

class App extends Component {
    state = {
        selectedFile: null,
        errorData: [],    // Initialize as empty array
        chartOfAccounts: [], // Initialize as empty array
        collectionsList: [], // Initialize as empty array
        uploadStatus: "", // To show status messages
        
        //pagination
        currentPageErrorData: 0, 
        currentPageChartOfAccounts: 0, 
        currentPageCollectionsList: 0, 
        rowsPerPage: 20, 
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

        axios.post("http://127.0.0.1:8000/view", formData)
            .then(response => {


                // Extract data from the response
                const errorData = response.data.error_data;
                const chartOfAccounts = response.data.chart_of_accounts;
                const collectionsList = response.data.collections_list;

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
                        currentPageErrorData: 0, // Reset page to 0 on new upload
                        currentPageChartOfAccounts: 0, // Reset page to 0 on new upload
                        currentPageCollectionsList: 0, // Reset page to 0 on new upload
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

    // Helper function to get paginated data
    getPaginatedData = (data, page) => {
        const { rowsPerPage } = this.state;
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // Handle page change
    handlePageChange = (type, direction) => {
        this.setState(prevState => {
            let newPage = prevState[`currentPage${type}`];
            if (direction === 'next') {
                newPage = newPage + 1;
            } else if (direction === 'prev') {
                newPage = newPage - 1;
            }
            return {
                [`currentPage${type}`]: newPage
            };
        });
    };

    renderTable = (data, title, type) => {
        if (data.length === 0) {
            return <></>;
        }

        const headers = Object.keys(data[0]);
        const paginatedData = this.getPaginatedData(data, this.state[`currentPage${type}`]);
        const totalPages = Math.ceil(data.length / this.state.rowsPerPage);
        const currentPage = this.state[`currentPage${type}`];

        return (
            <>
                <h2>{title}</h2>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
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
                    <tfoot>
                        <tr>
                            <td colSpan={headers.length}>
                                <div className="pagination-controls">
                                    <button
                                        onClick={() => this.handlePageChange(type, 'prev')}
                                        disabled={currentPage === 0}
                                    >
                                        Previous
                                    </button>
                                    <span> Page {currentPage + 1} of {totalPages} </span>
                                    <button
                                        onClick={() => this.handlePageChange(type, 'next')}
                                        disabled={currentPage >= totalPages - 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </>
        );
    };

    render() {
        return (
            <div>
                <h1>Upload CSV</h1>
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>Upload!</button>
                <p>{this.state.uploadStatus}</p>
                {this.state.errorData.length !== 0 && this.renderTable(this.state.errorData, "Bad Transactions", "ErrorData")}
                {this.state.collectionsList.length !== 0 && this.renderTable(this.state.collectionsList, "Accounts Needing Collections", "CollectionsList")}
                {this.state.chartOfAccounts.length !== 0 && this.renderTable(this.state.chartOfAccounts, "Chart of Accounts", "ChartOfAccounts")}
            </div>
        );
    }
}

export default App;
