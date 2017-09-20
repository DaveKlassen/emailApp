var myControllers = (function () {
    'use strict';
    var ctrls = angular.module('myControllers', []);
            
    // When the page loads how do we know which page to make active?
    var setLink = function (link) {
        //console.log(link);
        var l = document.getElementById(link);
        l.className = "navLink activated";
    };
    
    // When the page loads how do we know which page to make active?
    var setNewLink = function (link) {
        
        // Get the last active link and set it to non-active
        var a = document.getElementsByClassName("activated");
        if (a[0]) {
            a[0].className = "navLink notActivated";
        }
        
        setLink(link);
    };    
    
    var setEditUrl = function (firstName, lastName) {
        var url = window.location.href;
        var baseUrl = url.replace(/#.*$/, "");
        var replaceString = "#/email/first/" + firstName + "/last/" + lastName;            
        //console.log(baseUrl);
        var editedUrl = baseUrl + replaceString + "?edit=true"
        
        window.location.assign(editedUrl);
    }

    var setReadOnlyUrl = function (firstName, lastName) {
        var url = window.location.href;
        var baseUrl = url.replace(/#.*$/, "");
        var replaceString = "#/email/first/" + firstName
                                  + "/last/" + lastName
        //console.log(baseUrl);
        var readOnlyUrl = baseUrl + replaceString;
        window.location.assign(readOnlyUrl);
    }
    // Parent controller provides for menu bar and mobile menu bar.
    ctrls.controller('AppCtrl', ['$scope', function ($scope) {
        $scope.title = "Comic Communications";

        /* Highlight currently selected Nav item */
        $scope.normNav = function myFunction(e) {

            // Get the last active link and set it to non-active
            var a = document.getElementsByClassName("activated");
            if (a[0]) {
                a[0].className = "navLink notActivated";
            }
            
            // Set the current event clinked link to active.
            e.target.className = "navLink activated";
            
            // Reset the responsive menu, once an item is selected.
            var x = document.getElementById("myTopnav");
            x.className = "topnav";
        };
        
        /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
        $scope.miniNav = function myFunction() {
            var x = document.getElementById("myTopnav");
            
            // Set the top nav to responsive and active
            console.log(x.className);
            if (x.className === "topnav") {
                x.className += " responsive";
                x.className += " active";
            } else {
                
                // If already active, make non-active
                x.className = "topnav";
            }
        };

        $scope.setActive = function() {
            var url = window.location.href;
            var urlHash = "#" + url.replace(/^.*#/, "");
        
            // Check starts with incase there are parameters
            if (urlHash.startsWith("#/email/first/") ) {
                setLink("contacts");
                return;
            } else if (urlHash.startsWith("#/email/list") ) {
                setLink("contactList");
                return;
            } else if (urlHash.startsWith("#/email/contacts") ) {
                setLink("contacts");
                return;
            } else if (urlHash.startsWith("#/email/about") ) {
                setLink("about");
                return;
            } else {
                setLink("email");
                return;
            }
        }            
    }]);
    
    // For the About page.
    ctrls.controller('AboutCtrl', ['$scope', function ($scope) {
        $scope.content = "This WebApp was made in the AngularJS COMP 2909 course at BCIT by David Klassen. "
                         + "Lots of hints from around the web were used in the making of the App. The "
                         + "following links helped greatly: ";    
    }]);     
    
    // Email controller that allows us to send an email.
    ctrls.controller('EmailCtrl', ['$scope', '$sce', 'emailService', 
                                   function ($scope, $sce, emailService) {
        $scope.email = '';
        $scope.message = '';
        $scope.valid = false;

        $scope.submitEmail = function (input) {
            
            // If valid process the email
            if ( (input.$valid) ) { 
                $scope.valid = true;
                $scope.emailError = "";
                $scope.subjectError = "";
                $scope.messageError = "";
            
                // Using a mailto link to match the spec styling (though likely we should only mimic the style).
                $scope.mailSuccessful = $sce.trustAsHtml(emailService.sendEmail($scope.email));
                //$scope.mailSuccessful = "Your message has been delivered to " + $scope.email;                
            } else {
                
                // Mark the form status as invalid.
                $scope.valid = false; 
                if ( (input.email.$valid === false) ) {                    
                    $scope.emailError   = "* A valid email is required.";
                } else {
                    $scope.emailError = "";
                }
                if (input.subject.$valid === false) {
                    $scope.subjectError = "* A subject is required.";
                } else {
                    $scope.subjectError = "";
                }
                if (input.message.$valid === false) {
                    $scope.messageError = "* A message greater than 3 characters and less than 256 characters is required.";
                } else {
                    $scope.messageError = "";
                }
            }
        };

        /*
         * The rest of this file was not a part of the assignment...
         */
        $scope.searchHints = function () {

            // Get the hint list if it exists
            var x = document.getElementById("HintList");
            if ( (x === undefined) || (x === null) ) {
                
                // Create the hint div
                var div = document.createElement("div");
                div.id = "HintList";
                var contacts = emailService.getAllContacts();
                for (var i = 0; i < contacts.length; i++) {

                    // Add this contact to the hint list.
                    var newHint = emailService.myAddHintFunction(contacts[i].email);
                    div.appendChild(newHint);
                }
                
                // Append it to the parent input field.
                var e = document.getElementById("emailDropdown");                
                e.appendChild(div);
            } else {
                // Remove the drop down hints.
                var z = document.getElementById("HintList").parentElement;
                z.removeChild(x);
            }
        };                                       
    }]);

    // List controller that displays all the contacts we have on hand.
    ctrls.controller('ListCtrl', ['$scope', 'emailService', function ($scope, emailService) {
        $scope.contacts = emailService.getAllContacts();
        
        $scope.selectContact = function (first, last) {
            $scope.selectedContact = emailService.getSpecificContact(first, last);
        }
        $scope.editContact = function (a) {
            
            // Send to edit/update URL 
            setEditUrl(a.firstName, a.lastName);
            
            // and update active link
            setNewLink("contacts");
        };        
    }]);
    
    // Detail Controller - for displaying an individual contact.
    ctrls.controller('DetailCtrl', ['$scope', '$routeParams', 'emailService', 
                                    function ($scope, $routeParams, emailService) {
        var getParameterByName = function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        $scope.editMode = getParameterByName("edit");

        var deck = emailService.getAllContacts();
                                        
        // Define empty object.
        $scope.contact = {};
        // Find card that matches the parameters and assign it to card.
        for (var i = 0; i < deck.length; i++) {
            if (deck[i].firstName == $routeParams.firstName
            && deck[i].lastName == $routeParams.lastName) {
                $scope.contact = deck[i];
                break;
            }
        }
        $scope.firstName = $scope.contact.firstName;
        $scope.lastName = $scope.contact.lastName;
        $scope.email = $scope.contact.email;
        $scope.city = $scope.contact.cityName;
                                        
        $scope.setEditContact = function () {
            
            // Send to edit/update URL
            setEditUrl($scope.firstName, $scope.lastName);
        }   
        $scope.editContact = function (contactId, input) {
            
            // If valid process the email
            if ( (input.$valid) ) { 
                $scope.valid = true;
                $scope.fNameError = "";
                $scope.lNameError = "";                
                $scope.emailError = "";
                $scope.cityError = "";

                // Perform a trivial update.
                emailService.updateContact(contactId, input.firstName.$modelValue, input.lastName.$modelValue, input.email.$modelValue, input.city.$modelValue);                

                // Send to the readonly url
                setReadOnlyUrl(input.firstName.$modelValue, input.lastName.$modelValue);
                $scope.editMode="false";
            } else {
                
                // Mark the form status as invalid.
                $scope.valid = false; 
                if (input.firstName.$valid === false) {
                    $scope.fNameError = "* A first name is required.";
                } else {
                    $scope.fNameError = "";
                }
                if (input.lastName.$valid === false) {
                    $scope.lNameError = "* A last name is required.";
                } else {
                    $scope.lNameError = "";
                }                
                if ( (input.email.$valid === false) ) {
                    $scope.emailError   = "* A valid email is required.";
                } else {
                    $scope.emailError = "";
                }
                if (input.city.$valid === false) {
                    $scope.cityError = "* A city name is required.";
                } else {
                    $scope.cityError = "";
                }
            }
        };                                              
    }]);
    
    // Contact controller allows for creating new contacts
    ctrls.controller('ContactsCtrl', ['$scope', '$sce', 'emailService', 
                                        function ($scope, $sce, emailService) {        
        $scope.submitContact = function (input) {
            
            // If valid process the email
            if ( (input.$valid) ) { 
                $scope.valid = true;
                $scope.fNameError = "";
                $scope.lNameError = "";                
                $scope.emailError = "";
                $scope.cityError = "";
            
                // Using a link to allow the user to see what they have just entered.
                var link = emailService.createLink($scope.firstName, input.lastName.$modelValue)
                $scope.contactSuccessful = $sce.trustAsHtml(link);

                // Add to list and display contact in read only mode.
                emailService.addContact($scope.firstName, $scope.lastName, $scope.email, $scope.city);
                setReadOnlyUrl($scope.firstName, $scope.lastName);
            } else {
                
                // Mark the form status as invalid.
                $scope.valid = false; 
                if (input.firstName.$valid === false) {
                    $scope.fNameError = "* A first name is required.";
                } else {
                    $scope.fNameError = "";
                }
                if (input.lastName.$valid === false) {
                    $scope.lNameError = "* A last name is required.";
                } else {
                    $scope.lNameError = "";
                }                
                if ( (input.email.$valid === false) ) {
                    $scope.emailError   = "* A valid email is required.";
                } else {
                    $scope.emailError = "";
                }
                if (input.city.$valid === false) {
                    $scope.cityError = "* A city name is required.";
                } else {
                    $scope.cityError = "";
                }
            }            
        };
    }]);  
    
    return ctrls;
}());
