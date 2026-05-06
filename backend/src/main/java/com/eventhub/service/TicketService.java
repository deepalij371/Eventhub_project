package com.eventhub.service;

import com.eventhub.model.*;
import com.eventhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventhub.dto.PurchaseRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final QrCodeService qrCodeService;
    private final PaymentService paymentService;
    private final EmailService emailService;

    @Transactional
    public List<Ticket> purchaseTicket(PurchaseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User attendee = userRepository.findByEmail(email).orElseThrow();

        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId()).orElseThrow();
        
        if (ticketType.getEvent().getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Event sales have ended");
        }
        
        int quantity = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;

        if (ticketType.getSoldQuantity() + quantity > ticketType.getTotalQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }

        ticketType.setSoldQuantity(ticketType.getSoldQuantity() + quantity);
        ticketTypeRepository.save(ticketType);

        List<Ticket> generatedTickets = new java.util.ArrayList<>();

        for (int i = 0; i < quantity; i++) {
            String ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String qrData = qrCodeService.generateQrCodeBase64(ticketNumber);

            Ticket ticket = Ticket.builder()
                    .ticketNumber(ticketNumber)
                    .qrCodeData(qrData)
                    .validated(false)
                    .purchaseDate(LocalDateTime.now())
                    .attendee(attendee)
                    .ticketType(ticketType)
                    .build();

            ticket = ticketRepository.save(ticket);
            
            // Process Payment via PaymentService
            paymentService.processPayment(ticket, ticketType.getPrice(), request.getPaymentId(), request.getPaymentMethod());

            // Send Email Confirmation
            emailService.sendTicketConfirmation(attendee, ticket);
            
            generatedTickets.add(ticket);
        }

        return generatedTickets;
    }

    public List<Ticket> getAttendeeTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User attendee = userRepository.findByEmail(email).orElseThrow();
        return ticketRepository.findByAttendee(attendee);
    }

    @Transactional
    public Ticket validateTicket(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.isValidated()) {
            throw new RuntimeException("Ticket already validated");
        }

        ticket.setValidated(true);
        ticket.setValidationDate(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
