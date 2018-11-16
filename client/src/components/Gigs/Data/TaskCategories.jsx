import React from 'react';

// dependencies
import {NotificationManager} from "react-notifications";

var categories = []

export const fetchTaskCategories = function () {
    // API call to retrieve categories before mapping them
    fetch('/admin-ui/task-categories', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json =>{
                NotificationManager.error(json.error.errmsg);
            });
        } else {
            data.json().then(json =>{
                categories = json.tags;
            });
        }
    });
}

export const renderTaskCategories = function () {
    return (
        <React.Fragment>
            <option value=""> </option>
            {
                categories.map((prop, key) => {
                    return (
                        <option key={key} value={prop.name}>{prop.name}</option>
                    );
                })
            }
        </React.Fragment>
    );
}