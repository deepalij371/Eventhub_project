package com.eventhub.service;

import com.eventhub.dto.SalesDashboardResponse;
import com.eventhub.model.Event;
import com.eventhub.model.Ticket;
import com.eventhub.model.TicketType;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public SalesDashboardResponse getSalesDashboard(Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        int totalSold = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        java.util.List<SalesDashboardResponse.TicketTypeStat> stats = new java.util.ArrayList<>();

        for (TicketType tt : event.getTicketTypes()) {
            totalSold += tt.getSoldQuantity();
            BigDecimal tierRevenue = tt.getPrice().multiply(new BigDecimal(tt.getSoldQuantity()));
            totalRevenue = totalRevenue.add(tierRevenue);
            
            stats.add(SalesDashboardResponse.TicketTypeStat.builder()
                    .ticketTypeName(tt.getName())
                    .soldQuantity(tt.getSoldQuantity())
                    .revenue(tierRevenue)
                    .build());
        }

        java.util.List<Ticket> tickets = ticketRepository.findByTicketType_Event_Id(eventId);
        java.util.List<SalesDashboardResponse.AttendeeDTO> attendees = tickets.stream()
                .map(t -> SalesDashboardResponse.AttendeeDTO.builder()
                        .ticketNumber(t.getTicketNumber())
                        .name(t.getAttendee().getUsername())
                        .email(t.getAttendee().getEmail())
                        .ticketTypeName(t.getTicketType().getName())
                        .validated(t.isValidated())
                        .build())
                .collect(Collectors.toList());

        return SalesDashboardResponse.builder()
                .totalTicketsSold(totalSold)
                .totalRevenue(totalRevenue)
                .ticketTypeStats(stats)
                .attendees(attendees)
                .build();
    }

    public String exportAttendeeListCsv(Long eventId) {
        java.util.List<Ticket> tickets = ticketRepository.findByTicketType_Event_Id(eventId);
        StringBuilder csv = new StringBuilder();
        csv.append("Ticket Number,Attendee Name,Attendee Email,Ticket Type,Validated\n");
        for (Ticket t : tickets) {
            csv.append(t.getTicketNumber()).append(",")
               .append(t.getAttendee().getUsername()).append(",")
               .append(t.getAttendee().getEmail()).append(",")
               .append(t.getTicketType().getName()).append(",")
               .append(t.isValidated() ? "Yes" : "No").append("\n");
        }
        return csv.toString();
    }
}
