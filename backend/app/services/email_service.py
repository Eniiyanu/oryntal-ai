import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings


class EmailService:
    def __init__(self):
        self.smtp_server = settings.email_host
        self.smtp_port = settings.email_port
        self.email = settings.email_host_user
        self.password = settings.email_host_password
        self.use_tls = settings.email_use_tls

    def generate_otp(self, length: int = 6) -> str:
        """Generate a random OTP"""
        return ''.join(random.choices(string.digits, k=length))

    def create_otp_template(self, otp: str, user_name: str = "User") -> str:
        """Create beautiful OTP email template"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - Oryntal AI</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .email-card {{
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }}
                .title {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #2d3748;
                    margin-bottom: 10px;
                }}
                .subtitle {{
                    font-size: 16px;
                    color: #718096;
                    margin-bottom: 30px;
                }}
                .otp-container {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-label {{
                    color: white;
                    font-size: 16px;
                    margin-bottom: 15px;
                    font-weight: 500;
                }}
                .otp-code {{
                    font-size: 36px;
                    font-weight: bold;
                    color: white;
                    letter-spacing: 8px;
                    font-family: 'Courier New', monospace;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 15px 30px;
                    border-radius: 12px;
                    display: inline-block;
                    margin: 10px 0;
                }}
                .otp-expiry {{
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 14px;
                    margin-top: 15px;
                }}
                .content {{
                    color: #4a5568;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }}
                .footer {{
                    text-align: center;
                    color: #718096;
                    font-size: 14px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 20px;
                }}
                .security-note {{
                    background: #f7fafc;
                    border-left: 4px solid #667eea;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 8px;
                }}
                .security-note strong {{
                    color: #2d3748;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-card">
                    <div class="header">
                        <div class="logo">
                            📈 Oryntal AI
                        </div>
                        <h1 class="title">Verify Your Email</h1>
                        <p class="subtitle">Complete your account setup with the verification code below</p>
                    </div>
                    
                    <div class="content">
                        <p>Hello <strong>{user_name}</strong>,</p>
                        <p>Welcome to Oryntal AI! To complete your registration and start your journey into AI-powered investing, please verify your email address using the code below:</p>
                    </div>
                    
                    <div class="otp-container">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">{otp}</div>
                        <div class="otp-expiry">This code expires in 10 minutes</div>
                    </div>
                    
                    <div class="content">
                        <p>Simply enter this code in the verification form to activate your account and unlock the power of AI-driven market insights.</p>
                        
                        <div class="security-note">
                            <strong>Security Note:</strong> Never share this code with anyone. Oryntal AI will never ask for your verification code via phone or email.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>If you didn't create an account with Oryntal AI, please ignore this email.</p>
                        <p>© 2024 Oryntal AI. The future of investing is listening.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    def create_password_reset_template(self, reset_link: str, user_name: str = "User") -> str:
        """Create beautiful password reset email template"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Oryntal AI</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .email-card {{
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }}
                .title {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #2d3748;
                    margin-bottom: 10px;
                }}
                .subtitle {{
                    font-size: 16px;
                    color: #718096;
                    margin-bottom: 30px;
                }}
                .reset-button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px 32px;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 16px;
                    text-align: center;
                    margin: 20px 0;
                    transition: transform 0.2s;
                }}
                .reset-button:hover {{
                    transform: translateY(-2px);
                }}
                .content {{
                    color: #4a5568;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }}
                .footer {{
                    text-align: center;
                    color: #718096;
                    font-size: 14px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 20px;
                }}
                .security-note {{
                    background: #f7fafc;
                    border-left: 4px solid #667eea;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 8px;
                }}
                .security-note strong {{
                    color: #2d3748;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-card">
                    <div class="header">
                        <div class="logo">
                            🔐 Oryntal AI
                        </div>
                        <h1 class="title">Reset Your Password</h1>
                        <p class="subtitle">Secure your account with a new password</p>
                    </div>
                    
                    <div class="content">
                        <p>Hello <strong>{user_name}</strong>,</p>
                        <p>We received a request to reset your password for your Oryntal AI account. Click the button below to create a new password:</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="reset-button">Reset My Password</a>
                    </div>
                    
                    <div class="content">
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #667eea; font-size: 14px;">{reset_link}</p>
                        
                        <div class="security-note">
                            <strong>Security Note:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>If you didn't request a password reset, please ignore this email.</p>
                        <p>© 2024 Oryntal AI. The future of investing is listening.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email with HTML content"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email
            msg['To'] = to_email

            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.email, self.password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False

    def send_otp_email(self, to_email: str, otp: str, user_name: str = "User") -> bool:
        """Send OTP verification email"""
        subject = "Verify Your Email - Oryntal AI"
        html_content = self.create_otp_template(otp, user_name)
        return self.send_email(to_email, subject, html_content)

    def send_password_reset_email(self, to_email: str, reset_link: str, user_name: str = "User") -> bool:
        """Send password reset email"""
        subject = "Reset Your Password - Oryntal AI"
        html_content = self.create_password_reset_template(reset_link, user_name)
        return self.send_email(to_email, subject, html_content)


# Global email service instance
email_service = EmailService()
