package com.eventhub.service;

import com.eventhub.model.Ticket;
import com.eventhub.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    // private final JavaMailSender mailSender; // Uncomment when SMTP is configured

    public void sendTicketConfirmation(User user, Ticket ticket) {
        log.info("Sending ticket confirmation email to {}", user.getEmail());
        
        try {
            /* 
             // Uncomment when SMTP is configured in application.properties
             MimeMessage message = mailSender.createMimeMessage();
             MimeMessageHelper helper = new MimeMessageHelper(message, true);
             
             helper.setTo(user.getEmail());
             helper.setSubject("Your EventHub Ticket: " + ticket.getTicketType().getEvent().getName());
             
             String htmlContent = "<h1>Thank you for your purchase!</h1>" +
                                  "<p>Your ticket number is: <b>" + ticket.getTicketNumber() + "</b></p>" +
                                  "<p>Please present the QR code at the event entrance.</p>";
                                  
             helper.setText(htmlContent, true);
             mailSender.send(message);
             */
             
            log.info("Mock Email Sent successfully to {} for ticket {}", user.getEmail(), ticket.getTicketNumber());
        } catch (Exception e) {
            log.error("Failed to send email", e);
        }
    }
}
