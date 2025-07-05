var myApp = angular.module('myApp', []);

// Registration service to manage registration data
myApp.factory('RegistrationService', function() {
    var registrations = [];

    return {
        addRegistration: function(registration) {
            registrations.push(registration);
        },
        getRegistrations: function() {
            return registrations;
        },
        removeRegistration: function(index) {
            registrations.splice(index, 1);
        }
    };
});

// Controller to manage registrations
myApp.controller('myCtrl', function($scope, RegistrationService) {
    // Pre-fill form fields for demonstration; remove if not needed
    $scope.role = "student";
    $scope.orgname = "tce";
    $scope.emaill = "sabinaya3@student.tce.edu";

    // Handle form submission
    $scope.submitForm = function() {
        if ($scope.registrationForm.$valid && $scope.passwordsMatch()) {
            var registration = {
                name: $scope.name,
                role: $scope.role,
                orgname: $scope.orgname,
                emaill: $scope.emaill,
                password: $scope.password
            };
            RegistrationService.addRegistration(registration);
            alert("Registration successful!");
            $scope.resetForm(); // Reset form after successful registration
        } else {
            alert("Please fill out the form correctly.");
        }
    };

    // Password match validation
    $scope.passwordsMatch = function() {
        return $scope.password === $scope.confirmPassword;
    };

    // Reset form fields
    $scope.resetForm = function() {
        $scope.name = '';
        $scope.role = '';
        $scope.orgname = '';
        $scope.emaill = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.checked = false;
        $scope.registrationForm.$setPristine();
        $scope.registrationForm.$setUntouched();
    };

    // Change name action
    $scope.changeName = function() {
        $scope.name = "abi";
    };

    // Retrieve registrations from service
    $scope.registrations = RegistrationService.getRegistrations();

    // Remove registration
    $scope.removeRegistration = function(index) {
        RegistrationService.removeRegistration(index);
    };
});
