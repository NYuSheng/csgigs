import React from 'react';

var UserProfile = (function() {

    var login = function(user) {
        sessionStorage.setItem('user', JSON.stringify(user))
    }

    var authenticate = function() {
        try{
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                return true;
            } else {
                return false;
            }
        } catch (exception) {
            return false;
        }
    }

    var getUser = function() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user;
    }

    return {
        login: login,
        authenticate: authenticate,
        getUser: getUser
    }

})();

export default UserProfile;