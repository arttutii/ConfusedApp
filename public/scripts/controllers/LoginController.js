'use strict';

var app = angular.module('ConfusedApp');
app.controller('LoginController',function($scope, $rootScope, $log, VariableFactory, $state){
    // Variable for showing elements if the user is logged in
    $scope.loggedIn = false;
    // User object of parent
    $scope.parent = {};

    // Check if the user object is already in the session storage
    if(sessionStorage.getItem('user')){
        // If true, set variables depending on the value
        $scope.loggedIn = true;
        $scope.parent = VariableFactory.user = JSON.parse(sessionStorage.getItem('user'));
        $scope.selectedChild = $scope.parent.children[0];
    }

    $scope.login = () => {
    // HTTPS API calls won't work on Jelastic at the moment, so hard code child user objects
        const res = {
        name: 'Matti Meikäläinen',
        age: 35,
        children: 
        [ 
            {
                // Personal information
                name: 'Jussi Meikäläinen',
                age: 7,
                gender: 'Mies',
                birthDate: '08-03-2010',
                birthPlace: 'Helsinki, Finland',
                residence: 'Helsinki',
                address: 'Junailijankuja 7',
                postalCode: '00520 HELSINKI',
                phone: null,
                email: null,
                // Education
                currentEducationName: 'Päiväkoti Meripirtti',
                currentEducationPeriod: '20-04-2008 - 01-01-2011',
                currentEducationContact: {
                    phone: 'Puhelin: 09 3102 9904',
                    address: 'Merimiehenkatu 43, 00150 Helsinki',
                    email: 'Sähköposti: pk.meripirtti@hel.fi',
                    principal: 'Johtaja: Riitta Tähtilaakso, puh. 09 3102 9904',
                    principalEmail: 'Sähköposti: riitta.tahtilaakso@hel.fi',
                },
                currentEducationHomepage: 'https://www.hel.fi/helsinki/fi/kasvatus-ja-koulutus/paivahoito/paivakotihoito/paivakodit/paivakoti-meripirtti',
            },
            {
                // Personal information
                name: 'Ossi Meikäläinen',
                age: 6,
                gender: 'Mies',
                birthDate: '15-01-2011',
                birthPlace: 'Helsinki, Finland',
                residence: 'Helsinki',
                address: 'Junailijankuja 7',
                postalCode: '00520 HELSINKI',
                phone: null,
                email: null,
                // Education
                currentEducationName: 'Päiväkoti Meripirtti',
                currentEducationPeriod: '20-04-2008 - 01-01-2011',
                currentEducationContact: {
                    phone: 'Puhelin: 09 3102 9904',
                    address: 'Merimiehenkatu 43, 00150 Helsinki',
                    email: 'Sähköposti: pk.meripirtti@hel.fi',
                    principal: 'Johtaja: Riitta Tähtilaakso, puh. 09 3102 9904',
                    principalEmail: 'Sähköposti: riitta.tahtilaakso@hel.fi',
                },
                currentEducationHomepage: 'https://www.hel.fi/helsinki/fi/kasvatus-ja-koulutus/paivahoito/paivakotihoito/paivakodit/paivakoti-meripirtti',
            
            }

        ]
    };
            //console.log(res);
            // save user object in the factory and in the scope
            $scope.parent = VariableFactory.user = res;
            // set the child select default value as the first child of the user
            $scope.selectedChild = $scope.parent.children[0];

            // after successful log in, change loggedIn variable state that some elements show/hide.
            // also toggle the popup to close it
            $scope.loggedIn = true;
            $('#loginBtn').click();

            // save the user in the session storage
            sessionStorage.setItem('user', JSON.stringify(res));

            // Direct the user if they are on any other view than map
            if(!$state.is('map')) {
                $state.go('map');
            }

    }

    $scope.logout = () => {
        $scope.loggedIn = false;
        // if the user is at any other page, redirect them to map page
        if (!$state.is('map')) {$state.go('map')};

        // Trigger the closing of the user menu
        $('#userBtn').click();
        
        // Clear the user object from the session storage
        sessionStorage.clear();
    }


});