package com.eventhub.service;

import com.eventhub.dto.SalesDashboardResponse;
import com.eventhub.model.Event;
import com.eventhub.model.TicketType;
import com.eventhub.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final EventRepository eventRepository;

    public SalesDashboardResponse getSalesDashboard(Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        int totalSold = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (TicketType tt : event.getTicketTypes()) {
            totalSold += tt.getSoldQuantity();
            totalRevenue = totalRevenue.add(tt.getPrice().multiply(new BigDecimal(tt.getSoldQuantity())));
        }

        return SalesDashboardResponse.builder()
                .totalTicketsSold(totalSold)
                .totalRevenue(totalRevenue)
                .build();
    }

    public String exportAttendeeListCsv(Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        StringBuilder csv = new StringBuilder();
        csv.append("Ticket Number,Attendee Name,Attendee Email,Ticket Type,Validated\n");
        return csv.toString();
    }
}
