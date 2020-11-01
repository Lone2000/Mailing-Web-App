document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox("inbox"));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox("sent"));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox("archive"));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // Listen For Button Click

  // By default, load the inbox

  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';

  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-view").style.display = "none";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Specification MailBox API 
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then((emails) => {
      // Print emails
      console.log("Called")
      console.log(emails);
      // Create Email Element
      emails.forEach(email => {
        // Create Email Div 
        const element = document.createElement('div');
        // Default Class's On div
        element.className = "row border p-3 text-dark";
        element.innerHTML = `
        <div class="col">From: ${email.sender}</div>
        <div class="col">Subject: ${email.subject}</div> 
        <div class="col">Date: ${email.timestamp}</div>
        <button id="read">View</buttom>
        `;

        // Make Read Email as a darker Shade + font Weights
        element.classList.toggle("bg-light", email.read);
        element.classList.toggle("font-weight-bold", !email.read);

        // Target The parent element + Display it to the Parentelement
        const parentE = document.querySelector("#emails-view");
        parentE.appendChild(element);

        document.querySelector("#read").addEventListener('click', (e) => {
          email_view(email.id);
        });

      });




      // ... do something else with emails ...
    });

}

// Individual Email views
function email_view(id) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-view").style.display = "block";

  // Empty The Inner Html of Email_view Div or email will duplicate
  parentDiv = document.querySelector("#email-view");
  parentDiv.innerHTML = ``;

  // 'Put' API for updating read status
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  // Get Email API
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);


      // Create Element
      const element = document.createElement('div');
      // Default Class on div
      element.className = "border p-3 text-left"
      element.innerHTML = `
      <button id="archive" class="float-right">Archive</button>
      <div><span class="font-weight-bold">From: </span>${email.sender}</div>
      <div><span class="font-weight-bold">To: </span>${email.recipients}</div>
      <div><span class="font-weight-bold">Subject: </span>${email.subject}</div> 
      <div><span class="font-weight-bold">Date: </span>${email.timestamp}</div>
      <button id="reply">Reply</button>
      <hr/><div>${email.body}</div>`

      // Target Parent Element + Display
      const parentE = document.querySelector("#email-view");
      parentE.appendChild(element);

      if (email.archived) {
        document.querySelector('#archive').innerHTML = `Unarchive`;
      } else {
        document.querySelector('#archive').innerHTML = `Archive`;
      }

      // Add Event listener on Buttons
      document.addEventListener("click", (event) => {
        // Call function; Depending on event.target
        if (event.target.id == 'archive') {
          // If InnerHtml is archive; Then True
          if (event.target.innerHTML == 'Archive') {
            archive_unarchive(id, true);
          } else {
            archive_unarchive(id, false);
          }
        }
      });

    });

};

function archive_unarchive(id, archive) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archive
    })
  })
  // Load back Inbox of User
  load_mailbox('inbox');
};