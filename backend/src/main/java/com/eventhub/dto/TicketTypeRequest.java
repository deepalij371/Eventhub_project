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
public class TicketTypeRequest {
    private String name;
    private BigDecimal price;
    private Integer totalQuantity;
}
