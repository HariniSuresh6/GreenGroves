var app = angular.module('myApp', []);

app.controller('registrationController', function($scope, $http) {
    $scope.registrations = [];

    $scope.submitForm = function() {
        var userData = {
            name: $scope.name,
            role: $scope.role,
            orgname: $scope.orgname,
            emaill: $scope.emaill,
            password: $scope.password
        };

        $http.post('https://iasf2025.onrender.com/api/register', userData)
            .then(function(response) {
                alert('Registration successful!');
                $scope.getRegistrations();
                $scope.resetForm();
            })
            .catch(function(error) {
                console.error('Error during registration:', error);
                alert('Error during registration: ' + (error.data ? error.data.message : error.message));
            });
    };

    $scope.getRegistrations = function() {
        $http.get('https://iasf2025.onrender.com/api/register')
            .then(function(response) {
                $scope.registrations = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching registrations:', error);
            });
    };

    $scope.removeRegistration = function(id) {
        $http.delete('https://iasf2025.onrender.com/api/register/' + id)
            .then(function() {
                $scope.getRegistrations();
            })
            .catch(function(error) {
                console.error('Error removing registration:', error);
            });
    };

    $scope.editRegistration = function(registration) {
        $scope.selectedUser = registration;
        $scope.name = registration.name;
        $scope.role = registration.role;
        $scope.orgname = registration.orgname;
        $scope.emaill = registration.emaill;
        $scope.password = registration.password;
        $scope.confirmPassword = registration.password;
    };

    $scope.updateRegistration = function() {
        var userData = {
            name: $scope.name,
            role: $scope.role,
            orgname: $scope.orgname,
            emaill: $scope.emaill,
            password: $scope.password
        };

        $http.put('https://iasf2025.onrender.com/api/register/' + $scope.selectedUser._id, userData)
            .then(function(response) {
                alert('Update successful!');
                $scope.getRegistrations();
                $scope.resetForm();
            })
            .catch(function(error) {
                console.error('Error updating registration:', error);
                alert('Error updating registration: ' + (error.data ? error.data.message : error.message));
            });
    };

    $scope.resetForm = function() {
        $scope.name = '';
        $scope.role = '';
        $scope.orgname = '';
        $scope.emaill = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.checked = false;
        $scope.selectedUser = null;
    };

    $scope.getRegistrations();
});
