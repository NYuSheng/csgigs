import React from 'react';

const categories = [
    "Logistics",
    "Admin",
    "Operation"
]

export const renderTaskCategories = function () {
    // API call to retrieve categories before mapping them

    return (
        <React.Fragment>
            {
                categories.map((prop, key) => {
                    return (
                        <option key={key} value={prop}>{prop}</option>
                    );
                })
            }
        </React.Fragment>
    );
}