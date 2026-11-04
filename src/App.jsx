import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Gauge,
  Briefcase,
  Fuel,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Banknote,
  Lock,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  FileCheck2,
  Video,
  Camera,
  UserCheck,
  Wrench,
  AlertCircle,
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import SignaturePad from './components/SignaturePad';
import ContractDossierModal from './components/ContractDossierModal';

// --- LOCATIONS & FLEET DATA ---
const LOCATIONS = [
  {
    id: 'MBJ',
    code: 'MBJ',
    name: 'Sangster Intl Airport, Montego Bay',
    shortName: 'Montego Bay Airport (MBJ)',
    pickupNote: 'Airport Terminal Sign → Rental Office Desk'
  },
  {
    id: 'KIN',
    code: 'KIN',
    name: 'Norman Manley Intl Airport, Kingston',
    shortName: 'Kingston Airport (KIN)',
    pickupNote: 'Arrivals Terminal Sign → Office Desk #4'
  },
  {
    id: 'OCJ',
    code: 'OCJ',
    name: 'Ian Fleming Intl Airport, Ocho Rios',
    shortName: 'Ocho Rios Airport (OCJ)',
    pickupNote: 'Arrivals Exit → Main Rental Office'
  },
  {
    id: 'NEG',
    code: 'NEG',
    name: 'Negril Aerodrome & Seven Mile Office',
    shortName: 'Negril Office (NEG)',
    pickupNote: 'Norman Manley Blvd — Rental Office'
  }
];

const ACQUISITION_CHANNELS = [
  {
    id: 'Agent Approached at Airport ("Any rental car for you today?")',
    shortLabel: 'Agent Airport Greeting'
  },
  {
    id: 'Guest Approached "Take It Easy Car Rental" Airport Sign',
    shortLabel: 'Guest Saw Airport Sign'
  }
];

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '08:00 PM'
];

const CATEGORIES = [
  { id: 'all', label: 'All Vehicles' },
  { id: 'compact', label: 'Compact Car' },
  { id: 'fullsize', label: 'Full-Size Car' },
  { id: 'suv', label: 'SUV' },
  { id: 'bus', label: 'Bus / Van' }
];

const FLEET = [
  {
    id: 'yaris',
    category: 'compact',
    categoryLabel: 'Compact Car',
    name: 'Toyota Yaris',
    subtitle: 'Hatchback · 2025 Fleet',
    image: '/vehicles/yaris.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 2,
    mpg: 38,
    ratePerDay: 60,
    deposit: 500,
    badge: 'Airport Best-Seller'
  },
  {
    id: 'camry',
    category: 'fullsize',
    categoryLabel: 'Full-Size Car',
    name: 'Toyota Camry SE',
    subtitle: 'Full-Size Sedan · 2025 Fleet',
    image: '/vehicles/camry.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 4,
    mpg: 34,
    ratePerDay: 85,
    deposit: 500,
    badge: 'Popular Full-Size'
  },
  {
    id: 'accord',
    category: 'fullsize',
    categoryLabel: 'Full-Size Car',
    name: 'Honda Accord Sport',
    subtitle: 'Executive Full-Size · 2025 Fleet',
    image: '/vehicles/accord.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 4,
    mpg: 35,
    ratePerDay: 92,
    deposit: 500,
    badge: 'Touring Comfort'
  },
  {
    id: 'rav4',
    category: 'suv',
    categoryLabel: 'Standard SUV',
    name: 'Toyota RAV4 XLE',
    subtitle: 'AWD Crossover SUV · 2025 Fleet',
    image: '/vehicles/rav4.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 5,
    mpg: 31,
    ratePerDay: 110,
    deposit: 500,
    badge: 'Island Explorer'
  },
  {
    id: 'highlander',
    category: 'suv',
    categoryLabel: '7-Passenger SUV',
    name: 'Toyota Highlander',
    subtitle: '3-Row SUV · 2025 Fleet',
    image: '/vehicles/highlander.jpg',
    seats: 7,
    transmission: 'Auto',
    luggage: 6,
    mpg: 28,
    ratePerDay: 138,
    deposit: 500,
    badge: 'Family 3-Row'
  },
  {
    id: 'hiace',
    category: 'bus',
    categoryLabel: 'Passenger Bus',
    name: 'Toyota HiAce 15-Seater Bus',
    subtitle: 'High-Roof Commuter Bus · 2025 Fleet',
    image: '/vehicles/hiace.jpg',
    seats: 15,
    transmission: 'Auto',
    luggage: 10,
    mpg: 23,
    ratePerDay: 160,
    deposit: 500,
    badge: 'Group Bus'
  }
];

const VEHICLE_CHECK_ZONES = [
  { id: 'front', label: 'Front Bumper' },
  { id: 'hood', label: 'Hood & Glass' },
  { id: 'left', label: 'Left Doors' },
  { id: 'right', label: 'Right Doors' },
  { id: 'roof', label: 'Roof & Cabin' },
  { id: 'rear', label: 'Rear & Trunk' },
  { id: 'tires', label: 'Tires & Rims' }
];

const RETURN_DAMAGE_PRESETS = [
  {
    label: 'Minor Bumper Scuff',
    description: 'Minor front-left bumper paint scuff noted on check sheet.',
    cost: 220,
    major: false
  },
  {
    label: 'Door Dent ($380)',
    description: 'Passenger door crease and mirror scratch noted on check sheet.',
    cost: 380,
    major: false
  },
  {
    label: 'Major Fender Impact ($850)',
    description: 'Deep front-right fender & bumper collision requiring panel replacement.',
    cost: 850,
    major: true
  },
  {
    label: 'Major Suspension / Front-End ($1,420)',
    description: 'Major front-end impact affecting radiator support, headlamp, and suspension.',
    cost: 1420,
    major: true
  }
];

function formatDateInput(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return formatDateInput(dt);
}

function diffDays(startStr, endStr) {
  if (!startStr || !endStr) return 1;
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_PICKUP_DATE = (() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateInput(tomorrow);
})();
const DEFAULT_RETURN_DATE = addDays(DEFAULT_PICKUP_DATE, 4);

// Seed one active out-on-road rental so Phase 5 & Phase 6 can also be tested immediately
const INITIAL_SAMPLE_RENTAL = {
  id: 'TIE-508412',
  createdAt: '09:40 AM',
  acquisitionChannel: 'Agent Approached at Airport ("Any rental car for you today?")',
  vehicle: FLEET[0],
  location: LOCATIONS[0],
  pickupDate: DEFAULT_PICKUP_DATE,
  pickupTime: '10:00 AM',
  returnDate: DEFAULT_RETURN_DATE,
  returnTime: '10:00 AM',
  rentalDays: 4,
  subtotal: 240,
  deposit: 500,
  rentalPaymentMethod: 'cash',
  cardHolder: 'MARCUS STERLING',
  cardLast4: '4829',
  sendViaWhatsApp: true,
  driver: {
    fullName: 'Marcus Sterling',
    dob: '1988-06-14',
    licenseNumber: 'JM-8492041-A',
    licenseExpiry: '2029-11-30',
    email: 'marcus.sterling@example.com',
    phone: '+1 (876) 555-0194',
    idVerified: true
  },
  inspection: {
    noExistingDamage: true,
    damagedZones: [],
    notes: 'Explicitly noted on check sheet: Vehicle has NO existing damage prior to handoff.',
    customerVideoRecorded: true,
    agentVideoRecorded: true,
    checkSheetSignature: {
      mode: 'type',
      dataUrl: null,
      text: 'Marcus Sterling',
      signedAt: '09:36 AM'
    }
  },
  contract: {
    ackDamageResponsibility: true,
    ackThirdPartyInsurance: true,
    copiesDistributed: true,
    contractSignature: {
      mode: 'type',
      dataUrl: null,
      text: 'Marcus Sterling',
      signedAt: '09:39 AM'
    }
  },
  returnAssessment: {
    inspected: false,
    hasNewDamage: false,
    damageDescription: '',
    estimateCost: 0,
    isMajorDamage: false,
    professionalName: 'Devon Campbell (Certified Auto Body Estimator)',
    professionalVerified: false,
    estimatePresentedToCustomer: false,
    informedDepositInsufficient: false,
    customerPosPermission: false,
    settled: false,
    posRef: ''
  }
};

export default function App() {
  // Phase 1: Acquisition & Sticky Search Strip State
  const [acquisitionChannel] = useState(ACQUISITION_CHANNELS[0].id);
  const [locationId, setLocationId] = useState('MBJ');
  const [pickupDate, setPickupDate] = useState(DEFAULT_PICKUP_DATE);
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnDate, setReturnDate] = useState(DEFAULT_RETURN_DATE);
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [isStickyPinned, setIsStickyPinned] = useState(false);

  // Drawer & Modal State
  // drawerMode: 'checkout' (Phases 2-4) | 'bookings' (List) | 'return' (Phases 5-6) | null
  const [drawerMode, setDrawerMode] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(2); // 2 = Office App, 3 = Check Sheet & Videos, 4 = Contract, Sign & Pay
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [reservations, setReservations] = useState([INITIAL_SAMPLE_RENTAL]);
  const [selectedReturnId, setSelectedReturnId] = useState(INITIAL_SAMPLE_RENTAL.id);
  const [dossierBooking, setDossierBooking] = useState(null);
  const [formError, setFormError] = useState('');
  const [successNotification, setSuccessNotification] = useState(null);

  // --- PHASE 2 STATE: OFFICE DOCUMENTATION & APPLICATION ---
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [driver, setDriver] = useState({
    fullName: '',
    dob: '',
    licenseNumber: '',
    licenseExpiry: '',
    email: '',
    phone: '',
    idVerified: false
  });

  // --- PHASE 3 STATE: VEHICLE INSPECTION, CHECK SHEET & DUAL VIDEOS ---
  const [noExistingDamage, setNoExistingDamage] = useState(true);
  const [damagedZones, setDamagedZones] = useState([]);
  const [inspectionNotes, setInspectionNotes] = useState(
    'Explicitly noted on check sheet: Vehicle has NO existing damage prior to handoff.'
  );
  const [customerVideoRecorded, setCustomerVideoRecorded] = useState(false);
  const [agentVideoRecorded, setAgentVideoRecorded] = useState(false);
  const [checkSheetSignature, setCheckSheetSignature] = useState(null);

  // --- PHASE 4 STATE: CONTRACT REVIEW, SIGNATURE & STRICT PAYMENT ---
  const [ackDamageResponsibility, setAckDamageResponsibility] = useState(false);
  const [ackThirdPartyInsurance, setAckThirdPartyInsurance] = useState(false);
  const [copiesDistributed, setCopiesDistributed] = useState(false);
  const [contractSignature, setContractSignature] = useState(null);
  const [rentalPaymentMethod, setRentalPaymentMethod] = useState('cash'); // 'cash' | 'card'
  const [card, setCard] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvc: ''
  });

  // --- PHASE 5 & 6 STATE: RETURN INSPECTION & POS RESOLUTION ---
  const [returnDraft, setReturnDraft] = useState({
    hasNewDamage: true,
    damageDescription:
      'Deep front-right fender & bumper collision requiring panel replacement.',
    estimateCost: 850,
    isMajorDamage: true,
    professionalName: 'Devon Campbell (Certified Auto Body Estimator)',
    professionalVerified: true,
    estimatePresentedToCustomer: true,
    informedDepositInsufficient: false,
    customerPosPermission: false
  });
  const [returnError, setReturnError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyPinned(window.scrollY > 360);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dossierBooking) {
          setDossierBooking(null);
        } else if (drawerMode) {
          setDrawerMode(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerMode, dossierBooking]);

  useEffect(() => {
    if (drawerMode || dossierBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerMode, dossierBooking]);

  const handlePickupDateChange = (nextPickup) => {
    setPickupDate(nextPickup);
    if (diffDays(nextPickup, returnDate) < 1 || nextPickup >= returnDate) {
      setReturnDate(addDays(nextPickup, 1));
    }
  };

  const handleReturnDateChange = (nextReturn) => {
    if (nextReturn <= pickupDate) {
      setReturnDate(addDays(pickupDate, 1));
    } else {
      setReturnDate(nextReturn);
    }
  };

  const rentalDays = useMemo(
    () => diffDays(pickupDate, returnDate),
    [pickupDate, returnDate]
  );

  const selectedLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0],
    [locationId]
  );

  const filteredFleet = useMemo(() => {
    const list =
      selectedCategory === 'all'
        ? [...FLEET]
        : FLEET.filter((v) => v.category === selectedCategory);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.ratePerDay - b.ratePerDay);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.ratePerDay - a.ratePerDay);
    } else if (sortBy === 'mpg') {
      list.sort((a, b) => b.mpg - a.mpg);
    } else if (sortBy === 'seats') {
      list.sort((a, b) => b.seats - a.seats);
    }
    return list;
  }, [selectedCategory, sortBy]);

  const activeReturnBooking = useMemo(
    () => reservations.find((r) => r.id === selectedReturnId) || reservations[0] || null,
    [reservations, selectedReturnId]
  );

  const openCheckoutDrawer = (vehicle) => {
    setActiveVehicle(vehicle);
    setConfirmedReservation(null);
    setCheckoutStep(2);
    setFormError('');
    setSendViaWhatsApp(true);
    setNoExistingDamage(true);
    setDamagedZones([]);
    setInspectionNotes(
      'Explicitly noted on check sheet: Vehicle has NO existing damage prior to handoff.'
    );
    setCustomerVideoRecorded(false);
    setAgentVideoRecorded(false);
    setCheckSheetSignature(null);
    setAckDamageResponsibility(false);
    setAckThirdPartyInsurance(false);
    setCopiesDistributed(false);
    setContractSignature(null);
    setDrawerMode('checkout');
  };

  const openReturnDrawerFor = (booking) => {
    setSelectedReturnId(booking.id);
    setReturnError('');
    if (booking.returnAssessment?.inspected) {
      setReturnDraft({
        hasNewDamage: booking.returnAssessment.hasNewDamage,
        damageDescription: booking.returnAssessment.damageDescription,
        estimateCost: booking.returnAssessment.estimateCost,
        isMajorDamage: booking.returnAssessment.isMajorDamage,
        professionalName: booking.returnAssessment.professionalName,
        professionalVerified: booking.returnAssessment.professionalVerified,
        estimatePresentedToCustomer: booking.returnAssessment.estimatePresentedToCustomer,
        informedDepositInsufficient: booking.returnAssessment.informedDepositInsufficient,
        customerPosPermission: booking.returnAssessment.customerPosPermission
      });
    } else {
      setReturnDraft({
        hasNewDamage: true,
        damageDescription:
          'Deep front-right fender & bumper collision requiring panel replacement.',
        estimateCost: 850,
        isMajorDamage: true,
        professionalName: 'Devon Campbell (Certified Auto Body Estimator)',
        professionalVerified: true,
        estimatePresentedToCustomer: true,
        informedDepositInsufficient: false,
        customerPosPermission: false
      });
    }
    setDrawerMode('return');
  };

  const fillDemoApplication = () => {
    setDriver({
      fullName: 'Nadine Wright',
      dob: '1991-03-22',
      licenseNumber: 'JM-9940182-B',
      licenseExpiry: '2030-08-19',
      email: 'nadine.wright@islandmail.com',
      phone: '+1 (876) 555-0842',
      idVerified: true
    });
    setCard({
      holder: 'NADINE WRIGHT',
      number: '4532 8910 4421 7741',
      expiry: '09/29',
      cvc: '618'
    });
    setFormError('');
  };

  const toggleDamageZone = (zoneLabel) => {
    setNoExistingDamage(false);
    setDamagedZones((prev) => {
      const next = prev.includes(zoneLabel)
        ? prev.filter((z) => z !== zoneLabel)
        : [...prev, zoneLabel];
      if (next.length === 0) {
        setInspectionNotes('Minor wear noted on check sheet prior to handoff.');
      } else {
        setInspectionNotes(`Pre-existing marks noted on check sheet: ${next.join(', ')}.`);
      }
      return next;
    });
  };

  const handleToggleNoExistingDamage = (checked) => {
    setNoExistingDamage(checked);
    if (checked) {
      setDamagedZones([]);
      setInspectionNotes(
        'Explicitly noted on check sheet: Vehicle has NO existing damage prior to handoff.'
      );
    } else {
      setInspectionNotes('Select affected vehicle zones above and note details on check sheet.');
    }
  };

  const validateStep2 = () => {
    if (!driver.fullName.trim()) {
      setFormError('Enter the customer’s full legal name.');
      return false;
    }
    if (!driver.dob) {
      setFormError('Enter the customer’s date of birth.');
      return false;
    }
    if (!driver.licenseNumber.trim() || !driver.licenseExpiry) {
      setFormError('Enter driver’s license number and license expiration date.');
      return false;
    }
    if (!driver.phone.trim()) {
      setFormError('Enter customer’s contact phone number (including country code).');
      return false;
    }
    if (!driver.email.trim()) {
      setFormError('Enter customer’s email address for the rental application.');
      return false;
    }
    if (!driver.idVerified) {
      setFormError('Confirm physical identification has been inspected by the agent.');
      return false;
    }
    setFormError('');
    return true;
  };

  const validateStep3 = () => {
    if (!noExistingDamage && damagedZones.length === 0) {
      setFormError('Mark existing damage zones or check "Explicitly Note: No Existing Damage".');
      return false;
    }
    if (!customerVideoRecorded) {
      setFormError('Confirm the customer recorded a video of the vehicle’s condition.');
      return false;
    }
    if (!agentVideoRecorded) {
      setFormError('Confirm the agent recorded the company’s pre-handoff vehicle video.');
      return false;
    }
    if (!checkSheetSignature) {
      setFormError('Customer must sign the check sheet to confirm vehicle condition.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleAdvanceStep = () => {
    if (checkoutStep === 2 && validateStep2()) {
      setCheckoutStep(3);
    } else if (checkoutStep === 3 && validateStep3()) {
      setCheckoutStep(4);
    }
  };

  const handleFinalizeContractAndPayment = (e) => {
    e.preventDefault();
    if (!activeVehicle) return;
    if (!validateStep2() || !validateStep3()) return;

    if (!ackDamageResponsibility) {
      setFormError(
        'Confirm contract review: customer responsibility for damages and accidents.'
      );
      return;
    }
    if (!ackThirdPartyInsurance) {
      setFormError(
        'Confirm third-party insurance clarification (covers other person’s vehicle only).'
      );
      return;
    }
    if (!copiesDistributed) {
      setFormError(
        'Confirm customer received contract/check-sheet copy and office retained originals.'
      );
      return;
    }
    if (!contractSignature) {
      setFormError('Customer must sign the rental contract before vehicle release.');
      return;
    }

    const rawDigits = card.number.replace(/\D/g, '');
    if (!card.holder.trim() || rawDigits.length < 12 || !card.expiry.trim() || !card.cvc.trim()) {
      setFormError(
        'A valid credit/debit card is strictly required for the $500 security deposit (cash is never accepted for deposit).'
      );
      return;
    }

    setFormError('');
    const subtotal = activeVehicle.ratePerDay * rentalDays;
    const newBooking = {
      id: `TIE-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acquisitionChannel,
      vehicle: activeVehicle,
      location: selectedLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,
      subtotal,
      deposit: activeVehicle.deposit,
      rentalPaymentMethod,
      cardHolder: card.holder.trim(),
      cardLast4: rawDigits.slice(-4),
      sendViaWhatsApp,
      driver: { ...driver },
      inspection: {
        noExistingDamage,
        damagedZones: [...damagedZones],
        notes: inspectionNotes,
        customerVideoRecorded,
        agentVideoRecorded,
        checkSheetSignature
      },
      contract: {
        ackDamageResponsibility,
        ackThirdPartyInsurance,
        copiesDistributed,
        contractSignature
      },
      returnAssessment: {
        inspected: false,
        hasNewDamage: false,
        damageDescription: '',
        estimateCost: 0,
        isMajorDamage: false,
        professionalName: 'Devon Campbell (Certified Auto Body Estimator)',
        professionalVerified: false,
        estimatePresentedToCustomer: false,
        informedDepositInsufficient: false,
        customerPosPermission: false,
        settled: false,
        posRef: ''
      }
    };

    setReservations((prev) => [newBooking, ...prev]);
    setSelectedReturnId(newBooking.id);
    setConfirmedReservation(newBooking);

    const deliveryChannels = sendViaWhatsApp ? 'Email and WhatsApp' : 'Email';
    setSuccessNotification(
      `Contract ${newBooking.id} finalized — digital copy delivered via ${deliveryChannels}.`
    );
    setTimeout(() => {
      setSuccessNotification(null);
    }, 5000);
  };

  // Phase 5 & 6 POS Settlement Handler
  const handleProcessReturnPos = () => {
    if (!activeReturnBooking) return;

    const effectiveCost = returnDraft.hasNewDamage
      ? Math.max(0, Number(returnDraft.estimateCost || 0))
      : 0;
    const deposit = activeReturnBooking.deposit;
    const exceedsDeposit = effectiveCost > deposit;

    if (returnDraft.hasNewDamage) {
      if (!returnDraft.damageDescription.trim() || effectiveCost <= 0) {
        setReturnError('Note the damage type and a valid repair estimate on the check sheet.');
        return;
      }
      if (returnDraft.isMajorDamage && !returnDraft.professionalVerified) {
        setReturnError(
          'Major damage requires a professional estimator’s verified repair estimate.'
        );
        return;
      }
      if (!returnDraft.estimatePresentedToCustomer) {
        setReturnError('Present the damage estimate to the customer before charging their card.');
        return;
      }
      if (exceedsDeposit) {
        if (!returnDraft.informedDepositInsufficient) {
          setReturnError(
            'Inform the customer that the initial $500 security deposit is insufficient.'
          );
          return;
        }
        if (!returnDraft.customerPosPermission) {
          setReturnError(
            'Customer permission is required before using the POS machine to draw remaining funds.'
          );
          return;
        }
      }
    }

    setReturnError('');
    const posRef = `POS-TIE-${Math.floor(10000 + Math.random() * 90000)}`;

    setReservations((prev) =>
      prev.map((item) =>
        item.id === activeReturnBooking.id
          ? {
            ...item,
            returnAssessment: {
              inspected: true,
              hasNewDamage: returnDraft.hasNewDamage,
              damageDescription: returnDraft.hasNewDamage
                ? returnDraft.damageDescription
                : 'No new damage upon return.',
              estimateCost: effectiveCost,
              isMajorDamage: returnDraft.hasNewDamage ? returnDraft.isMajorDamage : false,
              professionalName: returnDraft.professionalName,
              professionalVerified: returnDraft.professionalVerified,
              estimatePresentedToCustomer: returnDraft.estimatePresentedToCustomer,
              informedDepositInsufficient: returnDraft.informedDepositInsufficient,
              customerPosPermission: returnDraft.customerPosPermission,
              settled: true,
              posRef
            }
          }
          : item
      )
    );
  };

  // Derived Phase 6 Math for Return Drawer
  const returnEffectiveCost = returnDraft.hasNewDamage
    ? Math.max(0, Number(returnDraft.estimateCost || 0))
    : 0;
  const returnDepositAmount = activeReturnBooking ? activeReturnBooking.deposit : 500;
  const depositApplied = Math.min(returnDepositAmount, returnEffectiveCost);
  const depositRefund = Math.max(0, returnDepositAmount - returnEffectiveCost);
  const excessPosDraw = Math.max(0, returnEffectiveCost - returnDepositAmount);

  return (
    <div className="min-h-screen print:min-h-0 bg-brand-canvas print:bg-white text-brand-ink flex flex-col">
      {/* =========================================================
          SUCCESS NOTIFICATION TOAST
         ========================================================= */}
      {successNotification && (
        <div className="fixed bottom-5 left-5 z-[70] max-w-lg bg-white border border-brand-border rounded-xl px-4 py-3.5 flex items-center gap-3.5 animate-fade-in print:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-palm text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-brand-ink leading-snug">{successNotification}</p>
          <button
            type="button"
            onClick={() => setSuccessNotification(null)}
            className="text-slate-400 hover:text-brand-ink cursor-pointer ml-1 p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================
          TOP UTILITY HEADER
         ========================================================= */}
      <header className="bg-brand-header print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between md:px-6 md:py-4 md:gap-6">
          <div className="px-4 py-3.5 md:p-0 flex items-center justify-center sm:justify-start min-w-0">
            <img
              src="/logo.jpg?v=4"
              alt="Take It Easy Car Rentals & Tours"
              className="block h-auto max-h-16 sm:max-h-20 md:max-h-20 lg:max-h-28 w-auto max-w-full select-none"
            />
          </div>

          <div className="px-4 py-2.5 border-t border-white/12 md:border-t-0 md:p-0 grid grid-cols-2 md:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeReturnBooking) openReturnDrawerFor(activeReturnBooking);
              }}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/16 hover:border-white/35 text-sm font-medium text-white transition-colors cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#66C7BF] shrink-0" />
              <span>Return & POS</span>
            </button>

            <button
              type="button"
              onClick={() => setDrawerMode('bookings')}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/16 hover:border-white/35 text-sm font-medium text-white transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#6BC47D] shrink-0" />
              <span>Contracts</span>
              <span className="px-2 py-0.5 rounded font-mono text-xs tabular-nums bg-brand-palm text-white">
                {reservations.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO BANNER SECTION
         ========================================================= */}
      <section className="bg-white py-5 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden border border-brand-border min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex items-center bg-brand-ink">
            <img
              src="/hero-banner.jpg"
              alt="Sleek rental SUV overlooking the Jamaican coastline at golden hour"
              className="absolute inset-0 w-full h-full object-cover object-[center_62%] select-none"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#112022]/90 via-[#112022]/60 to-[#112022]/10"
              aria-hidden="true"
            />

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">


              <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
                Take It Easy Across Jamaica.
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
                Direct airport pickup, transparent daily USD rates, and fast digital contract
                handoff
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/14 border border-white/20 backdrop-blur-xs text-xs sm:text-sm font-mono text-white tabular-nums">
                  From $60 USD / day
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/14 border border-white/20 backdrop-blur-xs text-xs sm:text-sm font-mono text-white">
                  <MapPin className="w-4 h-4 text-brand-amber shrink-0" />
                  {selectedLocation.shortName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/14 border border-white/20 backdrop-blur-xs text-xs sm:text-sm font-mono text-white">
                  <ShieldCheck className="w-4 h-4 text-[#6ED3C9] shrink-0" />
                  Digital Contract &amp; Check Sheet
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PERSISTENT STICKY SEARCH STRIP
         ========================================================= */}
      <div
        className={`sticky top-0 z-30 transition-colors print:hidden ${isStickyPinned
          ? 'bg-white/95 backdrop-blur-md border-b border-brand-border'
          : 'bg-white border-y border-brand-border'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-brand-border border-x border-brand-border bg-white">
            {/* 1. Pickup Location */}
            <div className="lg:col-span-4 px-4 py-3.5 hover:bg-brand-canvas/70 transition-colors">
              <label
                htmlFor="search-location"
                className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-slate-600 mb-1.5"
              >
                <MapPin className="w-4 h-4 text-brand-teal" />
                Pickup Airport / Office
              </label>
              <div className="relative flex items-center">
                <select
                  id="search-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-7 text-base font-semibold text-brand-ink focus:outline-none cursor-pointer truncate"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* 2. Pickup Date & Time */}
            <div className="lg:col-span-3 px-4 py-3.5 hover:bg-brand-canvas/70 transition-colors">
              <label
                htmlFor="search-pickup-date"
                className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-slate-600 mb-1.5"
              >
                <Calendar className="w-4 h-4 text-brand-teal" />
                Pickup Date & Time
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  id="search-pickup-date"
                  type="date"
                  value={pickupDate}
                  min={DEFAULT_PICKUP_DATE}
                  onChange={(e) => handlePickupDateChange(e.target.value)}
                  className="bg-transparent text-base font-semibold text-brand-ink tabular-nums focus:outline-none cursor-pointer min-w-0 flex-1"
                />
                <span className="h-4 w-px bg-brand-border shrink-0" />
                <select
                  aria-label="Pickup time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="bg-transparent text-sm font-mono font-medium text-slate-700 focus:outline-none cursor-pointer shrink-0"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Return Date */}
            <div className="lg:col-span-3 px-4 py-3.5 hover:bg-brand-canvas/70 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="search-return-date"
                  className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-slate-600"
                >
                  <Clock className="w-4 h-4 text-brand-teal" />
                  Return Date
                </label>
                <span className="text-xs font-mono font-semibold text-brand-amber-ink bg-brand-amber-soft border border-brand-amber-border px-2 py-0.5 rounded tabular-nums">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  id="search-return-date"
                  type="date"
                  value={returnDate}
                  min={addDays(pickupDate, 1)}
                  onChange={(e) => handleReturnDateChange(e.target.value)}
                  className="bg-transparent text-base font-semibold text-brand-ink tabular-nums focus:outline-none cursor-pointer min-w-0 flex-1"
                />
                <span className="h-4 w-px bg-brand-border shrink-0" />
                <select
                  aria-label="Return time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="bg-transparent text-sm font-mono font-medium text-slate-700 focus:outline-none cursor-pointer shrink-0"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Car Category */}
            <div className="lg:col-span-2 px-4 py-3.5 hover:bg-brand-canvas/70 transition-colors flex flex-col justify-center">
              <label
                htmlFor="search-category"
                className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-slate-600 mb-1.5"
              >
                <Car className="w-4 h-4 text-brand-teal" />
                Car Category
              </label>
              <div className="relative flex items-center">
                <select
                  id="search-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-7 text-base font-semibold text-brand-ink focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 pointer-events-none absolute right-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN FLEET GRID WITH INSTANT SPECS & PRICE BREAKDOWN
         ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 print:hidden">
        {/* Category Filter Tabs & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-5 border-b border-brand-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? FLEET.length
                  : FLEET.filter((v) => v.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-2 ${active
                    ? 'bg-brand-palm border-brand-palm text-white'
                    : 'bg-white border-brand-border text-slate-700 hover:border-brand-palm/40 hover:text-brand-ink'
                    }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`font-mono text-xs tabular-nums ${active ? 'text-white/80' : 'text-slate-400'
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
            <span className="text-slate-600 font-mono tabular-nums">
              {filteredFleet.length} options · {selectedLocation.code}
            </span>

            <div className="flex items-center gap-2 border border-brand-border bg-white rounded-lg px-3.5 py-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
              <label htmlFor="sort-select" className="text-slate-600">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-brand-ink focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mpg">Highest MPG</option>
                <option value="seats">Most Seats</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFleet.map((vehicle) => {
            const tripTotal = vehicle.ratePerDay * rentalDays;
            const isSelected =
              drawerMode === 'checkout' && activeVehicle?.id === vehicle.id;

            return (
              <article
                key={vehicle.id}
                className={`group bg-white rounded-xl border transition-colors flex flex-col overflow-hidden ${isSelected
                  ? 'border-brand-palm ring-1 ring-brand-palm'
                  : 'border-brand-border hover:border-brand-teal/60'
                  }`}
              >
                {/* Header */}
                <div className="p-5 pb-2.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-600">
                        {vehicle.categoryLabel}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-mono font-medium text-brand-palm bg-brand-palm-soft border border-brand-palm/25 px-2 py-0.5 rounded">
                        Ready · {selectedLocation.code}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-brand-ink">
                      {vehicle.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">or similar · {vehicle.subtitle}</p>
                  </div>

                  <span className="text-xs font-medium text-brand-amber-ink bg-brand-amber-soft border border-brand-amber-border px-2.5 py-1 rounded-md shrink-0">
                    {vehicle.badge}
                  </span>
                </div>

                {/* High-Res Profile Cutout */}
                <div className="relative bg-white px-6 py-4 h-48 flex items-center justify-center">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} profile cutout`}
                    loading="eager"
                    className="max-h-40 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] select-none"
                  />
                </div>

                {/* Instant Specs Bar */}
                <div className="grid grid-cols-4 divide-x divide-brand-border border-y border-brand-border bg-brand-canvas/80 text-center">
                  <div className="py-3 px-2 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink tabular-nums">
                      <Users className="w-4 h-4 text-brand-teal" />
                      <span>{vehicle.seats}</span>
                    </div>
                    <span className="text-xs font-mono uppercase text-slate-500">Seats</span>
                  </div>

                  <div className="py-3 px-2 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                      <Gauge className="w-4 h-4 text-brand-teal" />
                      <span>{vehicle.transmission}</span>
                    </div>
                    <span className="text-xs font-mono uppercase text-slate-500">Gearbox</span>
                  </div>

                  <div className="py-3 px-2 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink tabular-nums">
                      <Briefcase className="w-4 h-4 text-brand-teal" />
                      <span>{vehicle.luggage}</span>
                    </div>
                    <span className="text-xs font-mono uppercase text-slate-500">Bags</span>
                  </div>

                  <div className="py-3 px-2 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink tabular-nums">
                      <Fuel className="w-4 h-4 text-brand-teal" />
                      <span>{vehicle.mpg}</span>
                    </div>
                    <span className="text-xs font-mono uppercase text-slate-500">MPG</span>
                  </div>
                </div>

                {/* Price Breakdown & Book CTA */}
                <div className="p-5 flex items-center justify-between gap-4 mt-auto bg-white">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold tracking-tight text-brand-ink font-mono tabular-nums">
                        ${vehicle.ratePerDay}
                      </span>
                      <span className="text-sm text-slate-600">USD / day</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums mt-1">
                      ${tripTotal} ({rentalDays}d) + ${vehicle.deposit} card deposit
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCheckoutDrawer(vehicle)}
                    className="px-5 py-3 rounded-lg bg-brand-palm hover:bg-brand-palm-dark active:bg-brand-ink text-white text-base font-medium inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* 6-Phase Operational Summary Bar (Border-Divided Utility Overview) */}

      </main>

      {/* =========================================================
          MINIMAL FOOTER
         ========================================================= */}
      <footer className="border-t border-brand-border bg-white mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
          <span>© {CURRENT_YEAR} Take It Easy Car Rental. All rates in USD.</span>

        </div>
      </footer>

      {/* =========================================================
          INLINE RIGHT-HAND WORKFLOW DRAWER
         ========================================================= */}
      {drawerMode && (
        <div className="fixed inset-0 z-50 flex justify-end print:hidden">
          <div
            onClick={() => setDrawerMode(null)}
            className="fixed inset-0 bg-brand-ink/30 backdrop-blur-[1px] animate-fade-in"
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Rental Workflow Drawer"
            className="relative z-10 w-full max-w-[620px] bg-white border-l border-brand-border h-full flex flex-col animate-drawer-in"
          >
            {/* Subtle Brand Top Accent */}
            <div className="h-[3px] w-full bg-gradient-to-r from-brand-palm via-brand-teal to-brand-amber shrink-0" />

            {/* =====================================================
                MODE A: INLINE CHECKOUT & HANDOFF (PHASES 2, 3, 4)
               ===================================================== */}
            {drawerMode === 'checkout' && activeVehicle && (
              <>
                {/* Drawer Top Header */}
                <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between gap-3 bg-white">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium block">
                      {confirmedReservation
                        ? 'Phase 4 Complete · Vehicle Handed Off'
                        : 'Office Intake, Inspection & Contract'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-brand-ink mt-0.5">
                      {confirmedReservation
                        ? `Contract ${confirmedReservation.id}`
                        : `${activeVehicle.name} (${activeVehicle.categoryLabel})`}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDrawerMode(null)}
                    className="p-2.5 rounded-lg border border-brand-border text-slate-600 hover:text-brand-ink hover:border-brand-teal/50 transition-colors cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Progress Bar inside Drawer (when not yet finalized) */}
                {!confirmedReservation && (
                  <div className="grid grid-cols-3 divide-x divide-brand-border border-b border-brand-border bg-brand-canvas/80 text-sm">
                    {[
                      { num: 2, label: '02 Office App' },
                      { num: 3, label: '03 Check Sheet' },
                      { num: 4, label: '04 Sign & Pay' }
                    ].map((s) => {
                      const active = checkoutStep === s.num;
                      const done = checkoutStep > s.num;
                      return (
                        <button
                          key={s.num}
                          type="button"
                          onClick={() => {
                            if (s.num < checkoutStep) {
                              setFormError('');
                              setCheckoutStep(s.num);
                            } else if (s.num === 3 && validateStep2()) {
                              setCheckoutStep(3);
                            } else if (s.num === 4 && validateStep2() && validateStep3()) {
                              setCheckoutStep(4);
                            }
                          }}
                          className={`py-3 px-3 font-mono text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${active
                            ? 'bg-white text-brand-palm font-semibold border-b-2 border-brand-palm'
                            : done
                              ? 'text-brand-palm hover:bg-white/60 font-medium'
                              : 'text-slate-400'
                            }`}
                        >
                          {done && <Check className="w-4 h-4 text-brand-palm" />}
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* CONFIRMED HANDOFF SUMMARY */}
                {confirmedReservation ? (
                  <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
                    <div className="p-6 bg-brand-palm-soft/70">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-palm text-white text-sm font-medium mb-2.5">
                        <Check className="w-4 h-4" />
                        <span>Keys Released · Signed Original Archived</span>
                      </div>
                      <p className="text-base font-semibold text-brand-ink">
                        {confirmedReservation.driver.fullName} — {confirmedReservation.vehicle.name}
                      </p>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        Digital contract & check sheet delivered via{' '}
                        <strong className="font-semibold text-brand-ink">
                          {confirmedReservation.sendViaWhatsApp ? 'Email and WhatsApp' : 'Email'}
                        </strong>{' '}
                        ({confirmedReservation.driver.email}
                        {confirmedReservation.sendViaWhatsApp && confirmedReservation.driver.phone
                          ? ` · ${confirmedReservation.driver.phone}`
                          : ''}
                        ), and signed original contract + check sheet retained by office.
                      </p>
                    </div>

                    <div className="p-6 space-y-2.5 text-sm font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Check Sheet Status</span>
                        <span className="text-brand-ink font-semibold">
                          {confirmedReservation.inspection.noExistingDamage
                            ? 'NO EXISTING DAMAGE (Signed ✓)'
                            : `${confirmedReservation.inspection.damagedZones.length} Zones (Signed ✓)`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dual Videos</span>
                        <span className="text-brand-palm font-medium">Customer ✓ · Agent ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Rental Rate ({confirmedReservation.rentalDays}d × $
                          {confirmedReservation.vehicle.ratePerDay})
                        </span>
                        <span className="text-brand-ink font-medium">
                          ${confirmedReservation.subtotal}.00 (
                          {confirmedReservation.rentalPaymentMethod.toUpperCase()})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Card Security Deposit (•••• {confirmedReservation.cardLast4})
                        </span>
                        <span className="text-brand-ink font-medium">
                          ${confirmedReservation.deposit}.00 Held
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => setDossierBooking(confirmedReservation)}
                        className="w-full py-3 px-4 rounded-lg border border-brand-border hover:border-brand-teal/50 bg-white text-sm font-medium text-brand-ink flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck2 className="w-4 h-4 text-brand-teal" />
                        <span>View Signed Contract & Check Sheet (Customer / Office Copy)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openReturnDrawerFor(confirmedReservation)}
                        className="w-full py-3.5 px-4 rounded-lg bg-brand-palm hover:bg-brand-palm-dark text-sm font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Proceed to Vehicle Return & POS Assessment (Phase 5 & 6)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ACTIVE CHECKOUT STEPS (PHASES 2, 3, 4) */
                  <form
                    onSubmit={handleFinalizeContractAndPayment}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
                      {/* Compact Vehicle & Price Quote Banner (Phase 1 Carryover) */}
                      <div className="p-5 flex items-center gap-4 bg-brand-canvas/70">
                        <div className="w-28 h-16 bg-white border border-brand-border rounded-lg p-1.5 flex items-center justify-center shrink-0">
                          <img
                            src={activeVehicle.image}
                            alt={activeVehicle.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono uppercase text-slate-500">
                              Phase 1 Quote · {rentalDays}d ({formatShortDate(pickupDate)} →{' '}
                              {formatShortDate(returnDate)})
                            </span>
                            <span className="text-sm font-mono font-semibold text-brand-palm tabular-nums">
                              ${activeVehicle.ratePerDay}/day
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-brand-ink truncate mt-0.5">
                            ${activeVehicle.ratePerDay * rentalDays}.00 rental + $
                            {activeVehicle.deposit}.00 card security deposit
                          </p>
                          <p className="text-xs text-slate-600 truncate mt-0.5">
                            {selectedLocation.shortName}
                          </p>
                        </div>
                      </div>

                      {/* =================================================
                          STEP 2: PHASE 2 — OFFICE DOCUMENTATION & APPLICATION
                         ================================================= */}
                      {checkoutStep === 2 && (
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium">
                                Phase 2 · Rental Office Desk
                              </span>
                              <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                                Customer Identification & Rental Application
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                Request physical ID and capture name, date of birth, license
                                expiration date, and email.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={fillDemoApplication}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-white hover:border-brand-teal/50 text-xs font-medium text-brand-ink shrink-0 cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-brand-amber" />
                              <span>Autofill ID</span>
                            </button>
                          </div>

                          {/* Application Form Grid */}
                          <div className="border border-brand-border rounded-lg divide-y divide-brand-border bg-white overflow-hidden">
                            <div className="px-4 py-3">
                              <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                Customer Full Legal Name *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Nadine Wright"
                                value={driver.fullName}
                                onChange={(e) =>
                                  setDriver({ ...driver, fullName: e.target.value })
                                }
                                className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Date of Birth *
                                </label>
                                <input
                                  type="date"
                                  value={driver.dob}
                                  onChange={(e) => setDriver({ ...driver, dob: e.target.value })}
                                  className="w-full text-base text-brand-ink tabular-nums focus:outline-none mt-1"
                                />
                              </div>

                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  License Expiration Date *
                                </label>
                                <input
                                  type="date"
                                  value={driver.licenseExpiry}
                                  onChange={(e) =>
                                    setDriver({ ...driver, licenseExpiry: e.target.value })
                                  }
                                  className="w-full text-base text-brand-ink tabular-nums focus:outline-none mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Driver’s License / ID # *
                                </label>
                                <input
                                  type="text"
                                  placeholder="JM-9940182-B"
                                  value={driver.licenseNumber}
                                  onChange={(e) =>
                                    setDriver({ ...driver, licenseNumber: e.target.value })
                                  }
                                  className="w-full text-base font-mono text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                                />
                              </div>

                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  CONTACT PHONE (INCLUDE COUNTRY CODE) *
                                </label>
                                <input
                                  type="tel"
                                  placeholder="+1 (876) 555-0842"
                                  value={driver.phone}
                                  onChange={(e) =>
                                    setDriver({ ...driver, phone: e.target.value })
                                  }
                                  className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1 tabular-nums"
                                />
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                Email Address (For Contract Copy) *
                              </label>
                              <input
                                type="email"
                                placeholder="customer@email.com"
                                value={driver.email}
                                onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                                className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                              />
                            </div>
                          </div>

                          {/* WhatsApp Digital Contract Delivery */}
                          <label className="p-4 rounded-lg border border-slate-200 bg-white flex items-start gap-3.5 cursor-pointer hover:border-slate-300 transition-colors">
                            <input
                              type="checkbox"
                              checked={sendViaWhatsApp}
                              onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                              className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                            />
                            <div className="text-sm">
                              <span className="font-semibold text-zinc-950 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-zinc-950 shrink-0" />
                                Send Contract via WhatsApp
                              </span>
                              <p className="text-slate-600 mt-1 leading-snug">
                                Deliver a digital copy of the contract and check sheet to the
                                customer&apos;s WhatsApp.
                              </p>
                            </div>
                          </label>

                          {/* Agent Physical Identification Verification */}
                          <label className="p-4 rounded-lg border border-slate-200 bg-white flex items-start gap-3.5 cursor-pointer hover:border-slate-300 transition-colors">
                            <input
                              type="checkbox"
                              checked={driver.idVerified}
                              onChange={(e) =>
                                setDriver({ ...driver, idVerified: e.target.checked })
                              }
                              className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                            />
                            <div className="text-sm">
                              <span className="font-semibold text-zinc-950 flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-zinc-950 shrink-0" />
                                Physical Identification Inspected & Verified by Agent
                              </span>
                              <p className="text-slate-600 mt-1 leading-snug">
                                Confirm customer proceeded to the office and presented valid physical
                                Driver’s License / ID matching the application above.
                              </p>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* =================================================
                          STEP 3: PHASE 3 — DESIGNATED CHECK SHEET & VIDEOS
                         ================================================= */}
                      {checkoutStep === 3 && (
                        <div className="p-6 space-y-4">
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium">
                              Phase 3 · Vehicle Inspection & Handoff
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                              Designated Check Sheet & Dual Walkaround Videos
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Document existing damage or explicitly note no existing damage, record
                              both videos, and collect customer check-sheet confirmation signature.
                            </p>
                          </div>

                          {/* Explicit "No Existing Damage" Toggle */}
                          <label
                            className={`p-4 rounded-lg border flex items-center justify-between gap-3.5 cursor-pointer transition-colors ${noExistingDamage
                              ? 'bg-brand-palm border-brand-palm text-white'
                              : 'bg-white border-brand-border text-brand-ink hover:border-brand-teal/50'
                              }`}
                          >
                            <div className="text-sm">
                              <span className="font-mono font-semibold uppercase tracking-wider block">
                                Explicitly Note: NO Existing Damage on Vehicle
                              </span>
                              <span
                                className={
                                  noExistingDamage ? 'text-white/80 text-xs mt-0.5 block' : 'text-slate-600 text-xs mt-0.5 block'
                                }
                              >
                                Certified clean body, glass, tires, and interior on check sheet
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={noExistingDamage}
                              onChange={(e) => handleToggleNoExistingDamage(e.target.checked)}
                              className="w-5 h-5 accent-white rounded cursor-pointer shrink-0"
                            />
                          </label>

                          {/* Zone Selector Pills */}
                          <div className="space-y-2.5">
                            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                              Or Tap Zones to Log Existing Scratches / Dents on Check Sheet:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {VEHICLE_CHECK_ZONES.map((zone) => {
                                const marked = damagedZones.includes(zone.label);
                                return (
                                  <button
                                    key={zone.id}
                                    type="button"
                                    onClick={() => toggleDamageZone(zone.label)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${marked
                                      ? 'bg-brand-amber-soft border-brand-amber text-brand-amber-ink'
                                      : 'bg-white border-brand-border text-slate-700 hover:border-brand-teal/50'
                                      }`}
                                  >
                                    {marked ? `⚠ ${zone.label}` : zone.label}
                                  </button>
                                );
                              })}
                            </div>

                            <textarea
                              rows={2}
                              value={inspectionNotes}
                              onChange={(e) => setInspectionNotes(e.target.value)}
                              className="w-full p-3 rounded-lg border border-brand-border text-sm text-brand-ink focus:border-brand-palm focus:outline-none"
                              placeholder="Check sheet inspection remarks..."
                            />
                          </div>

                          {/* Dual Video Recording Verification */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setCustomerVideoRecorded((v) => !v)}
                              className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${customerVideoRecorded
                                ? 'bg-brand-palm-soft border-brand-palm/40 text-brand-ink'
                                : 'bg-white border-brand-border hover:border-brand-teal/50 text-brand-ink'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                  <Video className="w-4 h-4 text-brand-teal" />
                                  1. Customer Video
                                </span>
                                <span className={`text-xs font-mono uppercase font-medium ${customerVideoRecorded ? 'text-brand-palm' : 'text-slate-500'}`}>
                                  {customerVideoRecorded ? 'Recorded ✓' : 'Required'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5 leading-snug">
                                Agent asked customer to record 360° video of vehicle condition.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAgentVideoRecorded((v) => !v)}
                              className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${agentVideoRecorded
                                ? 'bg-brand-palm-soft border-brand-palm/40 text-brand-ink'
                                : 'bg-white border-brand-border hover:border-brand-teal/50 text-brand-ink'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                  <Camera className="w-4 h-4 text-brand-teal" />
                                  2. Agent Video
                                </span>
                                <span className={`text-xs font-mono uppercase font-medium ${agentVideoRecorded ? 'text-brand-palm' : 'text-slate-500'}`}>
                                  {agentVideoRecorded ? 'Recorded ✓' : 'Required'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5 leading-snug">
                                Agent recorded official pre-handoff vehicle condition video.
                              </p>
                            </button>
                          </div>

                          {/* Check Sheet Confirmation Signature */}
                          <SignaturePad
                            label="Check Sheet Confirmation Signature *"
                            sublabel={
                              noExistingDamage
                                ? 'Sign to confirm NO existing damage on check sheet'
                                : `Sign to confirm ${damagedZones.length} pre-existing zone(s) noted`
                            }
                            value={checkSheetSignature}
                            onChange={setCheckSheetSignature}
                            defaultTypedName={driver.fullName}
                          />
                        </div>
                      )}

                      {/* =================================================
                          STEP 4: PHASE 4 — CONTRACT REVIEW, SIGN & PAYMENT
                         ================================================= */}
                      {checkoutStep === 4 && (
                        <div className="p-6 space-y-4">
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium">
                              Phase 4 · Contract Review, Signature & Payment
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                              Liability Disclosure, Contract Signing & Split Payment
                            </h3>
                          </div>

                          {/* Contract Clauses & Mandatory Disclosures */}
                          <div className="border border-brand-border rounded-lg divide-y divide-brand-border bg-white text-sm">
                            <label className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-brand-canvas/60">
                              <input
                                type="checkbox"
                                checked={ackDamageResponsibility}
                                onChange={(e) => setAckDamageResponsibility(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink block">
                                  1. Full Responsibility for Damages & Accidents
                                </span>
                                <span className="text-slate-600 mt-0.5 block leading-snug">
                                  Agent reviewed contract & check sheet with {driver.fullName || 'customer'},
                                  explaining they are responsible for covering any damages or
                                  accidents to the rental vehicle.
                                </span>
                              </div>
                            </label>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer bg-brand-amber-soft/60 hover:bg-brand-amber-soft">
                              <input
                                type="checkbox"
                                checked={ackThirdPartyInsurance}
                                onChange={(e) => setAckThirdPartyInsurance(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4 text-brand-amber-ink shrink-0" />
                                  2. Third-Party Insurance Policy Clarification
                                </span>
                                <span className="text-slate-700 mt-0.5 block leading-snug">
                                  Clarified that Take It Easy Car Rental uses{' '}
                                  <strong className="text-brand-ink">third-party insurance</strong>,
                                  which covers the <u>other person’s vehicle</u> in an accident, and{' '}
                                  <strong className="text-brand-ink">
                                    does NOT cover the rental vehicle
                                  </strong>
                                  .
                                </span>
                              </div>
                            </label>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-brand-canvas/60">
                              <input
                                type="checkbox"
                                checked={copiesDistributed}
                                onChange={(e) => setCopiesDistributed(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink block">
                                  3. Customer Copy & Office Original Retained
                                </span>
                                <span className="text-slate-600 mt-0.5 block leading-snug">
                                  Customer receives a copy of the contract and check sheet; office
                                  keeps the original signed documents.
                                </span>
                              </div>
                            </label>
                          </div>

                          {/* Interactive Rental Contract Signature */}
                          <SignaturePad
                            label="Rental Contract Signature *"
                            sublabel="Sign below to execute the Take It Easy Rental Agreement"
                            value={contractSignature}
                            onChange={setContractSignature}
                            defaultTypedName={driver.fullName}
                          />

                          {/* Strict Split Payment Policy */}
                          <div className="space-y-3.5 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-600">
                                Strict Payment Policy
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-teal font-medium">
                                <Lock className="w-4 h-4" />
                                Card Deposit Mandatory
                              </span>
                            </div>

                            {/* Part A: Rental Rate (Cash or Card) */}
                            <div>
                              <span className="block text-sm text-slate-700 mb-2">
                                Rental Rate (${activeVehicle.ratePerDay * rentalDays}.00 USD) — Cash
                                or Card accepted:
                              </span>
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setRentalPaymentMethod('cash')}
                                  className={`py-2.5 px-3.5 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${rentalPaymentMethod === 'cash'
                                    ? 'bg-brand-palm border-brand-palm text-white'
                                    : 'bg-white border-brand-border text-slate-700 hover:border-brand-teal/50'
                                    }`}
                                >
                                  <Banknote className="w-4 h-4" />
                                  <span>Cash (Rental Rate)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRentalPaymentMethod('card')}
                                  className={`py-2.5 px-3.5 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${rentalPaymentMethod === 'card'
                                    ? 'bg-brand-palm border-brand-palm text-white'
                                    : 'bg-white border-brand-border text-slate-700 hover:border-brand-teal/50'
                                    }`}
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Card (Rental Rate)</span>
                                </button>
                              </div>
                            </div>

                            {/* Part B: Security Deposit ($500 Card Only — Cash Blocked) */}
                            <div className="p-3.5 rounded-lg bg-brand-canvas border border-brand-border space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-brand-ink">
                                  Security Deposit: ${activeVehicle.deposit}.00 USD (Card Only)
                                </span>
                                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
                                  Cash Never Accepted
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                                Cash is never accepted for the deposit so additional funds can be
                                collected via POS if damages exceed the initial $500.
                              </p>
                            </div>

                            {/* Card on File Input */}
                            <div className="border border-brand-border rounded-lg divide-y divide-brand-border bg-white overflow-hidden">
                              <div className="px-4 py-2.5">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Cardholder Name on File *
                                </label>
                                <input
                                  type="text"
                                  placeholder="NADINE WRIGHT"
                                  value={card.holder}
                                  onChange={(e) =>
                                    setCard({ ...card, holder: e.target.value.toUpperCase() })
                                  }
                                  className="w-full text-base font-mono text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                                />
                              </div>

                              <div className="px-4 py-2.5">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Card Number (Tokenized for $500 Deposit & POS) *
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="4532 •••• •••• 7741"
                                  value={card.number}
                                  onChange={(e) =>
                                    setCard({ ...card, number: formatCardNumber(e.target.value) })
                                  }
                                  className="w-full text-base font-mono text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1 tabular-nums"
                                />
                              </div>

                              <div className="grid grid-cols-2 divide-x divide-brand-border">
                                <div className="px-4 py-2.5">
                                  <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                    Expiry (MM/YY) *
                                  </label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="09/29"
                                    value={card.expiry}
                                    onChange={(e) =>
                                      setCard({ ...card, expiry: formatExpiry(e.target.value) })
                                    }
                                    className="w-full text-base font-mono text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1 tabular-nums"
                                  />
                                </div>
                                <div className="px-4 py-2.5">
                                  <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                    CVC *
                                  </label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="618"
                                    value={card.cvc}
                                    onChange={(e) =>
                                      setCard({
                                        ...card,
                                        cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                                      })
                                    }
                                    className="w-full text-base font-mono text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1 tabular-nums"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky Checkout Footer */}
                    <div className="border-t border-brand-border bg-white p-5 space-y-3">
                      {formError && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>{formError}</span>
                        </div>
                      )}

                      {checkoutStep < 4 ? (
                        <div className="flex items-center gap-2.5">
                          {checkoutStep > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormError('');
                                setCheckoutStep((s) => s - 1);
                              }}
                              className="px-4 py-3 rounded-lg border border-brand-border hover:border-brand-teal/50 text-sm font-medium text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleAdvanceStep}
                            className="flex-1 py-3 px-4 rounded-lg bg-brand-palm hover:bg-brand-palm-dark text-white text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <span>
                              {checkoutStep === 2
                                ? 'Continue to Inspection & Check Sheet (Phase 3)'
                                : 'Continue to Contract Signing & Payment (Phase 4)'}
                            </span>
                            <ArrowRight className="w-5 h-5 shrink-0" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs sm:text-sm font-mono tabular-nums text-slate-600">
                            <span>
                              Rental ({rentalPaymentMethod.toUpperCase()}) + Mandatory Card Deposit
                            </span>
                            <span className="font-semibold text-brand-ink">
                              ${activeVehicle.ratePerDay * rentalDays}.00 + ${activeVehicle.deposit}
                              .00 Hold
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setFormError('');
                                setCheckoutStep(3);
                              }}
                              className="px-4 py-3 rounded-lg border border-brand-border hover:border-brand-teal/50 text-sm font-medium text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3 px-4 rounded-lg bg-brand-palm hover:bg-brand-palm-dark text-white text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-5 h-5 shrink-0" />
                              <span>Execute Signed Contract & Authorize $500 Hold</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}

            {/* =====================================================
                MODE B: CONTRACTS & ACTIVE RENTALS LIST
               ===================================================== */}
            {drawerMode === 'bookings' && (
              <>
                <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between gap-3 bg-white">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium block">
                      Office File & Active Fleet
                    </span>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-brand-ink mt-0.5">
                      Signed Contracts ({reservations.length})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerMode(null)}
                    className="p-2.5 rounded-lg border border-brand-border text-slate-600 hover:text-brand-ink cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-5 space-y-3.5 hover:bg-brand-canvas/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-mono font-semibold text-brand-ink bg-brand-canvas border border-brand-border px-2.5 py-0.5 rounded">
                          {res.id}
                        </span>
                        <span
                          className={`text-xs font-mono font-medium ${res.returnAssessment?.settled ? 'text-slate-600' : 'text-brand-palm'
                            }`}
                        >
                          {res.returnAssessment?.settled
                            ? `✓ Return Settled (${res.returnAssessment.posRef})`
                            : '● Out on Road'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <img
                          src={res.vehicle.image}
                          alt={res.vehicle.name}
                          className="w-24 h-14 object-contain mix-blend-multiply shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-brand-ink">{res.vehicle.name}</p>
                          <p className="text-sm text-slate-600">
                            {res.driver.fullName} · Card •••• {res.cardLast4}
                          </p>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <p className="text-base font-semibold text-brand-ink">${res.subtotal}</p>
                          <p className="text-xs text-slate-500">+${res.deposit} hold</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setDossierBooking(res)}
                          className="flex-1 py-2.5 px-3 rounded-lg border border-brand-border bg-white hover:border-brand-teal/50 text-sm font-medium text-brand-ink cursor-pointer"
                        >
                          Contract & Check Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => openReturnDrawerFor(res)}
                          className="flex-1 py-2.5 px-3 rounded-lg bg-brand-palm hover:bg-brand-palm-dark text-sm font-medium text-white transition-colors cursor-pointer"
                        >
                          {res.returnAssessment?.settled
                            ? 'Review Return POS'
                            : 'Return & POS (Phase 5–6)'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* =====================================================
                MODE C: PHASE 5 & PHASE 6 — RETURN & POS RESOLUTION
               ===================================================== */}
            {drawerMode === 'return' && activeReturnBooking && (
              <>
                <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between gap-3 bg-white">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium block">
                      Phase 5 & Phase 6 · Return Inspection & POS Machine
                    </span>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-brand-ink mt-0.5">
                      {activeReturnBooking.vehicle.name} · {activeReturnBooking.id}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerMode(null)}
                    className="p-2.5 rounded-lg border border-brand-border text-slate-600 hover:text-brand-ink cursor-pointer"
                    aria-label="Close return drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
                  {/* Rental Selector if multiple contracts exist */}
                  {reservations.length > 1 && (
                    <div className="px-6 py-3.5 bg-brand-canvas flex items-center justify-between gap-3 text-sm">
                      <span className="font-mono text-slate-600">Active Contract:</span>
                      <select
                        value={activeReturnBooking.id}
                        onChange={(e) => {
                          const found = reservations.find((r) => r.id === e.target.value);
                          if (found) openReturnDrawerFor(found);
                        }}
                        className="border border-brand-border rounded-lg bg-white px-3 py-1.5 font-mono text-sm text-brand-ink"
                      >
                        {reservations.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.id} — {r.driver.fullName} ({r.vehicle.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Outgoing Check Sheet Baseline */}
                  <div className="p-5 bg-brand-canvas/60 text-sm space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono uppercase text-slate-500">
                        Outgoing Phase 3 Baseline ({activeReturnBooking.driver.fullName})
                      </span>
                      <button
                        type="button"
                        onClick={() => setDossierBooking(activeReturnBooking)}
                        className="text-xs sm:text-sm font-medium text-brand-palm underline cursor-pointer"
                      >
                        View Original Check Sheet
                      </button>
                    </div>
                    <p className="text-slate-600">
                      {activeReturnBooking.inspection.noExistingDamage
                        ? 'Explicitly noted at handoff: NO existing damage. Dual videos on file.'
                        : `Outgoing zones noted: ${activeReturnBooking.inspection.damagedZones.join(', ')}.`}
                    </p>
                  </div>

                  {/* PHASE 5: VEHICLE RETURN & DAMAGE ASSESSMENT */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium">
                          Phase 5 · Post-Rental Lot Inspection
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                          Return Check Sheet & Damage Assessment
                        </h3>
                      </div>

                      <div className="inline-flex rounded-lg border border-brand-border bg-white p-0.5 text-sm">
                        <button
                          type="button"
                          onClick={() =>
                            setReturnDraft({
                              ...returnDraft,
                              hasNewDamage: false,
                              estimateCost: 0,
                              isMajorDamage: false
                            })
                          }
                          className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${!returnDraft.hasNewDamage
                            ? 'bg-brand-palm text-white'
                            : 'text-slate-600 hover:text-brand-ink'
                            }`}
                        >
                          No Damage
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setReturnDraft({
                              ...returnDraft,
                              hasNewDamage: true,
                              estimateCost:
                                returnDraft.estimateCost > 0 ? returnDraft.estimateCost : 850
                            })
                          }
                          className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${returnDraft.hasNewDamage
                            ? 'bg-brand-palm text-white'
                            : 'text-slate-600 hover:text-brand-ink'
                            }`}
                        >
                          Damage Present
                        </button>
                      </div>
                    </div>

                    {returnDraft.hasNewDamage ? (
                      <div className="space-y-3.5">
                        {/* Quick Presets */}
                        <div>
                          <span className="block text-xs font-mono uppercase text-slate-500 mb-2">
                            Quick Test Scenarios (Under $500 vs. Major &gt;$500):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {RETURN_DAMAGE_PRESETS.map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() =>
                                  setReturnDraft({
                                    ...returnDraft,
                                    hasNewDamage: true,
                                    damageDescription: p.description,
                                    estimateCost: p.cost,
                                    isMajorDamage: p.major
                                  })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border cursor-pointer transition-colors ${returnDraft.estimateCost === p.cost
                                  ? 'bg-brand-palm border-brand-palm text-white'
                                  : 'bg-white border-brand-border text-slate-700 hover:border-brand-teal/50'
                                  }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Check Sheet Damage Type & Estimate */}
                        <div className="border border-brand-border rounded-lg divide-y divide-brand-border bg-white overflow-hidden">
                          <div className="px-4 py-3">
                            <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                              Damage Type Noted Directly on Check Sheet *
                            </label>
                            <textarea
                              rows={2}
                              value={returnDraft.damageDescription}
                              onChange={(e) =>
                                setReturnDraft({
                                  ...returnDraft,
                                  damageDescription: e.target.value
                                })
                              }
                              className="w-full text-sm text-brand-ink focus:outline-none mt-1.5"
                            />
                          </div>

                          <div className="px-4 py-3 flex items-center justify-between gap-4">
                            <label className="text-xs font-mono font-medium uppercase text-slate-500">
                              Check Sheet Repair Estimate ($ USD) *
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={returnDraft.estimateCost}
                              onChange={(e) =>
                                setReturnDraft({
                                  ...returnDraft,
                                  estimateCost: Number(e.target.value)
                                })
                              }
                              className="w-32 text-right font-mono text-lg font-semibold text-brand-ink tabular-nums focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Major Damage — Professional Estimator */}
                        <div className="p-4 rounded-lg border border-brand-border bg-brand-canvas space-y-3 text-sm">
                          <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <span className="font-semibold text-brand-ink flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-brand-teal shrink-0" />
                              Major Damage — Bring in Professional for Accurate Estimate
                            </span>
                            <input
                              type="checkbox"
                              checked={returnDraft.isMajorDamage}
                              onChange={(e) =>
                                setReturnDraft({
                                  ...returnDraft,
                                  isMajorDamage: e.target.checked
                                })
                              }
                              className="w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                            />
                          </label>

                          {returnDraft.isMajorDamage && (
                            <div className="space-y-2.5 pt-2 border-t border-brand-border">
                              <input
                                type="text"
                                value={returnDraft.professionalName}
                                onChange={(e) =>
                                  setReturnDraft({
                                    ...returnDraft,
                                    professionalName: e.target.value
                                  })
                                }
                                placeholder="Professional Estimator Name & Shop"
                                className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-ink"
                              />
                              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={returnDraft.professionalVerified}
                                  onChange={(e) =>
                                    setReturnDraft({
                                      ...returnDraft,
                                      professionalVerified: e.target.checked
                                    })
                                  }
                                  className="w-4 h-4 accent-brand-palm rounded shrink-0"
                                />
                                <span>
                                  Professional inspected vehicle and provided accurate estimate ($
                                  {returnEffectiveCost}.00)
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg border border-brand-palm/30 bg-brand-palm-soft text-sm text-brand-ink">
                        Vehicle inspected with zero new damage. Full ${returnDepositAmount}.00
                        security deposit hold can be released.
                      </div>
                    )}
                  </div>

                  {/* PHASE 6: DAMAGE RESOLUTION & POS DRAW */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-brand-teal font-medium">
                        Phase 6 · Damage Resolution & POS Terminal
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                        Card Settlement ({activeReturnBooking.cardHolder} · ••••{' '}
                        {activeReturnBooking.cardLast4})
                      </h3>
                    </div>

                    {/* Financial Split Grid */}
                    <div className="grid grid-cols-3 divide-x divide-brand-border border border-brand-border rounded-lg bg-white text-center font-mono tabular-nums">
                      <div className="p-3.5">
                        <span className="text-xs uppercase text-slate-500 block mb-0.5">Estimate</span>
                        <span className="text-base sm:text-lg font-semibold text-brand-ink">
                          ${returnEffectiveCost}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <span className="text-xs uppercase text-slate-500 block mb-0.5">
                          From $500 Hold
                        </span>
                        <span className="text-base sm:text-lg font-semibold text-brand-ink">
                          ${depositApplied}
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Refund: ${depositRefund}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <span className="text-xs uppercase text-slate-500 block mb-0.5">
                          Extra POS Draw
                        </span>
                        <span
                          className={`text-base sm:text-lg font-semibold ${excessPosDraw > 0 ? 'text-rose-600' : 'text-brand-ink'
                            }`}
                        >
                          ${excessPosDraw}
                        </span>
                      </div>
                    </div>

                    {returnDraft.hasNewDamage && returnEffectiveCost > 0 && (
                      <div className="border border-brand-border rounded-lg divide-y divide-brand-border bg-white text-sm">
                        <label className="p-3.5 flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={returnDraft.estimatePresentedToCustomer}
                            onChange={(e) =>
                              setReturnDraft({
                                ...returnDraft,
                                estimatePresentedToCustomer: e.target.checked
                              })
                            }
                            className="mt-0.5 w-5 h-5 accent-brand-palm rounded shrink-0"
                          />
                          <span>
                            1. Damage estimate (${returnEffectiveCost}.00 USD) has been presented to{' '}
                            <strong className="text-brand-ink">
                              {activeReturnBooking.driver.fullName}
                            </strong>
                            .
                          </span>
                        </label>

                        {excessPosDraw > 0 && (
                          <>
                            <label className="p-3.5 flex items-start gap-3 cursor-pointer bg-brand-amber-soft/60">
                              <input
                                type="checkbox"
                                checked={returnDraft.informedDepositInsufficient}
                                onChange={(e) =>
                                  setReturnDraft({
                                    ...returnDraft,
                                    informedDepositInsufficient: e.target.checked
                                  })
                                }
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded shrink-0"
                              />
                              <span>
                                2. Informed customer that the initial{' '}
                                <strong>$500.00 security deposit is insufficient</strong> to cover
                                the ${returnEffectiveCost}.00 repair estimate.
                              </span>
                            </label>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer bg-rose-50/40">
                              <input
                                type="checkbox"
                                checked={returnDraft.customerPosPermission}
                                onChange={(e) =>
                                  setReturnDraft({
                                    ...returnDraft,
                                    customerPosPermission: e.target.checked
                                  })
                                }
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded shrink-0"
                              />
                              <span>
                                3. <strong>Customer Permission Granted:</strong> Customer authorizes
                                agent to use the POS machine to draw the remaining{' '}
                                <strong className="text-rose-700">${excessPosDraw}.00 USD</strong>{' '}
                                from card on file (•••• {activeReturnBooking.cardLast4}).
                              </span>
                            </label>
                          </>
                        )}
                      </div>
                    )}

                    {/* Settled Receipt Banner */}
                    {activeReturnBooking.returnAssessment?.settled && (
                      <div className="p-4 rounded-lg border border-brand-palm/35 bg-brand-palm-soft flex items-center justify-between gap-3 text-sm">
                        <div>
                          <p className="font-semibold text-brand-ink">
                            POS Settlement Complete · {activeReturnBooking.returnAssessment.posRef}
                          </p>
                          <p className="text-brand-palm-dark text-xs sm:text-sm font-mono mt-0.5">
                            Total Charged to Card •••• {activeReturnBooking.cardLast4}: $
                            {activeReturnBooking.returnAssessment.estimateCost}.00 USD
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDossierBooking(activeReturnBooking)}
                          className="px-3.5 py-2 rounded-lg bg-white border border-brand-palm/30 font-medium text-brand-ink cursor-pointer shrink-0"
                        >
                          View Dossier
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Return POS Footer */}
                <div className="border-t border-brand-border bg-white p-5 space-y-3">
                  {returnError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{returnError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    {activeReturnBooking.returnAssessment?.settled && (
                      <button
                        type="button"
                        onClick={() =>
                          setReservations((prev) =>
                            prev.map((r) =>
                              r.id === activeReturnBooking.id
                                ? {
                                  ...r,
                                  returnAssessment: { ...r.returnAssessment, settled: false }
                                }
                                : r
                            )
                          )
                        }
                        className="px-4 py-3 rounded-lg border border-brand-border text-sm font-medium text-slate-700 hover:text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Re-run</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleProcessReturnPos}
                      className="flex-1 py-3.5 px-4 rounded-lg bg-brand-palm hover:bg-brand-palm-dark text-white text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5 shrink-0" />
                      <span>
                        {returnEffectiveCost === 0
                          ? `Release Full $${returnDepositAmount} Card Deposit`
                          : excessPosDraw > 0
                            ? `Capture $${returnDepositAmount} + Draw $${excessPosDraw} on POS`
                            : `Charge $${depositApplied} to Card Deposit`}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* =========================================================
          OFFICIAL SIGNED CONTRACT & CHECK SHEET MODAL
         ========================================================= */}
      {dossierBooking && (
        <ContractDossierModal
          booking={dossierBooking}
          onClose={() => setDossierBooking(null)}
        />
      )}
    </div>
  );
}
