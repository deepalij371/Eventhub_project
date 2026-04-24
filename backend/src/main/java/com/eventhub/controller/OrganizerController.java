package com.eventhub.controller;

import com.eventhub.dto.SalesDashboardResponse;
import com.eventhub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer")
@RequiredArgsConstructor
public class OrganizerController {
    private final DashboardService dashboardService;

    @GetMapping("/dashboard/{eventId}")
    @PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
    public ResponseEntity<SalesDashboardResponse> getDashboard(@PathVariable Long eventId) {
        return ResponseEntity.ok(dashboardService.getSalesDashboard(eventId));
    }

    @GetMapping("/export/{eventId}")
    @PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
    public ResponseEntity<byte[]> exportAttendees(@PathVariable Long eventId) {
        String csv = dashboardService.exportAttendeeListCsv(eventId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendees.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }
}
