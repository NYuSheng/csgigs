import React from 'react';

var UserProfile = (function() {

    var login = function(user) {
        user.me.username = "logintest";
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

    var getAuthSet = function() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        var authSet = {};
        authSet["token"] = user.authToken;
        authSet["userId"] = user.userId;
        return authSet;
    }

    var getUser = function() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user;
    }

    return {
        login: login,
        authenticate: authenticate,
        getAuthSet: getAuthSet,
        getUser: getUser
    }

})();

export default UserProfile;