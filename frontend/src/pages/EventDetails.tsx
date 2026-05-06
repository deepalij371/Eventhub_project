import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  dateTime: string;
  imageUrl: string;
  ticketTypes: { id: number; name: string; price: number; totalQuantity: number; soldQuantity: number }[];
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTicketType, setActiveTicketType] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/public/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Failed to fetch event');
      }
    };
    fetchEvent();
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (ticketTypeId: number) => {
    const selectedTicket = event?.ticketTypes.find(t => t.id === ticketTypeId);
    if (!selectedTicket) return;

    setPurchasing(true);

    const amountToPay = selectedTicket.price * quantity;

    // Handle Cash on Delivery
    if (paymentMethod === 'cod') {
      try {
        await api.post('/tickets/purchase', { ticketTypeId, quantity, paymentMethod: 'cod' });
        setSuccess(true);
        setTimeout(() => navigate('/my-tickets'), 2500);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          alert(err.response?.data?.message || 'Purchase failed. Please try again.');
        }
      } finally {
        setPurchasing(false);
      }
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      setPurchasing(false);
      return;
    }

    const options: any = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YOUR_KEY", // Provide your test key in .env
      amount: amountToPay * 100, // Amount in paise
      currency: "INR", // Changed to INR to enable Indian payment methods like UPI, GPay, etc.
      name: "EventHub",
      description: `Purchase ${quantity}x ${selectedTicket.name} Ticket(s)`,
      image: "https://cdn-icons-png.flaticon.com/512/803/803087.png",
      handler: async function (response: any) {
        // Upon successful payment, verify with backend
        try {
          await api.post('/tickets/purchase', { 
            ticketTypeId, 
            quantity,
            paymentId: response.razorpay_payment_id,
            paymentMethod: paymentMethod
          });
          setSuccess(true);
          setTimeout(() => navigate('/my-tickets'), 2500);
        } catch (err: any) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            navigate('/login');
          } else {
            alert(err.response?.data?.message || 'Purchase failed during verification. Please try again.');
          }
        }
      },
      prefill: {
        name: "Guest User",
        email: "guest@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3b82f6" // Primary blue
      }
    };

    try {
      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      
      paymentObject.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Failed to initialize Razorpay Checkout. If you are using a dummy key, it might fail.");
    } finally {
      // Hide the loader as the Razorpay modal will take over
      setPurchasing(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  const eventDate = new Date(event.dateTime);
  const timeString = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      
      {/* Hero Header */}
      <div className="w-full bg-slate-900 relative">
        <div className="absolute inset-0 overflow-hidden">
           <img 
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop'} 
              alt={event.name} 
              className="w-full h-full object-cover opacity-40 blur-sm"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-300 hover:text-white mb-8 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-semibold text-sm">Back to Events</span>
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 max-w-sm shrink-0">
               <img 
                 src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'} 
                 alt={event.name}
                 className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl border-4 border-white/10"
               />
            </div>
            <div className="flex-1 text-white py-4">
               <div className="inline-block bg-primary/20 text-primary-300 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4">
                 Featured Event
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">{event.name}</h1>
               <div className="flex flex-col sm:flex-row gap-6 text-slate-300">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                       <span className="material-symbols-outlined">calendar_month</span>
                     </div>
                     <div>
                       <p className="font-bold text-white">{dateString}</p>
                       <p className="text-sm">{timeString}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                       <span className="material-symbols-outlined">location_on</span>
                     </div>
                     <div>
                       <p className="font-bold text-white">Venue</p>
                       <p className="text-sm">{event.venue}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
               <h2 className="text-[22px] font-extrabold text-slate-900 dark:text-white mb-6">About This Event</h2>
               <div className="prose dark:prose-invert max-w-none">
                 <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-[15px]">
                   {event.description}
                 </p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-primary shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_activity</span> 
                Select Tickets
              </h3>
              
              {!event.ticketTypes || event.ticketTypes.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mb-8">
                  <span className="material-symbols-outlined text-slate-400 text-4xl mb-3">event_seat</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Tickets Not Yet Available</h4>
                  <p className="text-sm text-slate-500">The organizer hasn't added any ticket types for this event yet. Please check back later.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {event.ticketTypes.map((tt) => {
                      const isSoldOut = tt.soldQuantity >= tt.totalQuantity;
                      const isActive = activeTicketType === tt.id;
                      
                      return (
                        <div 
                          key={tt.id} 
                          onClick={() => !isSoldOut && setActiveTicketType(tt.id)}
                          className={`relative overflow-hidden rounded-[20px] border transition-all duration-200 cursor-pointer p-5
                            ${isSoldOut ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed' : 
                              isActive ? 'bg-primary/5 border-primary ring-1 ring-primary' : 
                              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-sm'
                            }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[16px] font-bold text-slate-900 dark:text-white">{tt.name}</h4>
                            <span className="text-xl font-black text-primary">${tt.price}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <span className="material-symbols-outlined text-[18px]">group</span>
                              <span>{isSoldOut ? '0' : tt.totalQuantity - tt.soldQuantity} available</span>
                            </div>
                            {isSoldOut ? (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                Sold Out
                              </span>
                            ) : isActive && (
                               <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeTicketType && (() => {
                    const activeTicket = event.ticketTypes.find(t => t.id === activeTicketType);
                    const maxQty = activeTicket ? Math.min(10, activeTicket.totalQuantity - activeTicket.soldQuantity) : 10;
                    return (
                      <div className="mb-8 p-5 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">Quantity</h4>
                          <p className="text-xs text-slate-500">Max {maxQty} tickets per order</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                          <button 
                            disabled={quantity <= 1}
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <span className="text-lg font-black text-slate-900 dark:text-white w-6 text-center">{quantity}</span>
                          <button 
                            disabled={quantity >= maxQty}
                            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="space-y-3 mb-8">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Payment Method</h4>
                    
                    <label className={`flex items-center gap-4 p-4 rounded-[20px] border cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800'}`}>
                      <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-primary accent-primary" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white text-[15px]">Pay Online (Razorpay)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Cards, NetBanking, UPI</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[22px]">credit_card</span>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-[20px] border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary accent-primary" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white text-[15px]">Cash on Delivery</p>
                        <p className="text-xs text-slate-500 mt-0.5">Pay cash at the event venue</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
                    </label>
                  </div>
                </>
              )}

              {(() => {
                const activeTicket = event.ticketTypes?.find(t => t.id === activeTicketType);
                const totalPrice = activeTicket ? activeTicket.price * quantity : 0;
                
                return (
                  <button
                    disabled={purchasing || !activeTicketType || !event.ticketTypes || event.ticketTypes.length === 0}
                    onClick={() => activeTicketType && handlePurchase(activeTicketType)}
                    className={`w-full py-4 rounded-full font-bold text-[15px] transition-all duration-300 flex justify-center items-center gap-2 mt-4
                      ${!activeTicketType || !event.ticketTypes || event.ticketTypes.length === 0 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                        : purchasing 
                          ? 'bg-primary/80 text-white cursor-wait'
                          : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5'
                      }`}
                  >
                {purchasing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout {activeTicketType && `($${totalPrice})`}
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
              );
            })()}
              
              <p className="text-center text-xs font-medium text-green-600 dark:text-green-500 mt-5 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl text-center p-8 flex flex-col items-center">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
             <p className="text-slate-500 mb-6">Your ticket has been booked securely. Redirecting you to your tickets...</p>
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 animate-[pulse_1s_ease-in-out_infinite]" style={{width: '100%'}}></div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
