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
  document.querySelector("#email-view").style.display = 'none';
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

  // Clear email-view display
  document.querySelector("#email-view").innerHTML = ` `;

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
        let element = document.createElement('div');
        // Default Class's On div
        element.id = email.id;
        element.className = "row border p-3 text-dark";

        // Class add on read emails
        if (email.read) {
          element.classList.add("bg-light");
        } else {
          element.classList.add("font-weight-bold");
        }

        element.innerHTML = `
        <div class="col">From: ${email.sender}</div>
        <div class="col">Subject: ${email.subject}</div> 
        <div class="col">Date: ${email.timestamp}</div>
        `;

        // Target The parent element + Display it to the Parentelement
        const parentE = document.querySelector("#emails-view");
        parentE.appendChild(element);

        // Add EventListener on Email Element
        element.addEventListener("click", () => {
          // Update Read Status of the Email
          fetch(`/emails/${element.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            })
          })
          email_view(element.id, mailbox);
          // Update Read Status of the Email
        });

      });
    });

}

function email_view(id, mailbox) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // Archived Button TextContent
      if (!email.archived) {
        content = "Archive";
      } else {
        content = "Unarchive";

      }

      var element = document.createElement('div');
      element.className = "p-3"
      element.innerHTML = `
          <button id="email-${id}" class="float-right hide p-2">${content}</button>
          <div><span class=font-weight-bold">From: </span>${email.sender}</div>
          <div><span class=font-weight-bold">To: </span>${email.recipients}</div>
          <div><span class=font-weight-bold">Time: </span>${email.timestamp}</div>
          <div><span class=font-weight-bold">Subject: </span>${email.subject}</div>
          <button class="hide p-2">Reply</button>  
          <hr/>
          <div><span class="font-weight-bold">${email.body}</div>
        `;

      parentE = document.querySelector("#email-view")
      parentE.append(element);

      // Display None the Archive if Sent Email Box opened
      if (mailbox == "sent") {
        // Fetch all buttons with hide class, then display none when mailbox==sent
        hidebtn = document.querySelectorAll('.hide')
        hidebtn.forEach(btn => {
          btn.style.display = 'none';
        })
      }

      // Show the emailview only and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector("#email-view").style.display = "block";

      element.addEventListener("click", (event) => {
        // Target the archive button + call the function
        if (event.target.id == `email-${id}`) {
          console.log("Targetted");
          archivebtn(id, email.archived);
          // Takes back to Inbox with updated email list
          location.reload();
        }
        if (event.target.textContent == "Reply") {
          reply(email);
        }
      })

    });

}

function archivebtn(id, state) {
  // Archive_Unarchive Button
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !state
    })
  })
};

function reply(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  compose_email();
  // Logic Behind auto-fil subject
  if (email.subject.includes('Re:') || email.subject.includes('re:')) {
    subject = email.subject;
  } else {
    subject = `Re: ${email.subject}`;
  }

  // composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = `At ${email.timestamp} ${email.sender} Wrote:
  ${email.body}
  `;

}