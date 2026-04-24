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
}
