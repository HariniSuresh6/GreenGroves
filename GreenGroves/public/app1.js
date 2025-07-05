var MyApp = angular.module("MyApp", []);

// Application service to manage application data
MyApp.factory('ApplicationService', function($http) {
    return {
        addDetails: function(application) {
            return $http.post('https://iasf2025.onrender.com/api/applications', application);
        },
        getDetails: function() {
            return $http.get('https://iasf2025.onrender.com/api/applications');
        },
        removeDetails: function(id) {
            return $http.delete('https://iasf2025.onrender.com/api/applications/' + id);
        },
        updateDetails: function(id, application) {
            return $http.put('https://iasf2025.onrender.com/api/applications/' + id, application);
        }
    };
});

// Logging service to log activities
MyApp.factory('LoggingService', function() {
    return {
        log: function(message) {
            console.log(new Date().toISOString() + ": " + message);
        }
    };
});

// Notification service to show notifications
MyApp.factory('NotificationService', function() {
    return {
        notify: function(message) {
            alert(message);
        }
    };
});

// Controller to manage applications
MyApp.controller("myCtrl", function($scope, $timeout, ApplicationService, LoggingService, NotificationService) {
    $scope.submitted = false;
    $scope.editMode = false;

    let editIndex = -1;

    // // Set session timeout duration (10000 milliseconds for demonstration)
    // var sessionTimeoutDuration = 10000;

    // // Set session timeout
    // $timeout(function () {
    //     NotificationService.notify('Your session is going to time out.');
    // }, sessionTimeoutDuration);

    // Load existing applications
    ApplicationService.getDetails().then(function(response) {
        const loggedInName = localStorage.getItem('userName');
        $scope.applications = response.data.filter(function(event) {
            return event.fname === loggedInName;
        });
        }).catch(function(error) {
        LoggingService.log("Error fetching applications: " + error.message);
    });

    $scope.submitForm = function() {
        if ($scope.applicationForm.$valid) {
            var application = {
                fname: $scope.fname,
                purpose: $scope.purpose,
                purposeName: $scope.purposeName,
                email: $scope.email,
                phone: $scope.phone,
                address: $scope.address
            };

            if ($scope.editMode) {
                var applicationId = $scope.applications[editIndex]._id;
                ApplicationService.updateDetails(applicationId, application).then(function(response) {
                    LoggingService.log("Application updated: " + JSON.stringify(application));
                    NotificationService.notify("Application updated successfully!");
                    $scope.submitted = true;
                    $scope.resetForm();
                    $scope.applications[editIndex] = response.data; // Update the list with the edited application
                    $scope.editMode = false;
                }).catch(function(error) {
                    LoggingService.log("Error updating application: " + error.message);
                    NotificationService.notify("Error updating application. Please try again.");
                });
            } else {
                ApplicationService.addDetails(application).then(function(response) {
                    LoggingService.log("Application submitted: " + JSON.stringify(application));
                    NotificationService.notify("Application submitted successfully!");
                    $scope.submitted = true;
                    $scope.resetForm();
                    $scope.applications.push(response.data); // Update the list with the new application
                }).catch(function(error) {
                    LoggingService.log("Error submitting application: " + error.message);
                    NotificationService.notify("Error submitting application. Please try again.");
                });
            }
        } else {
            LoggingService.log("Application form is invalid");
            NotificationService.notify("Please fill out the form correctly.");
        }
    };

    $scope.resetForm = function() {
        $scope.fname = '';
        $scope.purpose = '';
        $scope.purposeName = '';
        $scope.email = '';
        $scope.phone = '';
        $scope.address = '';
        $scope.applicationForm.$setPristine();
        $scope.applicationForm.$setUntouched();
    };

    $scope.removeDetails = function(index) {
        var applicationId = $scope.applications[index]._id;
        ApplicationService.removeDetails(applicationId).then(function() {
            LoggingService.log("Application removed at index: " + index);
            NotificationService.notify("Application removed successfully!");
            $scope.applications.splice(index, 1); // Remove from the list
        }).catch(function(error) {
            LoggingService.log("Error removing application: " + error.message);
            NotificationService.notify("Error removing application. Please try again.");
        });
    };

    $scope.editDetails = function(index) {
        const application = $scope.applications[index];
        $scope.fname = application.fname;
        $scope.purpose = application.purpose;
        $scope.purposeName = application.purposeName;
        $scope.email = application.email;
        $scope.phone = application.phone;
        $scope.address = application.address;
        $scope.editMode = true;
        editIndex = index;
    };

    // Navigation function
    $scope.navigateTo = function(page) {
        window.location.href = page;
    };
});
