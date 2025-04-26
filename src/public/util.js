function getTableHtml(data) {
    if( !data || data.length === 0) {
        return '<p>No data available</p>';
    }
    let table = '<table border="1">';
    table += '<thead><tr>';
    Object.keys(data[0]).forEach((key) => {
        table += `<th>${key}</th>`;
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach((row) => {
        table += '<tr>';
        Object.values(row).forEach((value) => {
            table += `<td>${value}</td>`;
        });
        table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
}
function getPagination(clickHandler,nextOffset){
    let pagination = '<div class="pagination">';

    if (offset > 0) {
        pagination += `<button id="prev" onclick="${clickHandler}(-1)">Previous</button>`;
    }else{
         pagination += `<button disabled>Previous</button>`;
    }
    if ( nextOffset ) {
        pagination += `<button id="next" onclick="${clickHandler}(1)">Next</button>`;
    }else{
        pagination += `<button disabled>Next</button>`;
    }
    pagination += '</div>';
    return pagination;      
}
$(document).ready(function() {
    $('#clearData').click(function() {
        if (confirm('Are you sure you want to clear all data?')) {
            $.ajax({
                url: '/api/clear',
                type: 'POST',
                success: function(response) {
                    if( response.deleted === true) {
                        alert('All data cleared successfully.');
                    }else{
                        
                        if( response.error) {
                            alert('Error: ' + response.error);
                        }else{
                            alert('Error clearing data.');
                        }
                    }
                    setTimeout(() => {
                        window.location.href = window.location.href
                      }, 100);
                    
                },
                error: function(xhr, status, error) {
                    console.log(error);
                    alert('Error clearing data: ' + error);
                }
            });
        }
    });
});