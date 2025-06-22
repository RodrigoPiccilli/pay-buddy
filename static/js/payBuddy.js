// Sender Details Constants
const senderFirstName = document.querySelector("#sender-first-name");
const senderLastName = document.querySelector("#sender-last-name");
const imageUpload = document.querySelector("#image-upload-native");

// Recipient Details Constants
const recipientFirstName = document.querySelector("#recipient-first-name");
const recipientLastName = document.querySelector("#recipient-last-name");
const message = document.querySelector("#recipient-message");
const notificationMethods = document.querySelectorAll("#notifications input");
const recipientEmailButton = document.querySelector("#email");
const recipientPhoneButton = document.querySelector("#SMS");
const recipientEmailField = document.querySelector(".email");
const recipientPhoneField = document.querySelector(".phone-number");
const recipientEmailInput = document.querySelector("#recipient-email");
const recipientPhoneInput = document.querySelector("#recipient-number");

// Payment Details Constants
const creditCardType = document.querySelector("#credit-card-type");
const creditCardNumber = document.querySelector("#recipient-card");
const creditCardExpiration = document.querySelector("#expiration-date");
const creditCardCCV = document.querySelector("#card-ccv");
const transactionAmount = document.querySelector("#amount");

// Terms and Conditions Check Button
const termsAndConditions = document.querySelector("#terms-conditions-input");

// Submit Button for Form Validation
const submitButton = document.querySelector("#submit-button");

// Image Upload File Validation
imageUpload.addEventListener("change", () => {

    const file = imageUpload.files[0];
    const maxSize = 200 * 1024; 
    const invalidFile = document.querySelector("#invalid-file");
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const invalidSize = document.querySelector("#invalid-size");
    const noImage = document.querySelector("#no-image");

    if (file) {

        invalidSize.classList.add("collapse");
        invalidFile.classList.add("collapse");
        noImage.classList.add("collapse");

        if (!validTypes.includes(file.type)) {

            invalidFile.classList.remove("collapse");
            imageUpload.value = ""; 
            document.querySelector("#image-preview").src = "";
            document.querySelector("#image-preview").classList.remove("valid-image");
            return;

        } else if(file.size > maxSize) {

            invalidSize.classList.remove("collapse");
            imageUpload.value = "";
            document.querySelector("#image-preview").src = "";
            document.querySelector("#image-preview").classList.remove("valid-image");
            return;

        } else {

            invalidSize.classList.add("collapse");
            invalidFile.classList.add("collapse");
            document.querySelector("#image-preview").classList.add("valid-image");

        }

    }
});

// Preview Image Function
function previewImage(event) {

    let input = event.target;
    let image = document.querySelector("#image-preview");
    if (input.files && input.files[0]) {
       let reader = new FileReader();
       reader.onload = function(e) {
          image.src = e.target.result;
       }
       reader.readAsDataURL(input.files[0]);
    }

}

// Preview Image Event Listener
imageUpload.addEventListener("change", previewImage);

let notificationMethod = "none";

// Event Listener to Display Appropriate Notification Method Field
notificationMethods.forEach(method => { 
    method.addEventListener("change", event => {
        if(event.target.checked) {
            switch (event.target.value) {
                case "Email":
                    recipientEmailField.classList = "email";
                    recipientPhoneField.classList = "phone-number collapse";
                    notificationMethod = "email";
                    recipientEmailInput.setAttribute("required", "true");
                    recipientEmailInput.setAttribute("name", "recipient-email");
                    recipientPhoneInput.removeAttribute("required");
                    recipientPhoneInput.removeAttribute("name");
                    break;
        
                case "SMS":
                    recipientPhoneField.classList = "phone-number";
                    recipientEmailField.classList = "email collapse";
                    notificationMethod = "SMS";
                    recipientPhoneInput.setAttribute("required", "true");
                    recipientPhoneInput.setAttribute("name", "recipient-phone");
                    recipientEmailInput.removeAttribute("required");
                    recipientEmailInput.removeAttribute("name");
                    break;
    
                default:
                    recipientEmailField.classList = "email collapse";
                    recipientPhoneField.classList = "phone-number collapse";
                    notificationMethod = "none";
                    recipientEmailInput.removeAttribute("required");
                    recipientEmailInput.removeAttribute("name");
                    recipientPhoneInput.removeAttribute("required");
                    recipientPhoneInput.removeAttribute("name");
            }
        }
    });
});

// Event Listener for Terms and Conditions to Trigger Frontend Validation.
termsAndConditions.addEventListener("change", () => {

    if(senderFirstName.value === "") {

        senderFirstName.setCustomValidity("Please Enter Sender First Name.");
        senderFirstName.reportValidity();
        termsAndConditions.checked = false;

        senderFirstName.addEventListener("keydown", () => {
            senderFirstName.setCustomValidity("");
        });

    } else if(senderLastName.value === "") {

        senderLastName.setCustomValidity("Please Enter Sender Last Name.");
        senderLastName.reportValidity();
        termsAndConditions.checked = false;

        senderLastName.addEventListener("keydown", () => {
            senderLastName.setCustomValidity("");
        });

    } else if(imageUpload.files.length === 0) {

        document.querySelector("#no-image").classList = "upload-error";
        termsAndConditions.checked = false;

    } else if(recipientFirstName.value === "") {
        recipientFirstName.setCustomValidity("Please Enter Recipient First Name.");
        recipientFirstName.reportValidity();
        termsAndConditions.checked = false;

        recipientFirstName.addEventListener("keydown", () => {
            recipientFirstName.setCustomValidity("");
        });

    } else if(recipientLastName.value === "") {

        recipientLastName.setCustomValidity("Please Enter Recipient Last Name.");
        recipientLastName.reportValidity();
        termsAndConditions.checked = false;

        recipientLastName.addEventListener("keydown", () => {
            recipientLastName.setCustomValidity("");
        });

    } else if(message.value === "") {

        message.setCustomValidity("Please Enter Recipient Message");
        message.reportValidity();
        termsAndConditions.checked = false;

        message.addEventListener("keydown", () => {
            message.setCustomValidity("");
        });

    } else if(message.value.length < 10) {

        message.setCustomValidity("Message must be at least 10 characters long.");
        message.reportValidity();
        termsAndConditions.checked = false;

        message.addEventListener("keydown", () => {
            message.setCustomValidity("");
        });

    } else if(notificationMethod === "email" && recipientEmailInput.value === "") {

        recipientEmailInput.setCustomValidity("Please Enter Recipient Email.");
        recipientEmailInput.reportValidity();
        termsAndConditions.checked = false;

        recipientEmailInput.addEventListener("keydown", () => {
            recipientEmailInput.setCustomValidity("");
        });

    } else if(notificationMethod === "SMS" && recipientPhoneInput.value === "") {

        recipientPhoneInput.setCustomValidity("Please Enter Recipient Phone Number.");
        recipientPhoneInput.reportValidity();
        termsAndConditions.checked = false;

        recipientPhoneInput.addEventListener("keydown", () => {
            recipientPhoneInput.setCustomValidity("");
        });

    } else if(creditCardType.value === "") {

        creditCardType.setCustomValidity("Please Select Card Type.");
        creditCardType.reportValidity();
        termsAndConditions.checked = false;

        creditCardType.addEventListener("click", () => {

            creditCardType.setCustomValidity("");

        });

    } else if(creditCardNumber.value === "") {

        creditCardNumber.setCustomValidity("Please Enter Card Number.");
        creditCardNumber.reportValidity();
        termsAndConditions.checked = false;

        creditCardNumber.addEventListener("keydown", () => {
            creditCardNumber.setCustomValidity("");
        });

    } else if(creditCardExpiration.value === "") {

        creditCardExpiration.setCustomValidity("Please Enter Card Expiration Date.");
        creditCardExpiration.reportValidity();
        termsAndConditions.checked = false;

        creditCardExpiration.addEventListener("keydown", () => {
            creditCardExpiration.setCustomValidity("");
        });

    } else if(creditCardCCV.value === "") {

        creditCardCCV.setCustomValidity("Please Enter Card CCV.");
        creditCardCCV.reportValidity();
        termsAndConditions.checked = false;

        creditCardCCV.addEventListener("keydown", () => {
            creditCardCCV.setCustomValidity("");
        });

    } else if(transactionAmount.value === "") {

        transactionAmount.setCustomValidity("Please Enter Payment Amount.");
        transactionAmount.reportValidity();
        termsAndConditions.checked = false;

        transactionAmount.addEventListener("keydown", () => {
            transactionAmount.setCustomValidity("");
        });

    } 
    
})

// Submit Button Event Listener to Trigger Terms and Conditions Frontend Validation.
submitButton.addEventListener("click", () => {

    if(termsAndConditions.checked === false) {

        termsAndConditions.setCustomValidity("You Must Agree to Our Terms and Conditions.");
        termsAndConditions.reportValidity();
        termsAndConditions.checked = false;

        termsAndConditions.addEventListener("change", () => {
            termsAndConditions.setCustomValidity("");
            termsAndConditions.checked = true;

        });
    }


})






