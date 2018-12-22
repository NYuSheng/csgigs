var UserProfile = (function() {

    var login = function(user) {
        fetch(`https://csgigs.com/api/v1/users.getAvatar?username=${user.me.username}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(output => {
            if (output.status === 200) {
                user.me.avatar = output.url;
            } else {
                console.log("Error - User avatar not found");
            }
            sessionStorage.setItem('user', JSON.stringify(user))
        })
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