package com.eventhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SalesDashboardResponse {
    private Integer totalTicketsSold;
    private BigDecimal totalRevenue;
    private java.util.List<TicketTypeStat> ticketTypeStats;
    private java.util.List<AttendeeDTO> attendees;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TicketTypeStat {
        private String ticketTypeName;
        private Integer soldQuantity;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AttendeeDTO {
        private String ticketNumber;
        private String name;
        private String email;
        private String ticketTypeName;
        private boolean validated;
    }
}
