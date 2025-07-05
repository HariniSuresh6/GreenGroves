var app = angular.module('myApp', []);
var homeButton = document.getElementById('home-button');
homeButton.addEventListener('click', function() {
    scope.navigateTo('home.html');
});
// Define the controller
app.controller('orderCtrl', function($scope, $http) {
    $scope.opportunities = [];
    $scope.newService = {
        title: '',
        organizationName: '',
        date: '',
        description: ''
    };

    // Fetch volunteering opportunities (Read)
    $scope.loadOpportunities = function() {
        $http.get('https://iasf2025.onrender.com/services')
            .then(function(response) {
                $scope.opportunities = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching opportunities:', error);
            });
    };

    // Add a new volunteering service (Create)
    $scope.addNewService = function() {
        $http.post('https://iasf2025.onrender.com/services', $scope.newService)
            .then(function(response) {
                alert('Service added successfully!');
                $scope.newService = {}; // Reset the form
                $scope.loadOpportunities(); // Refresh the list
            })
            .catch(function(error) {
                console.error('Error adding service:', error);
            });
    };

    // Delete a volunteering service (Delete)
    $scope.deleteService = function(serviceId) {
        $http.delete('https://iasf2025.onrender.com/services/' + serviceId)
            .then(function(response) {
                alert('Service deleted successfully!');
                $scope.loadOpportunities(); // Refresh the list
            })
            .catch(function(error) {
                console.error('Error deleting service:', error);
            });
    };

    // Load opportunities on page load
    $scope.loadOpportunities();

    // Function to handle navigation
    $scope.navigateTo = function(url) {
        location.href = url;
    };
});
