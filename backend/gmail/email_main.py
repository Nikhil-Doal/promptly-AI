from google_service_helper import Create_Service
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os

# Paths
pdf_path = r"backend\interview_report.pdf"  # Your existing PDF file

# Gmail API setup
CLIENT_SECRET_FILE = r"backend\gmail\client_secret.json"
API_NAME = 'gmail'
API_VERSION = 'v1'
SCOPES = ['https://mail.google.com/']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

# Compose email
mimeMessage = MIMEMultipart()
mimeMessage['to'] = 'spurhacks58@gmail.com'
mimeMessage['subject'] = 'Here is your document in PDF format'
mimeMessage.attach(MIMEText('Please find the PDF attached.', 'plain'))

# Attach PDF
with open(pdf_path, 'rb') as file:
    mimeApp = MIMEApplication(file.read(), _subtype='pdf')
    mimeApp.add_header('Content-Disposition', 'attachment', filename=os.path.basename(pdf_path))
    mimeMessage.attach(mimeApp)

# Encode and send
raw_string = base64.urlsafe_b64encode(mimeMessage.as_bytes()).decode()
message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()

print("Message sent! Message ID:", message['id'])
