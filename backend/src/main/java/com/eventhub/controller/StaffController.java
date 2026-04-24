package com.eventhub.controller;

import com.eventhub.model.Ticket;
import com.eventhub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final TicketService ticketService;

    @PostMapping("/validate/{ticketNumber}")
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_ORGANIZER')")
    public ResponseEntity<Ticket> validateTicket(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(ticketService.validateTicket(ticketNumber));
    }
}
