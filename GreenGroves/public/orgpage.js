var app = angular.module('myApp', ['ngAnimate']);

app.controller('myCtrl', function($scope, $timeout) {
    $scope.today = new Date();

    $scope.organs = [
        { 
            title: 'Greenpeace',
            location: 'Chennai',
            image: 'https://i.pinimg.com/originals/ea/d4/d4/ead4d428b35dcd3d7c9e9505e62987c4.jpg'
        },
        { 
            title: 'Rainforest Alliance',
            location: 'Thiruvananthapuram',
            image: 'https://www.rainforest-alliance.org/wp-content/uploads/2021/07/Rainforest-Alliance-logo_and_new_seal.png'
        },
        { 
            title: 'The Nature Conservancy',
            location: 'Chennai',
            image: 'https://logowik.com/content/uploads/images/the-nature-conservancy6389.logowik.com.webp'
        },
        { 
            title: 'Ceres',
            location: 'Coimbatore',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_HecKnsnlUW23oW3VncV_9RnPhtslNgjm0g&s'
        },
        { 
            title: 'Sierra Club',
            location: 'Chennai',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPPGd38ZVkNyBQ94Xy6UG1tqNaGv2Wag5hCChe3nleAaYHIgGqeqNDdSnrCB4hGUku8GM&usqp=CAU'
        },
        { 
            title: 'World Wide Fund for Nature',
            location: 'Erode',
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/WWF_logo.svg/1200px-WWF_logo.svg.png'
        }
    ];

    $scope.apply = function(organ) {
        organ.expanded = true;

        // Reset expanded after animation
        $timeout(function() {
            organ.expanded = false;
        }, 2000); // Adjust this timing to match the animation duration
    };

    $scope.navigateTo = function(url) {
        window.location.href = url;
    };
});
