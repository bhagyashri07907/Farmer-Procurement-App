/**
 * KisanQueue Farmer API Service Layer
 * 
 * This service provides typed, asynchronous API methods for all farmer-facing actions.
 * In this prototype, methods interact with local storage and simulated async delays.
 * They are structured 1:1 to map to the future FastAPI + MongoDB backend endpoints.
 */

import {
  Farmer,
  Crop,
  ProcurementCenter,
  DateSlots,
  Booking,
  AppNotification,
  BookingStatus,
  PaymentStatus,
} from '../types';
import {
  DEMO_FARMERS,
  DEMO_CROPS,
  DEMO_CENTERS,
  DEMO_DATE_SLOTS,
  INITIAL_DEMO_BOOKINGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  FARMERS: 'kq_farmers_data',
  CURRENT_FARMER: 'kq_current_farmer',
  BOOKINGS: 'kq_bookings_data',
  NOTIFICATIONS: 'kq_notifications_data',
  DATE_SLOTS: 'kq_date_slots_data',
};

// Initialize localStorage with mock data if not present
function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.FARMERS)) {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(DEMO_FARMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_DEMO_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DATE_SLOTS)) {
    localStorage.setItem(STORAGE_KEYS.DATE_SLOTS, JSON.stringify(DEMO_DATE_SLOTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_FARMER)) {
    // Default demo farmer is Bhagyashri Patil
    localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(DEMO_FARMERS[0]));
  }
}

initializeStorage();

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Farmer Authentication
 * Future FastAPI: POST /api/v1/auth/farmer/login
 */
export async function loginFarmer(identifier: string, password?: string): Promise<{ success: boolean; farmer?: Farmer; message?: string }> {
  await simulateDelay(250);
  const farmers: Farmer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMERS) || '[]');
  
  const cleanId = identifier.trim().toLowerCase();
  const farmer = farmers.find(
    (f) =>
      f.mobileNumber === cleanId ||
      f.farmerId.toLowerCase() === cleanId ||
      f.fullName.toLowerCase().includes(cleanId)
  );

  if (!farmer) {
    return { success: false, message: 'Farmer ID or Mobile number not registered. Please register first.' };
  }

  if (password && farmer.password && farmer.password !== password) {
    return { success: false, message: 'Incorrect password. Please verify and try again.' };
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(farmer));
  return { success: true, farmer };
}

/**
 * Farmer Registration
 * Future FastAPI: POST /api/v1/auth/farmer/register
 */
export async function registerFarmer(data: {
  fullName: string;
  mobileNumber: string;
  farmerId: string;
  village: string;
  taluka: string;
  district: string;
  password?: string;
}): Promise<{ success: boolean; farmer?: Farmer; message?: string }> {
  await simulateDelay(350);
  const farmers: Farmer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMERS) || '[]');

  // Check if mobile or farmerId already registered
  const exists = farmers.some(
    (f) => f.mobileNumber === data.mobileNumber || f.farmerId.toLowerCase() === data.farmerId.toLowerCase()
  );

  if (exists) {
    return { success: false, message: 'A farmer with this Mobile Number or Farmer ID is already registered.' };
  }

  const newFarmer: Farmer = {
    id: `farmer_${Date.now()}`,
    fullName: data.fullName.trim(),
    mobileNumber: data.mobileNumber.trim(),
    farmerId: data.farmerId.trim().toUpperCase(),
    village: data.village.trim(),
    taluka: data.taluka.trim(),
    district: data.district.trim(),
    state: 'Maharashtra',
    password: data.password || 'password123',
    landholdingAcre: 5.0,
    bankAccountLast4: Math.floor(1000 + Math.random() * 9000).toString(),
  };

  farmers.push(newFarmer);
  localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(newFarmer));

  return { success: true, farmer: newFarmer };
}

/**
 * Get currently logged-in Farmer
 */
export function getCurrentFarmer(): Farmer | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_FARMER);
  if (!data) return DEMO_FARMERS[0];
  try {
    return JSON.parse(data);
  } catch {
    return DEMO_FARMERS[0];
  }
}

/**
 * Logout
 */
export function logoutFarmer(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_FARMER);
}

/**
 * Fetch supported crops
 * Future FastAPI: GET /api/v1/crops
 */
export async function getCrops(): Promise<Crop[]> {
  await simulateDelay(150);
  return DEMO_CROPS;
}

/**
 * Fetch Government Authorized Procurement Centers
 * Future FastAPI: GET /api/v1/procurement-centers
 */
export async function getProcurementCenters(cropId?: string, district?: string): Promise<ProcurementCenter[]> {
  await simulateDelay(200);
  let centers = DEMO_CENTERS;

  if (district && district.trim() && district.toLowerCase() !== 'all') {
    const dLower = district.trim().toLowerCase();
    centers = centers.filter((c) => c.district.toLowerCase() === dLower);
  }

  if (cropId) {
    centers = centers.filter((c) => c.acceptedCropIds.includes(cropId));
  }

  return centers;
}

/**
 * Fetch available slots for a center & date
 * Future FastAPI: GET /api/v1/procurement-centers/{center_id}/slots?date={date}
 */
export async function getAvailableSlots(centerId: string, dateStr?: string): Promise<DateSlots[]> {
  await simulateDelay(200);
  const dateSlotsMap: Record<string, DateSlots[]> = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.DATE_SLOTS) || JSON.stringify(DEMO_DATE_SLOTS)
  );

  const centerDates = dateSlotsMap[centerId] || DEMO_DATE_SLOTS[centerId] || DEMO_DATE_SLOTS['center_baramati'];
  if (dateStr) {
    return centerDates.filter((d) => d.date === dateStr || d.displayDate === dateStr);
  }
  return centerDates;
}

/**
 * Book a procurement slot and generate unique digital token
 * Future FastAPI: POST /api/v1/bookings
 * Future MongoDB: stores permanent booking document with token
 */
export async function createBooking(params: {
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  cropId: string;
  centerId: string;
  date: string;
  timeSlotId: string;
  expectedQuantityQuintals: number;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  await simulateDelay(400);

  const crop = DEMO_CROPS.find((c) => c.id === params.cropId);
  const center = DEMO_CENTERS.find((c) => c.id === params.centerId);

  if (!crop || !center) {
    return { success: false, error: 'Invalid crop or procurement center selected.' };
  }

  if (params.expectedQuantityQuintals <= 0) {
    return { success: false, error: 'Please enter a valid expected quantity greater than 0.' };
  }

  // Find the selected slot
  const dateSlotsMap: Record<string, DateSlots[]> = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.DATE_SLOTS) || JSON.stringify(DEMO_DATE_SLOTS)
  );
  const centerDates = dateSlotsMap[params.centerId] || [];
  let foundSlotWindow = '09:00 AM – 11:00 AM';

  for (const dateObj of centerDates) {
    if (dateObj.date === params.date || dateObj.displayDate === params.date) {
      const slot = dateObj.slots.find((s) => s.id === params.timeSlotId);
      if (slot) {
        if (slot.isFull || slot.available <= 0) {
          return { success: false, error: 'This time slot is full. Please select another slot.' };
        }
        // Deduct availability
        slot.available = Math.max(0, slot.available - 1);
        if (slot.available === 0) slot.isFull = true;
        foundSlotWindow = slot.timeWindow;
      }
    }
  }
  localStorage.setItem(STORAGE_KEYS.DATE_SLOTS, JSON.stringify(dateSlotsMap));

  // Generate unique Human-Readable Digital Token (Format: KQ-2026-XXXXX)
  // In real backend, FastAPI + MongoDB sequence generates this.
  const randomSequence = Math.floor(100 + Math.random() * 900);
  const digitalToken = `KQ-2026-00${randomSequence}`;
  const bookingId = `BK${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking: Booking = {
    id: bookingId,
    farmerId: params.farmerId,
    farmerName: params.farmerName,
    farmerMobile: params.farmerMobile,
    cropId: crop.id,
    cropName: crop.name,
    centerId: center.id,
    centerName: center.name,
    centerLocation: center.location,
    centerDistrict: center.district,
    date: params.date,
    timeSlot: foundSlotWindow,
    expectedQuantityQuintals: params.expectedQuantityQuintals,
    digitalToken,
    status: 'Booked',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const existingBookings: Booking[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'
  );
  existingBookings.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(existingBookings));

  // Add notification
  const notifications: AppNotification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );
  notifications.unshift({
    id: `notif_${Date.now()}`,
    farmerId: params.farmerId,
    title: 'Slot Booked Successfully',
    message: `Your procurement slot has been booked for ${params.date} at ${center.name}. Token: ${digitalToken}.`,
    timestamp: 'Just now',
    read: false,
    type: 'booking',
    linkTo: `/bookings/${bookingId}`,
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

  return { success: true, booking: newBooking };
}

/**
 * Fetch Farmer Bookings
 * Future FastAPI: GET /api/v1/farmers/{farmer_id}/bookings
 */
export async function getMyBookings(farmerId?: string): Promise<Booking[]> {
  await simulateDelay(200);
  const bookings: Booking[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.BOOKINGS) || JSON.stringify(INITIAL_DEMO_BOOKINGS)
  );

  if (!farmerId) return bookings;
  return bookings.filter((b) => b.farmerId === farmerId);
}

/**
 * Fetch Booking by ID
 * Future FastAPI: GET /api/v1/bookings/{id}
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  await simulateDelay(150);
  const bookings: Booking[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.BOOKINGS) || JSON.stringify(INITIAL_DEMO_BOOKINGS)
  );
  return bookings.find((b) => b.id === bookingId) || null;
}

/**
 * Fetch Digital Token details
 * Future FastAPI: GET /api/v1/bookings/{id}/token
 */
export async function getDigitalToken(bookingId: string): Promise<{
  token: string;
  booking: Booking | null;
}> {
  const booking = await getBookingById(bookingId);
  return {
    token: booking ? booking.digitalToken : '',
    booking,
  };
}

/**
 * Fetch Procurement Status
 * Future FastAPI: GET /api/v1/bookings/{id}/procurement-status
 */
export async function getProcurementStatus(bookingId: string): Promise<{
  status: BookingStatus;
  booking: Booking | null;
}> {
  const booking = await getBookingById(bookingId);
  return {
    status: booking ? booking.status : 'Booked',
    booking,
  };
}

/**
 * Fetch Payment Status
 * Future FastAPI: GET /api/v1/bookings/{id}/payment-status
 */
export async function getPaymentStatus(bookingId: string): Promise<{
  status: PaymentStatus;
  booking: Booking | null;
}> {
  const booking = await getBookingById(bookingId);
  return {
    status: booking ? booking.paymentStatus : 'Pending',
    booking,
  };
}

/**
 * Fetch Farmer Profile
 * Future FastAPI: GET /api/v1/farmers/{farmer_id}/profile
 */
export async function getFarmerProfile(farmerId: string): Promise<Farmer | null> {
  await simulateDelay(150);
  const farmers: Farmer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMERS) || '[]');
  return farmers.find((f) => f.id === farmerId) || DEMO_FARMERS[0];
}

/**
 * Update Farmer Profile
 * Future FastAPI: PUT /api/v1/farmers/{farmer_id}/profile
 */
export async function updateFarmerProfile(farmerId: string, updates: Partial<Farmer>): Promise<Farmer> {
  await simulateDelay(250);
  const farmers: Farmer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMERS) || '[]');
  const index = farmers.findIndex((f) => f.id === farmerId);
  if (index !== -1) {
    farmers[index] = { ...farmers[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
    localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(farmers[index]));
    return farmers[index];
  }
  return DEMO_FARMERS[0];
}

/**
 * Notifications
 */
export async function getNotifications(farmerId?: string): Promise<AppNotification[]> {
  await simulateDelay(150);
  const notifications: AppNotification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS)
  );
  if (!farmerId) return notifications;
  return notifications.filter((n) => n.farmerId === farmerId);
}

export async function markNotificationAsRead(notifId: string): Promise<void> {
  const notifications: AppNotification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );
  const notif = notifications.find((n) => n.id === notifId);
  if (notif) {
    notif.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

export async function markNotificationsAsRead(farmerId?: string): Promise<void> {
  const notifications: AppNotification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );
  notifications.forEach((n) => {
    if (!farmerId || n.farmerId === farmerId) {
      n.read = true;
    }
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}
