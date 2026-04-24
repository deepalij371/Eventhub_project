package com.eventhub.repository;

import com.eventhub.model.Ticket;
import com.eventhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByAttendee(User attendee);
    Optional<Ticket> findByTicketNumber(String ticketNumber);
}
