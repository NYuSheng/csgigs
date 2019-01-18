const UserProfile = (function() {
  const login = function(user) {
    fetch(
      `https://csgigs.com/api/v1/users.getAvatar?username=${user.me.username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    ).then(output => {
      if (output.status === 200) {
        user.me.avatar = output.url;
      } else {
        // eslint-disable-next-line no-console
        console.log("Error - User avatar not found");
      }
      sessionStorage.setItem("user", JSON.stringify(user));
    });
  };
  //test

  const authenticate = function() {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (exception) {
      return false;
    }
  };

  const getAuthSet = function() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const authSet = { token: user.authToken, userId: user.userId };
    return authSet;
  };

  const getUser = function() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user;
  };

  return {
    login: login,
    authenticate: authenticate,
    getAuthSet: getAuthSet,
    getUser: getUser
  };
})();

export default UserProfile;
