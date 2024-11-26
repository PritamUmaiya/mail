document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Send email
  document.querySelector('#compose-form').addEventListener('submit', (e) => {
    // Prevent the form form being submmited
    e.preventDefault();

    send_email(
      document.querySelector('#compose-recipients').value,
      document.querySelector('#compose-subject').value,
      document.querySelector('#compose-body').value
    );
  });

});

function show_view(view_name) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#detail-view').style.display = 'none';
  document.querySelector(`#${view_name}`).style.display = 'block';
}

function compose_email() {

  // Show compose view and hide other views
  show_view('compose-view');

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  show_view('emails-view');

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Display mailbox
  display_emails(mailbox);
}

// TO DO 1: Send Email
function send_email(recipients,subject, body) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      if (result['message']) {
        load_mailbox('sent');
        alert(result['message']);
      } else {
        alert(result['error']);
      }
  });
}

// TO DO 2: Display Mailbox
function display_emails(mailbox) {
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
    if (emails.length === 0) {
      document.querySelector('#emails-view').append('No emails.');
    } else {
      emails.forEach(email => {
        const element = document.createElement('div');
        element.classList.add('email');

        // Take the user to email
        element.onclick = () => {
          view_email(email.id);
        };

        // If the view is inbox or archieve and mail is read
        if ((mailbox == 'inbox' || mailbox == 'archieve') && email.read) {
          element.classList.add('read-email');
        }
        element.innerHTML = `<span><strong>${email.sender}</strong> ${email.subject}</span> <span style="color:#494949;">${email.timestamp}</span>`;
        document.querySelector('#emails-view').append(element);
      });
    }
  });
}

// TO DO 3: View Email
function view_email(email_id) {
  // Show display view and hide other views
  show_view('detail-view');
  
  // Get the email
  fetch('/emails/' + email_id)
  .then(response => response.json())
  .then(email => {
     document.querySelector('#detail-sender').innerHTML = email.sender;
     document.querySelector('#detail-subject').innerHTML = email.subject;
     document.querySelector('#detail-timestamp').innerHTML = email.timestamp;
     document.querySelector('#detail-body').innerHTML = email.body;
  });


}