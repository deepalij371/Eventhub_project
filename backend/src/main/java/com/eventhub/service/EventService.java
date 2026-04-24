package com.eventhub.service;

import com.eventhub.dto.EventRequest;
import com.eventhub.model.Event;
import com.eventhub.model.TicketType;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public Event createEvent(EventRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email).orElseThrow();

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .venue(request.getVenue())
                .dateTime(request.getDateTime())
                .imageUrl(request.getImageUrl())
                .organizer(organizer)
                .build();

        List<TicketType> ticketTypes = request.getTicketTypes().stream()
                .map(ttReq -> TicketType.builder()
                        .name(ttReq.getName())
                        .price(ttReq.getPrice())
                        .totalQuantity(ttReq.getTotalQuantity())
                        .soldQuantity(0)
                        .event(event)
                        .build())
                .collect(Collectors.toList());

        event.setTicketTypes(ticketTypes);
        return eventRepository.save(event);
    }

    public List<Event> getOrganizerEvents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email).orElseThrow();
        return eventRepository.findByOrganizer(organizer);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> searchEvents(String query) {
        return eventRepository.findByNameContainingIgnoreCase(query);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow();
    }
}
