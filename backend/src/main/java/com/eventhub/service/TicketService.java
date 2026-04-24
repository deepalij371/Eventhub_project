package com.eventhub.service;

import com.eventhub.model.*;
import com.eventhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Ticket purchaseTicket(Long ticketTypeId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User attendee = userRepository.findByEmail(email).orElseThrow();

        TicketType ticketType = ticketTypeRepository.findById(ticketTypeId).orElseThrow();
        if (ticketType.getSoldQuantity() >= ticketType.getTotalQuantity()) {
            throw new RuntimeException("Tickets sold out");
        }

        ticketType.setSoldQuantity(ticketType.getSoldQuantity() + 1);
        ticketTypeRepository.save(ticketType);

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
        paymentService.processPayment(ticket, ticketType.getPrice());

        // Send Email Confirmation
        emailService.sendTicketConfirmation(attendee, ticket);

        return ticket;
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
