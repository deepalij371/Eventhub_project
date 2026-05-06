package com.eventhub.controller;

import com.eventhub.dto.EventRequest;
import com.eventhub.model.Event;
import com.eventhub.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
    public ResponseEntity<List<Event>> getMyEvents() {
        return ResponseEntity.ok(eventService.getOrganizerEvents());
    }

    @PostMapping("/{eventId}/ticket-types")
    @PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
    public ResponseEntity<com.eventhub.model.TicketType> addTicketType(
            @PathVariable Long eventId, 
            @RequestBody com.eventhub.model.TicketType ticketType) {
        return ResponseEntity.ok(eventService.addTicketType(eventId, ticketType));
    }
}
