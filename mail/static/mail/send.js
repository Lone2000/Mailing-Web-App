document.addEventListener("DOMContentLoaded", function () {

    document.querySelector("#compose-form").addEventListener("submit",
        (event) => {
            // For Testing & console.log Results
            event.preventDefault()

            // Get Input Values
            const recipients = document.querySelector('#compose-recipients');
            const subject = document.querySelector('#compose-subject');
            const body = document.querySelector('#compose-body');


            // API Fetch
            fetch('/emails', {
                method: 'POST',
                body: JSON.stringify({
                    recipients: recipients.value,
                    subject: subject.value,
                    body: body.value
                }),
            })
                .then(response => response.json())
                .then(result => {
                    if (result.message === "Email sent successfully.") {
                        // Print result
                        console.log(result);
                        load_mailbox("sent");
                    } else {
                        console.log(result["error"]);
                        load_mailbox("inbox")
                    }
                });

        });

});