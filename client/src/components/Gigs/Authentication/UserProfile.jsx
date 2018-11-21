import React from 'react';

var UserProfile = (function() {

    var login = function(user) {
        sessionStorage.setItem('user', user)
    }

    var authenticate = function() {
        const user = sessionStorage.getItem('user');
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    return {
        login: login,
        authenticate: authenticate
    }

})();

export default UserProfile;