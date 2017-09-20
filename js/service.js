emailApp.factory("emailService",  function () {

    /* Create a Email Link that can be clicked after submit. */
    var sendEmail = function (emailAddress) {

        // Inserting a underlined mailto link is not possible?
        return("Your message has been delivered to <a href='mailto:" + emailAddress + "'> " + emailAddress + "</a>");
        //return("Your message has been delivered to " + emailAddress);            
    };    

    /*
     * The rest of this file was not a part of the assignment...
     *
     * Create a Contact Link that can be viewed after creation.
     */
    var createLink = function (first, last) {
        var name = first + " " + last;
        var link = "#/email/first/" + first + "/last/" + last;
        return("You created contact: <a href='" + link + "'> " + name + "</a>");
    };
    
    /* This data cannot be changed */
    var contacts = [{"id":0,"firstName":"Mickey","lastName":"Mouse","email":"mickey@disney.com","cityName":"Kansas City"},
                    {"id":1,"firstName":"Bat","lastName":"Man","email":"batarang@dc.com", "cityName":"Gotham"},
                    {"id":2,"firstName":"Spider","lastName":"Man","email":"spidey@marvel.com","cityName":"New York"}, 
                    {"id":3,"firstName":"Hell","lastName":"Boy","email":"anung@darkhorse.com","cityName":"San Diego"}];

    /* Get all Contact records. */
    var getAllContacts = function() {
            return(contacts);
    };
    
    /* Get the information for a specific contact */
    var getSpecificContact = function (first, last) {
        // Define empty object.
        var contact = {};

        // Find card that matches the parameters and assign it to card.
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].firstName == first && contacts[i].lastName == last) {
                contact = contacts[i];
                break;
            }
        }

        return(contact);
    };    

    /* Add a new Contact */
    var addContact = function (first, last, email, city) {

        // Fill in a Contact Object.
        var contact = {
                        "id"       : contacts.length,
                        "firstName": first,
                        "lastName" :  last,
                        "email"    : email,
                        "cityName" : city
                       };

        return(contacts.push(contact));
    };
    /* Update a Contact */
    var updateContact = function (id, first, last, email, city) {
        var contact = contacts[id];
        
        // Fill in a Contact Object.
        contact["firstName"] = first;
        contact["lastName"] = last;
        contact["email"] = email;
        contact["cityName"] = city;

        contacts[id] = contact;
    };    
    
    /* Trigger an event so angular knows what you've done. */
    var myTriggerAngularEventFunc = function (el, type){
       if ('createEvent' in document) {
            // modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, true, false);
            el.dispatchEvent(e);
        } else {
            // IE 8
            var e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on'+e.eventType, e);
        }
    };
    
    /* Add a hint below the email field for the user to select. */
    var myAddHintFunction = function (email) {
        var that = this;
        
        // Create the hint
        var y = document.createElement("div");
        var textnode = document.createTextNode(email);
        y.appendChild(textnode);
        y.className = "hint";

        // If the hint is clicked 
        y.addEventListener("click", function(emailField){

            // Change the email input element
            var data = y.childNodes[0].nodeValue;
            var e = document.getElementById("emailInput");
            e.value = data;

            // Trigger change event on the element so angular can adjust.
            that.myTriggerAngularEventFunc(e, 'change');                    

            // Remove the drop down hints.
            var z = document.getElementById("HintList").parentElement;
            var x = document.getElementById("HintList");
            z.removeChild(x);
        });

        return(y);
    };
    
    /* These are the service/methods available */
    return {
        sendEmail : sendEmail,
        createLink: createLink,
        getAllContacts : getAllContacts,
        addContact: addContact,
        updateContact: updateContact,
        getSpecificContact : getSpecificContact,
        myTriggerAngularEventFunc : myTriggerAngularEventFunc,
        myAddHintFunction : myAddHintFunction 
    };
});
