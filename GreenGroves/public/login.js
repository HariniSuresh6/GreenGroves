$scope.submitLogin = function() {
    var loginData = {
        email: $scope.email,
        password: $scope.password
    };

    console.log('Login Data:', loginData); // Debugging line

    $http.post('https://iasf2025.onrender.com/api/login', loginData)
    .then(function(response) {
        if (response.data.message === 'Login successful') {  // Check for success
            alert('Login successful!');

            // Store the organisation's name in localStorage
            localStorage.setItem('organizationName', response.data.name); 

            // Redirect to the respective homepage
            window.location.href = 'welcome.html';  
        } else {
            alert('Login failed: ' + response.data.message);
        }
    })
    .catch(function(error) {
        console.error('Error during login:', error);
        alert('Error during login: ' + (error.data ? error.data.message : error.message));
    });

};
