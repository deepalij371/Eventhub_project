package com.eventhub.controller;

import com.eventhub.dto.PurchaseRequest;
import com.eventhub.model.Ticket;
import com.eventhub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("/purchase")
    public ResponseEntity<Ticket> purchaseTicket(@RequestBody PurchaseRequest request) {
        return ResponseEntity.ok(ticketService.purchaseTicket(request.getTicketTypeId()));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getAttendeeTickets());
    }
}
