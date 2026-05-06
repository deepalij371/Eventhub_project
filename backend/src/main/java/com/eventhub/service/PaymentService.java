package com.eventhub.service;

import com.eventhub.model.Payment;
import com.eventhub.model.Ticket;
import com.eventhub.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id:mock_key}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:mock_secret}")
    private String razorpayKeySecret;

    /**
     * Creates a payment record. In a real scenario, this would interact with Razorpay APIs
     * to create an order or verify a signature.
     */
    public Payment processPayment(Ticket ticket, BigDecimal amount, String paymentId, String paymentMethod) {
        log.info("Processing payment of {} for ticket {}", amount, ticket.getTicketNumber());

        if ("mock_key".equals(razorpayKeyId) && !"cod".equalsIgnoreCase(paymentMethod)) {
            log.warn("Razorpay keys not configured. Using Mock Payment flow.");
        }

        String txnId = paymentId != null && !paymentId.isEmpty() ? paymentId : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Mock payment logic (Replace with Razorpay Order creation/verification)
        Payment payment = Payment.builder()
                .transactionId(txnId)
                .amount(amount)
                .status("SUCCESS")
                .paymentDate(LocalDateTime.now())
                .ticket(ticket)
                .build();

        return paymentRepository.save(payment);
    }
}
