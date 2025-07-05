var myApp = angular.module('myApp', []);

// Registration service to manage registration data
myApp.factory('RegistrationService', function($http) {
    var baseUrl = 'https://iasf2025.onrender.com/api/register';  // Your backend API base URL
    
    return {
        addRegistration: function(registration) {
            return $http.post(baseUrl, registration);
        },
        getRegistrations: function() {
            return $http.get(baseUrl);
        },
        removeRegistration: function(id) {
            return $http.delete(baseUrl + '/' + id);
        },
        updateRegistration: function(id, updatedData) {
            return $http.put(baseUrl + '/' + id, updatedData);
        }
    };
});

// Controller to manage registrations
myApp.controller('myCtrl', function($scope, RegistrationService) {
    $scope.changeName = function() {
        $scope.name = "";
    };

    // Pre-fill form fields
    $scope.role = "student";
    $scope.orgname = "tce";
    $scope.emaill = "abc@student.tce.edu";

    $scope.selectedUser = null;

    // Handle form submission
    $scope.submitForm = function() {
        if ($scope.registrationForm.$valid) {
            var registration = {
                name: $scope.name,
                role: $scope.role,
                orgname: $scope.orgname,
                emaill: $scope.emaill,
                password: $scope.password
            };
            RegistrationService.addRegistration(registration)
                .then(function() {
                    alert("Registration successful!");
                    $scope.resetForm();
                    $scope.loadRegistrations();
                })
                .catch(function(err) {
                    console.error('Error registering user:', err);
                });
        }
    };

    $scope.editRegistration = function(user) {
        $scope.selectedUser = user;
        $scope.name = user.name;
        $scope.role = user.role;
        $scope.orgname = user.orgname;
        $scope.emaill = user.emaill;
        $scope.password = user.password;
        $scope.confirmPassword = user.password;
    };

    $scope.updateRegistration = function() {
        if ($scope.registrationForm.$valid && $scope.selectedUser) {
            var updatedData = {
                name: $scope.name,
                role: $scope.role,
                orgname: $scope.orgname,
                emaill: $scope.emaill,
                password: $scope.password
            };
            RegistrationService.updateRegistration($scope.selectedUser._id, updatedData)
                .then(function() {
                    alert("User updated successfully!");
                    $scope.resetForm();
                    $scope.loadRegistrations();
                })
                .catch(function(err) {
                    console.error('Error updating user:', err);
                });
        }
    };

    $scope.resetForm = function() {
        $scope.name = '';
        $scope.role = '';
        $scope.orgname = '';
        $scope.emaill = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.selectedUser = null;
    };

    $scope.loadRegistrations = function() {
        RegistrationService.getRegistrations()
            .then(function(response) {
                $scope.registrations = response.data;
            })
            .catch(function(err) {
                console.error('Error fetching registrations:', err);
            });
    };

    $scope.removeRegistration = function(id) {
        RegistrationService.removeRegistration(id)
            .then(function() {
                alert("User removed successfully!");
                $scope.loadRegistrations();
            })
            .catch(function(err) {
                console.error('Error removing user:', err);
            });
    };

    // Initial load of registrations
    $scope.loadRegistrations();
});

