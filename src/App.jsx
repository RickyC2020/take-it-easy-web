import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Pencil,
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
import TourPackages from './components/TourPackages';
import WhatsAppWidget from './components/WhatsAppWidget';
import ScrollToTop from './components/ScrollToTop';
import PublicCheckoutModal from './components/PublicCheckoutModal';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ContactSection from './components/ContactSection';
import ContactModal from './components/ContactModal';
import RentalInfoModal from './components/RentalInfoModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

// --- LOCATIONS & FLEET DATA ---
const LOCATIONS = [
  {
    id: 'MBJ',
    code: 'MBJ',
    name: 'Montego Bay Airport (MBJ - Sangster International Airport)',
    shortName: 'Montego Bay Airport (MBJ)',
    compactName: 'Montego Bay (MBJ)',
    pickupNote: 'Sangster Intl Airport · Curbside Meet & Greet Arrivals'
  },
  {
    id: 'KIN',
    code: 'KIN',
    name: 'Kingston Airport (KIN - Norman Manley International Airport)',
    shortName: 'Kingston Airport (KIN)',
    compactName: 'Kingston (KIN)',
    pickupNote: 'Norman Manley Intl Airport · Curbside Meet & Greet Arrivals'
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
    id: 'voxy-2017-black',
    category: 'bus',
    categoryLabel: 'Bus / Van (7–8 Seater)',
    name: '2017 Toyota Voxy',
    year: '2017',
    color: 'Black',
    subtitle: 'Black 7–8 Seater Van · 2017 Fleet',
    image: '/vehicles/voxy-black.jpg',
    seats: 8,
    transmission: 'Auto',
    luggage: 6,
    mpg: 30,
    ratePerDay: 135,
    deposit: 500,
    badge: 'Popular Van'
  },
  {
    id: 'voxy-2016-navy',
    category: 'bus',
    categoryLabel: 'Bus / Van (7–8 Seater)',
    name: '2016 Toyota Voxy',
    year: '2016',
    color: 'Navy Blue',
    subtitle: 'Navy Blue 7–8 Seater Van · 2016 Fleet',
    image: '/vehicles/voxy-navy.jpg',
    seats: 8,
    transmission: 'Auto',
    luggage: 6,
    mpg: 30,
    ratePerDay: 130,
    deposit: 500,
    badge: 'Group Choice'
  },
  {
    id: 'voxy-2018-white',
    category: 'bus',
    categoryLabel: 'Bus / Van (7–8 Seater)',
    name: '2018 Toyota Voxy',
    year: '2018',
    color: 'White',
    subtitle: 'White 7–8 Seater Van · 2018 Fleet',
    image: '/vehicles/voxy-white.jpg',
    seats: 8,
    transmission: 'Auto',
    luggage: 6,
    mpg: 30,
    ratePerDay: 140,
    deposit: 500,
    badge: 'Executive Van'
  },
  {
    id: 'demio-2016-black',
    category: 'compact',
    categoryLabel: 'Compact Car',
    name: '2016 Mazda Demio',
    year: '2016',
    color: 'Black',
    subtitle: 'Black Hatchback · 2016 Fleet',
    image: '/vehicles/demio-black.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 2,
    mpg: 38,
    ratePerDay: 60,
    deposit: 500,
    badge: 'Airport Best-Seller'
  },
  {
    id: 'demio-2016-red',
    category: 'compact',
    categoryLabel: 'Compact Car',
    name: '2016 Mazda Demio',
    year: '2016',
    color: 'Red',
    subtitle: 'Red Hatchback · 2016 Fleet',
    image: '/vehicles/demio-red.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 2,
    mpg: 38,
    ratePerDay: 60,
    deposit: 500,
    badge: 'Popular Choice'
  },
  {
    id: 'demio-2015-navy',
    category: 'compact',
    categoryLabel: 'Compact Car',
    name: '2015 Mazda Demio',
    year: '2015',
    color: 'Navy Blue',
    subtitle: 'Navy Blue Hatchback · 2015 Fleet',
    image: '/vehicles/demio-navy.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 2,
    mpg: 38,
    ratePerDay: 58,
    deposit: 500,
    badge: 'Great Value'
  },
  {
    id: 'cx5-2016-pearlwhite',
    category: 'suv',
    categoryLabel: 'SUV',
    name: '2016 Mazda CX-5',
    year: '2016',
    color: 'Pearl White',
    subtitle: 'Pearl White Crossover · 2016 Fleet',
    image: '/vehicles/cx5-white.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 5,
    mpg: 31,
    ratePerDay: 105,
    deposit: 500,
    badge: 'Island Explorer'
  },
  {
    id: 'cx5-2017-red',
    category: 'suv',
    categoryLabel: 'SUV',
    name: '2017 Mazda CX-5',
    year: '2017',
    color: 'Red',
    subtitle: 'Red Crossover SUV · 2017 Fleet',
    image: '/vehicles/cx5-red.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 5,
    mpg: 31,
    ratePerDay: 110,
    deposit: 500,
    badge: 'Customer Favorite'
  },
  {
    id: 'cx5-2019-silver',
    category: 'suv',
    categoryLabel: 'SUV',
    name: '2019 Mazda CX-5',
    year: '2019',
    color: 'Silver',
    subtitle: 'Silver Crossover SUV · 2019 Fleet',
    image: '/vehicles/cx5-silver.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 5,
    mpg: 32,
    ratePerDay: 115,
    deposit: 500,
    badge: 'Popular SUV'
  },
  {
    id: 'sylphy-2015-silver',
    category: 'fullsize',
    categoryLabel: 'Full-Size Car',
    name: '2015 Nissan Sylphy',
    year: '2015',
    color: 'Silver',
    subtitle: 'Silver Standard Sedan · 2015 Fleet',
    image: '/vehicles/sylphy.jpg',
    seats: 5,
    transmission: 'Auto',
    luggage: 4,
    mpg: 35,
    ratePerDay: 75,
    deposit: 500,
    badge: 'Executive Sedan'
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

const DEFAULT_PICKUP_DATE = (() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateInput(tomorrow);
})();
const DEFAULT_RETURN_DATE = addDays(DEFAULT_PICKUP_DATE, 4);

// Seed one active out-on-road rental so Phase 5 & Phase 6 can also be tested immediately
const INITIAL_SAMPLE_RENTAL = {
  id: 'TIE-508412',
  raNumber: 'RA-2026-08412',
  createdAt: '09:40 AM',
  acquisitionChannel: 'Agent Approached at Airport ("Any rental car for you today?")',
  vehicle: FLEET.find((v) => v.id === 'demio-2016-black') || FLEET[0], // 2016 Mazda Demio (Black)
  plateNo: '2489-HX',
  licDisc: 'LD-99214',
  location: LOCATIONS[0],
  dropLocation: LOCATIONS[0],
  pickupDate: DEFAULT_PICKUP_DATE,
  pickupTime: '10:00 AM',
  returnDate: DEFAULT_RETURN_DATE,
  returnTime: '10:00 AM',
  rentalDays: 4,
  rateType: 'daily',
  subtotal: 240,
  deposit: 500,
  mileageOut: 48210,
  mileageIn: 48690,
  fuelLevelOut: 'F',
  fuelLevelIn: 'F',
  pickupDropFee: 0,
  extraHours: 0,
  tpiAmount: 0,
  cdwAmount: 80,
  cdwAccepted: true,
  discount: 0,
  extraCharges: 0,
  fuelCharges: 0,
  salesTax: 36,
  rentalPaymentMethod: 'cash',
  cardHolder: 'MARCUS STERLING',
  cardLast4: '4829',
  sendViaWhatsApp: true,
  driver: {
    firstName: 'Marcus',
    lastName: 'Sterling',
    fullName: 'Marcus Sterling',
    dob: '1988-06-14',
    homeAddress: '142 Palm Crest Way, Fort Lauderdale, FL 33301, USA',
    homePhone: '+1 (954) 555-0194',
    email: 'marcus.sterling@example.com',
    phone: '+1 (876) 555-0194',
    localAddress: 'Half Moon Resort, Rose Hall, Montego Bay, Jamaica',
    localPhone: '+1 (876) 885-2355',
    licenseNumber: 'JM-8492041-A',
    licenseExpiry: '2029-11-30',
    relativeName: 'Eleanor Sterling (Sister)',
    relativeAddress: '24 Coral Gardens, Montego Bay, Jamaica',
    relativePhone: '+1 (876) 789-9051',
    idVerified: true
  },
  additionalDriver: {
    hasDriver: true,
    fullName: 'Sophia Sterling',
    dob: '1990-09-22',
    address: '142 Palm Crest Way, Fort Lauderdale, FL 33301, USA',
    phone: '+1 (954) 555-0198',
    idNumber: 'FL-D8492019',
    licenseNumber: 'FL-940281-B',
    licenseExpiry: '2030-05-15'
  },
  inspection: {
    noExistingDamage: true,
    damagedZones: [],
    notes: 'Exterior clean, no dents or scratches found upon pre-rental walkaround.',
    gasLevel: 'Full',
    mileageOut: 48210,
    tyres: {
      type: 'Radial Tubeless',
      size: '185/65 R15',
      frontLeft: 'New',
      frontRight: 'New',
      rearLeft: '1/4 Worn',
      rearRight: '1/4 Worn',
      spare: 'New'
    },
    checklist: {
      hubCaps: 'O.K.',
      bodyDamage: 'None',
      emblems: 'O.K.',
      trunkMat: 'O.K.',
      tools: 'O.K.',
      backBoard: 'O.K.',
      mats: '4',
      headRests: 'O.K.',
      babySeatCount: '0',
      babySeatCondition: 'N/A'
    },
    customerVideoRecorded: true,
    agentVideoRecorded: true,
    checkSheetSignature: {
      mode: 'type',
      dataUrl: null,
      text: 'Marcus Sterling',
      signedAt: '09:36 AM'
    },
    staffSignature: {
      mode: 'type',
      dataUrl: null,
      text: 'Andray Williams (Agent)',
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
    checkedPersonalBelongings: true,
    mileageIn: 48690,
    fuelLevelIn: 'Full',
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
  // Routing state for /privacy and /terms
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/privacy' || path.startsWith('/privacy')) return 'privacy';
      if (path === '/terms' || path.startsWith('/terms')) return 'terms';
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/privacy' || path.startsWith('/privacy')) {
        setCurrentRoute('privacy');
      } else if (path === '/terms' || path.startsWith('/terms')) {
        setCurrentRoute('terms');
      } else {
        setCurrentRoute('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    const normalized = path.toLowerCase();
    if (normalized.startsWith('/privacy')) {
      setCurrentRoute('privacy');
    } else if (normalized.startsWith('/terms')) {
      setCurrentRoute('terms');
    } else {
      setCurrentRoute('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Phase 1: Acquisition & Sticky Search Strip State
  const [acquisitionChannel] = useState(ACQUISITION_CHANNELS[0].id);
  const [locationId, setLocationId] = useState('MBJ');
  const [dropLocationId, setDropLocationId] = useState('MBJ');
  const [pickupDate, setPickupDate] = useState(DEFAULT_PICKUP_DATE);
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnDate, setReturnDate] = useState(DEFAULT_RETURN_DATE);
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [isCompact, setIsCompact] = useState(false);
  const searchAnchorRef = useRef(null);

  // Drawer & Modal State
  // drawerMode: 'checkout' (Phases 2-4) | 'bookings' (List) | 'return' (Phases 5-6) | null
  const [drawerMode, setDrawerMode] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(2); // 2 = Office App, 3 = Check Sheet & Videos, 4 = Contract, Sign & Pay
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [reservations, setReservations] = useState([INITIAL_SAMPLE_RENTAL]);
  const [selectedReturnId, setSelectedReturnId] = useState(INITIAL_SAMPLE_RENTAL.id);
  const [dossierBooking, setDossierBooking] = useState(null);
  const [guestCheckoutVehicle, setGuestCheckoutVehicle] = useState(null);
  const [formError, setFormError] = useState('');
  const [successNotification, setSuccessNotification] = useState(null);
  const [isRentalInfoModalOpen, setIsRentalInfoModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // --- PHASE 2 STATE: OFFICE DOCUMENTATION & APPLICATION ---
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    dob: '',
    homeAddress: '',
    homePhone: '',
    email: '',
    phone: '',
    localAddress: '',
    localPhone: '',
    licenseNumber: '',
    licenseExpiry: '',
    relativeName: '',
    relativeAddress: '',
    relativePhone: '',
    idVerified: false
  });
  const [additionalDriver, setAdditionalDriver] = useState({
    hasDriver: false,
    fullName: '',
    dob: '',
    address: '',
    phone: '',
    idNumber: '',
    licenseNumber: '',
    licenseExpiry: ''
  });

  // --- PHASE 3 STATE: VEHICLE INSPECTION, CHECK SHEET & DUAL VIDEOS ---
  const [inspectionData, setInspectionData] = useState({
    plateNo: '2489-HX',
    raNumber: 'RA-508412',
    licDisc: 'LD-99214',
    mileageOut: 48210,
    gasLevel: 'Full',
    tyreType: 'Radial Tubeless',
    tyreSize: '185/65 R15',
    tyresFrontLeft: 'New',
    tyresFrontRight: 'New',
    tyresRearLeft: '1/4 Worn',
    tyresRearRight: '1/4 Worn',
    tyresSpare: 'New',
    hubCaps: 'O.K.',
    bodyDamage: 'None',
    emblems: 'O.K.',
    trunkMat: 'O.K.',
    tools: 'O.K.',
    backBoard: 'O.K.',
    mats: '4',
    headRests: 'O.K.',
    babySeatCount: '0',
    babySeatCondition: 'N/A'
  });
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
    mileageIn: 48690,
    fuelLevelIn: 'Full',
    checkedPersonalBelongings: false,
    hasNewDamage: false,
    damageDescription: '',
    estimateCost: 0,
    isMajorDamage: false,
    professionalName: 'Devon Campbell (Certified Auto Body Estimator)',
    professionalVerified: true,
    estimatePresentedToCustomer: false,
    informedDepositInsufficient: false,
    customerPosPermission: false
  });
  const [returnError, setReturnError] = useState('');
  const [selectedTours, setSelectedTours] = useState([]);

  useEffect(() => {
    const MOBILE_MAX_WIDTH = 767;
    let rafId = null;

    const checkCompactState = () => {
      // Only collapse on mobile view (< 768px); desktop stays expanded
      if (window.innerWidth > MOBILE_MAX_WIDTH) {
        setIsCompact((prev) => (prev ? false : prev));
        return;
      }

      if (!searchAnchorRef.current) return;
      const anchorTop = searchAnchorRef.current.getBoundingClientRect().top;

      // Hysteresis threshold:
      // Collapse when top of search anchor reaches viewport top (anchorTop <= 0)
      // Only expand back when scrolled well back up (anchorTop > 50)
      setIsCompact((prevCompact) => {
        if (!prevCompact && anchorTop <= 0) {
          return true;
        }
        if (prevCompact && anchorTop > 50) {
          return false;
        }
        return prevCompact;
      });
    };

    const handleScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        checkCompactState();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    checkCompactState();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const handleExpandCompactSearch = () => {
    setIsCompact(false);
    const mobileEl = document.getElementById('mobile-search-card');
    const desktopEl = document.getElementById('hero-search-card');
    const targetEl = (window.innerWidth < 1024 ? mobileEl : desktopEl) || mobileEl || desktopEl;

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Smooth focus on first input once in view
      setTimeout(() => {
        const inputToFocus = document.getElementById(
          window.innerWidth < 1024 ? 'hero-mobile-pickup-date' : 'pickup-date-input'
        );
        inputToFocus?.focus?.({ preventScroll: true });
      }, 450);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dossierBooking) {
          setDossierBooking(null);
        } else if (guestCheckoutVehicle) {
          setGuestCheckoutVehicle(null);
        } else if (drawerMode) {
          setDrawerMode(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerMode, dossierBooking, guestCheckoutVehicle]);

  useEffect(() => {
    const isModalOpen = Boolean(
      drawerMode ||
      dossierBooking ||
      guestCheckoutVehicle ||
      isRentalInfoModalOpen ||
      isContactModalOpen
    );

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [
    drawerMode,
    dossierBooking,
    guestCheckoutVehicle,
    isRentalInfoModalOpen,
    isContactModalOpen
  ]);

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

  const selectedTourIds = useMemo(
    () => selectedTours.map((t) => t.id),
    [selectedTours]
  );

  const toursTotal = useMemo(
    () =>
      selectedTours.reduce(
        (sum, t) =>
          sum + (t.duration?.toLowerCase().includes('daily') ? t.price * rentalDays : t.price),
        0
      ),
    [selectedTours, rentalDays]
  );

  const handleToggleTour = (tour) => {
    const alreadySelected = selectedTours.some((t) => t.id === tour.id);
    const isDaily = tour.duration?.toLowerCase().includes('daily');
    setSelectedTours((prev) =>
      alreadySelected
        ? prev.filter((t) => t.id !== tour.id)
        : [...prev, { id: tour.id, title: tour.title, duration: tour.duration, price: tour.price }]
    );
    setSuccessNotification(
      alreadySelected
        ? `Removed "${tour.title}" from your booking.`
        : `Added "${tour.title}" ($${tour.price} USD${isDaily ? '/day' : ''}) to your booking.`
    );
    setTimeout(() => {
      setSuccessNotification(null);
    }, 3500);
  };

  const selectedLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0],
    [locationId]
  );

  const selectedDropLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === dropLocationId) || LOCATIONS[0],
    [dropLocationId]
  );

  const pickupFee = locationId === 'KIN' ? 120 : 0;
  const dropFee = dropLocationId === 'KIN' ? 120 : 0;
  const totalPickupDropFee = pickupFee + dropFee;

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
      firstName: 'Nadine',
      lastName: 'Wright',
      fullName: 'Nadine Wright',
      dob: '1991-03-22',
      homeAddress: '744 Ocean Boulevard, Miami, FL 33139, USA',
      homePhone: '+1 (305) 555-0842',
      email: 'nadine.wright@islandmail.com',
      phone: '+1 (876) 555-0842',
      localAddress: 'S Hotel Jamaica, Jimmy Cliff Blvd, Montego Bay',
      localPhone: '+1 (876) 885-2355',
      licenseNumber: 'JM-9940182-B',
      licenseExpiry: '2030-08-19',
      relativeName: 'Marcus Wright (Brother)',
      relativeAddress: '12 Queens Drive, Montego Bay, Jamaica',
      relativePhone: '+1 (876) 789-9051',
      idVerified: true
    });
    setAdditionalDriver({
      hasDriver: true,
      fullName: 'Dwayne Wright',
      dob: '1989-11-04',
      address: '744 Ocean Boulevard, Miami, FL 33139, USA',
      phone: '+1 (305) 555-0914',
      idNumber: 'FL-D994102',
      licenseNumber: 'FL-991204-B',
      licenseExpiry: '2029-10-12'
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
    const vehicleSubtotal = activeVehicle.ratePerDay * rentalDays;
    const cdwTotal = rentalDays * 20;
    const subtotal = vehicleSubtotal + toursTotal + cdwTotal + totalPickupDropFee;
    const randomRa = `RA-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: `TIE-${Math.floor(100000 + Math.random() * 900000)}`,
      raNumber: randomRa,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acquisitionChannel,
      vehicle: activeVehicle,
      plateNo: inspectionData.plateNo || '2489-HX',
      licDisc: inspectionData.licDisc || 'LD-99214',
      location: selectedLocation,
      dropLocation: selectedDropLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,
      vehicleSubtotal,
      tourAddons: selectedTours,
      toursTotal,
      subtotal,
      deposit: activeVehicle.deposit,
      mileageOut: inspectionData.mileageOut || 48210,
      mileageIn: null,
      fuelLevelOut: inspectionData.gasLevel === 'Full' ? 'F' : inspectionData.gasLevel || 'F',
      fuelLevelIn: null,
      pickupDropFee: totalPickupDropFee,
      extraHours: 0,
      tpiAmount: 0,
      cdwAmount: cdwTotal,
      cdwAccepted: true,
      discount: 0,
      extraCharges: 0,
      fuelCharges: 0,
      salesTax: Math.round(subtotal * 0.15),
      rentalPaymentMethod,
      cardHolder: card.holder.trim(),
      cardLast4: rawDigits.slice(-4),
      sendViaWhatsApp,
      driver: { ...driver },
      additionalDriver: { ...additionalDriver },
      inspection: {
        noExistingDamage,
        damagedZones: [...damagedZones],
        notes: inspectionNotes,
        gasLevel: inspectionData.gasLevel,
        mileageOut: inspectionData.mileageOut,
        tyres: {
          type: inspectionData.tyreType,
          size: inspectionData.tyreSize,
          frontLeft: inspectionData.tyresFrontLeft,
          frontRight: inspectionData.tyresFrontRight,
          rearLeft: inspectionData.tyresRearLeft,
          rearRight: inspectionData.tyresRearRight,
          spare: inspectionData.tyresSpare
        },
        checklist: {
          hubCaps: inspectionData.hubCaps,
          bodyDamage: noExistingDamage ? 'None' : 'Yes',
          emblems: inspectionData.emblems,
          trunkMat: inspectionData.trunkMat,
          tools: inspectionData.tools,
          backBoard: inspectionData.backBoard,
          mats: inspectionData.mats,
          headRests: inspectionData.headRests,
          babySeatCount: inspectionData.babySeatCount,
          babySeatCondition: inspectionData.babySeatCondition
        },
        customerVideoRecorded,
        agentVideoRecorded,
        checkSheetSignature,
        staffSignature: {
          mode: 'type',
          dataUrl: null,
          text: 'Andray Williams (Agent)',
          signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      },
      contract: {
        ackDamageResponsibility,
        ackThirdPartyInsurance,
        copiesDistributed,
        contractSignature
      },
      returnAssessment: {
        inspected: false,
        checkedPersonalBelongings: false,
        mileageIn: null,
        fuelLevelIn: null,
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
              checkedPersonalBelongings: returnDraft.checkedPersonalBelongings,
              mileageIn: returnDraft.mileageIn || 48690,
              fuelLevelIn: returnDraft.fuelLevelIn || 'Full',
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

  if (currentRoute === 'privacy') {
    return (
      <PrivacyPolicy
        onNavigateHome={() => navigateTo('/')}
        backLabel={guestCheckoutVehicle ? '← Return to Checkout' : 'Back to Home'}
      />
    );
  }
  if (currentRoute === 'terms') {
    return (
      <TermsOfUse
        onNavigateHome={() => navigateTo('/')}
        backLabel={guestCheckoutVehicle ? '← Return to Checkout' : 'Back to Home'}
      />
    );
  }

  return (
    <div className="min-h-screen print:min-h-0 glass-canvas print:bg-white text-brand-ink flex flex-col">
      {/* =========================================================
          SUCCESS NOTIFICATION TOAST
         ========================================================= */}
      {successNotification && (
        <div className="fixed bottom-5 left-5 z-[70] max-w-lg glass-bar border rounded-2xl px-4 py-3.5 flex items-center gap-3.5 animate-fade-in print:hidden">
          <div className="w-8 h-8 rounded-xl glass-cta text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-brand-ink leading-snug">{successNotification}</p>
          <button
            type="button"
            onClick={() => setSuccessNotification(null)}
            className="text-slate-500 hover:text-brand-ink cursor-pointer ml-1 p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================
          TOP NAVIGATION BAR & STAFF PORTAL
         ========================================================= */}
      <Navbar
        onNavigateFleet={() => {
          if (currentRoute !== 'home') navigateTo('/');
          setTimeout(() => {
            document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onNavigateTours={() => {
          if (currentRoute !== 'home') navigateTo('/');
          setTimeout(() => {
            const el =
              document.getElementById('tour-packages-heading') ||
              document.querySelector('[aria-labelledby="tour-packages-heading"]');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenRentalInfo={() => setIsRentalInfoModalOpen(true)}
        onOpenMyBooking={() => setDrawerMode('bookings')}
        onOpenContact={() => {
          if (currentRoute !== 'home') navigateTo('/');
          setTimeout(() => {
            const el = document.getElementById('contact-section');
            if (el) {
              const headerEl = document.querySelector('header');
              const headerHeight = headerEl ? headerEl.offsetHeight : 80;
              const rect = el.getBoundingClientRect();
              const targetScrollTop = window.pageYOffset + rect.top - headerHeight - 16;
              window.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth'
              });
            } else {
              setIsContactModalOpen(true);
            }
          }, 80);
        }}
        onOpenReturnPOS={() => {
          if (activeReturnBooking) openReturnDrawerFor(activeReturnBooking);
        }}
        onOpenContracts={() => setDrawerMode('bookings')}
        reservationsCount={reservations.length}
      />

      {/* =========================================================
          HERO BANNER & REPOSITIONED GLASSMORPHIC SEARCH
         ========================================================= */}
      <HeroBanner
        locationId={locationId}
        setLocationId={setLocationId}
        dropLocationId={dropLocationId}
        setDropLocationId={setDropLocationId}
        pickupDate={pickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        returnDate={returnDate}
        returnTime={returnTime}
        setReturnTime={setReturnTime}
        rentalDays={rentalDays}
        locations={LOCATIONS}
        timeSlots={TIME_SLOTS}
        categories={CATEGORIES}
        minPickupDate={DEFAULT_PICKUP_DATE}
        minReturnDate={addDays(pickupDate, 1)}
        onPickupDateChange={handlePickupDateChange}
        onReturnDateChange={handleReturnDateChange}
        onBookCar={() => {
          document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* =========================================================
          PERSISTENT STICKY SEARCH SUMMARY (SCROLL-TRIGGERED COMPACT VIEW)
         ========================================================= */}
      <div ref={searchAnchorRef} aria-hidden="true" />
      <div
        onClick={handleExpandCompactSearch}
        className={`sticky top-0 z-30 transition-all duration-300 print:hidden ${isCompact
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-ink/10 cursor-pointer block'
            : 'hidden'
          }`}
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-full bg-brand-palm/10 border border-brand-palm/25 flex items-center justify-center shrink-0 text-brand-palm">
              <Search className="w-4 h-4" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-brand-ink truncate flex items-center flex-wrap gap-1.5">
              <span>
                {locationId === dropLocationId
                  ? selectedLocation.compactName
                  : `${selectedLocation.compactName} → ${selectedDropLocation.compactName}`
                }{' '}
                • {formatShortDate(pickupDate)} – {formatShortDate(returnDate)} ({rentalDays}{' '}
                {rentalDays === 1 ? 'day' : 'days'})
              </span>
              {totalPickupDropFee > 0 && (
                <span className="text-[11px] text-amber-800 font-mono font-bold bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300/80">
                  +${totalPickupDropFee} KIN Hub
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExpandCompactSearch();
            }}
            aria-label="Edit Search Dates and Location"
            className="px-3.5 py-1.5 rounded-lg border border-brand-ink/15 bg-brand-canvas/90 hover:bg-brand-palm hover:text-white active:scale-95 transition-all text-xs font-semibold text-brand-palm flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Search</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          MAIN FLEET GRID WITH INSTANT SPECS & PRICE BREAKDOWN
         ========================================================= */}
      <main id="fleet-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 print:hidden scroll-mt-20">
        {/* Category Filter Tabs & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-5 border-b border-brand-ink/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-2 ${active
                    ? 'glass-cta text-white'
                    : 'glass-pill text-slate-700 hover:bg-white/75 hover:border-brand-teal/40 hover:text-brand-ink'
                    }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 text-sm sm:text-base">


            <div className="min-h-[44px] flex items-center gap-2 glass-pill rounded-xl px-3.5 py-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-teal shrink-0" />
              <label htmlFor="sort-select" className="text-slate-600">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-[40px] bg-transparent text-base font-medium text-brand-ink focus:outline-none cursor-pointer"
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
                className={`group glass-card glass-card-hover rounded-2xl flex flex-col overflow-hidden ${isSelected
                  ? '!border-brand-palm/70 ring-2 ring-brand-palm/50'
                  : ''
                  }`}
              >
                {/* Header */}
                <div className="p-5 pb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-600">
                        {vehicle.categoryLabel}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-mono font-medium text-brand-palm bg-brand-palm-soft/75 border border-brand-palm/25 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        Ready · {selectedLocation.code}{dropLocationId !== locationId ? ` → ${selectedDropLocation.code}` : ''}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-brand-ink">
                      {vehicle.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">or similar · {vehicle.subtitle}</p>
                  </div>

                  <span className="text-xs font-medium text-brand-amber-ink bg-brand-amber-soft/80 border border-brand-amber-border/80 backdrop-blur-xs px-2.5 py-1 rounded-lg shrink-0">
                    {vehicle.badge}
                  </span>
                </div>

                {/* High-Res Profile Cutout Stage */}
                <div className="relative mx-4 mb-3 rounded-xl bg-white/82 border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] px-5 py-3.5 h-46 flex items-center justify-center">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} profile cutout`}
                    loading="eager"
                    className="max-h-38 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] select-none"
                  />
                </div>

                {/* Instant Specs Bar */}
                <div className="grid grid-cols-4 divide-x divide-brand-ink/8 border-y border-brand-ink/8 bg-white/32 text-center">
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
                <div className="p-5 flex items-center justify-between gap-4 mt-auto bg-white/25">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold tracking-tight text-brand-ink font-mono tabular-nums">
                        ${vehicle.ratePerDay}
                      </span>
                      <span className="text-sm sm:text-base text-slate-600">USD / day</span>
                    </div>
                    <p className="text-sm text-slate-600 font-mono tabular-nums mt-1">
                      {totalPickupDropFee > 0
                        ? `$${tripTotal + totalPickupDropFee} (${rentalDays}d + $${totalPickupDropFee} KIN hub) + $${vehicle.deposit} card deposit`
                        : `$${tripTotal} (${rentalDays}d) + $${vehicle.deposit} card deposit`
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGuestCheckoutVehicle(vehicle)}
                    className="min-h-[48px] px-5 sm:px-6 py-3 rounded-xl glass-cta active:scale-[0.99] text-white text-base font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Tour & Chauffeur Add-On Packages Section */}
        <TourPackages
          selectedTourIds={selectedTourIds}
          onToggleTour={handleToggleTour}
        />

      </main>

      {/* =========================================================
          CONTACT TAKE IT EASY SECTION
         ========================================================= */}
      <ContactSection />

      {/* =========================================================
          FOOTER WITH LEGAL & REGULATORY LINKS
         ========================================================= */}
      <Footer onNavigate={navigateTo} />

      {/* =========================================================
          INLINE RIGHT-HAND WORKFLOW DRAWER
         ========================================================= */}
      {drawerMode && (
        <div className="fixed inset-0 z-[55] flex justify-end print:hidden">
          <div
            onClick={() => setDrawerMode(null)}
            className="fixed inset-0 bg-brand-ink/28 backdrop-blur-sm animate-fade-in"
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Rental Workflow Drawer"
            className="relative z-10 w-full max-w-[620px] glass-drawer h-full flex flex-col animate-drawer-in"
          >
            {/* Subtle Brand Top Accent */}
            <div className="h-[3px] w-full bg-gradient-to-r from-brand-palm via-brand-teal to-brand-amber shrink-0" />

            {/* =====================================================
                MODE A: INLINE CHECKOUT & HANDOFF (PHASES 2, 3, 4)
               ===================================================== */}
            {drawerMode === 'checkout' && activeVehicle && (
              <>
                {/* Drawer Top Header */}
                <div className="px-6 py-4 border-b border-brand-ink/10 flex items-center justify-between gap-3 bg-white/50 backdrop-blur-xl">
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
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl glass-pill text-slate-600 hover:text-brand-ink hover:border-brand-teal/50 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Progress Bar inside Drawer (when not yet finalized) */}
                {!confirmedReservation && (
                  <div className="grid grid-cols-3 divide-x divide-brand-ink/10 border-b border-brand-ink/10 bg-white/35 backdrop-blur-md text-sm">
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
                          className={`min-h-[46px] py-3 px-2.5 sm:px-3 font-mono text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${active
                            ? 'bg-white/75 text-brand-palm font-semibold border-b-2 border-brand-palm'
                            : done
                              ? 'text-brand-palm hover:bg-white/50 font-medium'
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
                  <div className="flex-1 overflow-y-auto divide-y divide-brand-ink/10">
                    <div className="p-6 bg-brand-palm-soft/55 backdrop-blur-md">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-cta text-white text-sm font-medium mb-2.5">
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
                        className="w-full py-3 px-4 rounded-xl glass-pill hover:bg-white/75 text-sm font-medium text-brand-ink flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck2 className="w-4 h-4 text-brand-teal" />
                        <span>View Signed Contract & Check Sheet (Customer / Office Copy)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openReturnDrawerFor(confirmedReservation)}
                        className="w-full py-3.5 px-4 rounded-xl glass-cta text-sm font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
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
                    <div className="flex-1 overflow-y-auto divide-y divide-brand-ink/10">
                      {/* Compact Vehicle & Price Quote Banner (Phase 1 Carryover) */}
                      <div className="p-5 flex items-center gap-4 bg-white/38 backdrop-blur-md">
                        <div className="w-28 h-16 bg-white/85 border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] rounded-xl p-1.5 flex items-center justify-center shrink-0">
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
                            ${activeVehicle.ratePerDay * rentalDays + toursTotal}.00 total
                            {toursTotal > 0 ? ` (incl. $${toursTotal} add-ons)` : ''} + $
                            {activeVehicle.deposit}.00 card security deposit
                          </p>
                          <p className="text-xs text-slate-600 truncate mt-0.5">
                            {selectedLocation.shortName}
                            {selectedTours.length > 0
                              ? ` · +${selectedTours.map((t) => t.title).join(', ')}`
                              : ''}
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
                                Customer Identification &amp; Rental Application
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                Capture complete physical contract details: Primary renter, home &amp; local Jamaica addresses, relative contact, and optional additional driver.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={fillDemoApplication}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/75 text-xs font-medium text-brand-ink shrink-0 cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-brand-amber" />
                              <span>Autofill ID</span>
                            </button>
                          </div>

                          {/* Primary Renter Form Grid */}
                          <div className="glass-surface rounded-xl divide-y divide-brand-ink/10 overflow-hidden">
                            <div className="p-3 bg-brand-teal/5">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                                1. Primary Renter Information
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Full Legal Name (First &amp; Last) *
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

                            <div className="px-4 py-3">
                              <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                Permanent Home Address (City / State / Zip / Country) *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 744 Ocean Boulevard, Miami, FL 33139, USA"
                                value={driver.homeAddress}
                                onChange={(e) => setDriver({ ...driver, homeAddress: e.target.value })}
                                className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Home Phone
                                </label>
                                <input
                                  type="tel"
                                  placeholder="+1 (305) 555-0842"
                                  value={driver.homePhone}
                                  onChange={(e) => setDriver({ ...driver, homePhone: e.target.value })}
                                  className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                                />
                              </div>

                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Mobile Phone (WhatsApp) *
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
                                Email Address (For Contract Delivery) *
                              </label>
                              <input
                                type="email"
                                placeholder="customer@email.com"
                                value={driver.email}
                                onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                                className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Local Jamaica Address (Hotel / Villa)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., S Hotel, Jimmy Cliff Blvd, Montego Bay"
                                  value={driver.localAddress}
                                  onChange={(e) => setDriver({ ...driver, localAddress: e.target.value })}
                                  className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                                />
                              </div>

                              <div className="px-4 py-3">
                                <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                  Local Jamaica Tel #
                                </label>
                                <input
                                  type="tel"
                                  placeholder="(876) 885-2355"
                                  value={driver.localPhone}
                                  onChange={(e) => setDriver({ ...driver, localPhone: e.target.value })}
                                  className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                                />
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              <label className="block text-xs font-mono font-medium uppercase text-slate-500">
                                Emergency / Relative Contact (Name, Address, Tel)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Eleanor Sterling · Montego Bay · (876) 789-9051"
                                value={driver.relativeName ? `${driver.relativeName} · ${driver.relativeAddress || ''} · ${driver.relativePhone || ''}` : ''}
                                onChange={(e) => {
                                  const parts = e.target.value.split('·').map(s => s.trim());
                                  setDriver({
                                    ...driver,
                                    relativeName: parts[0] || e.target.value,
                                    relativeAddress: parts[1] || '',
                                    relativePhone: parts[2] || ''
                                  });
                                }}
                                className="w-full text-base text-brand-ink placeholder:text-slate-300 focus:outline-none mt-1"
                              />
                            </div>
                          </div>

                          {/* Additional Driver Card */}
                          <div className="glass-surface rounded-xl p-4 space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                              <div>
                                <span className="font-semibold text-brand-ink block text-sm">
                                  Authorize Additional Driver on Contract
                                </span>
                                <span className="text-xs text-slate-500">
                                  Physical ID &amp; License required before vehicle release
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={additionalDriver.hasDriver}
                                onChange={(e) =>
                                  setAdditionalDriver({ ...additionalDriver, hasDriver: e.target.checked })
                                }
                                className="w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                            </label>

                            {additionalDriver.hasDriver && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-ink/10 text-xs sm:text-sm">
                                <div>
                                  <label className="text-slate-500 block text-[11px] font-mono uppercase">Full Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., Dwayne Wright"
                                    value={additionalDriver.fullName}
                                    onChange={(e) => setAdditionalDriver({ ...additionalDriver, fullName: e.target.value })}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-brand-ink text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-slate-500 block text-[11px] font-mono uppercase">Date of Birth</label>
                                  <input
                                    type="date"
                                    value={additionalDriver.dob}
                                    onChange={(e) => setAdditionalDriver({ ...additionalDriver, dob: e.target.value })}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-brand-ink text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-slate-500 block text-[11px] font-mono uppercase">License / ID Number</label>
                                  <input
                                    type="text"
                                    placeholder="FL-991204-B"
                                    value={additionalDriver.licenseNumber}
                                    onChange={(e) => setAdditionalDriver({ ...additionalDriver, licenseNumber: e.target.value })}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-brand-ink text-sm font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-slate-500 block text-[11px] font-mono uppercase">License Expiry</label>
                                  <input
                                    type="date"
                                    value={additionalDriver.licenseExpiry}
                                    onChange={(e) => setAdditionalDriver({ ...additionalDriver, licenseExpiry: e.target.value })}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-brand-ink text-sm"
                                  />
                                </div>
                              </div>
                            )}
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
                                Physical Identification Inspected &amp; Verified by Agent
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
                              Phase 3 · Vehicle Inspection &amp; Handoff
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-brand-ink mt-0.5">
                              Check Out / Check In Inspection Sheet
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Record vehicle identifiers, fuel level, mileage, tyres condition, and interior/exterior equipment checklist.
                            </p>
                          </div>

                          {/* 1. Vehicle Identifiers & Odometer / Fuel */}
                          <div className="glass-surface rounded-xl p-4 space-y-3">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                              1. Vehicle Dispatch Data
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div>
                                <label className="text-slate-500 block font-mono">Plate No.</label>
                                <input
                                  type="text"
                                  value={inspectionData.plateNo}
                                  onChange={(e) => setInspectionData({ ...inspectionData, plateNo: e.target.value })}
                                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                                />
                              </div>
                              <div>
                                <label className="text-slate-500 block font-mono">R.A. No.</label>
                                <input
                                  type="text"
                                  value={inspectionData.raNumber}
                                  onChange={(e) => setInspectionData({ ...inspectionData, raNumber: e.target.value })}
                                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                                />
                              </div>
                              <div>
                                <label className="text-slate-500 block font-mono">Lic. Disc</label>
                                <input
                                  type="text"
                                  value={inspectionData.licDisc}
                                  onChange={(e) => setInspectionData({ ...inspectionData, licDisc: e.target.value })}
                                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                                />
                              </div>
                              <div>
                                <label className="text-slate-500 block font-mono">Mileage Out (km)</label>
                                <input
                                  type="number"
                                  value={inspectionData.mileageOut}
                                  onChange={(e) => setInspectionData({ ...inspectionData, mileageOut: Number(e.target.value) })}
                                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-slate-600 block text-xs font-mono mb-1.5 font-medium">
                                Fuel Gauge Level Out:
                              </label>
                              <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                                {['0', '1/4', '1/2', '3/4', 'Full'].map((lvl) => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setInspectionData({ ...inspectionData, gasLevel: lvl })}
                                    className={`py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                      inspectionData.gasLevel === lvl
                                        ? 'bg-emerald-800 text-white shadow-xs'
                                        : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white'
                                    }`}
                                  >
                                    {lvl === 'Full' ? 'Full (F)' : lvl}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 2. Tyres & Spare Tyre Inspection */}
                          <div className="glass-surface rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                                2. Tyres &amp; Spare Tyre Condition
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {inspectionData.tyreType} · {inspectionData.tyreSize}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              {[
                                { key: 'tyresFrontLeft', label: 'Front Left' },
                                { key: 'tyresFrontRight', label: 'Front Right' },
                                { key: 'tyresRearLeft', label: 'Rear Left' },
                                { key: 'tyresRearRight', label: 'Rear Right' },
                                { key: 'tyresSpare', label: 'Spare Tyre' }
                              ].map((wheel) => (
                                <div key={wheel.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1 border-b border-slate-100 last:border-none">
                                  <span className="font-medium text-slate-700 w-28 shrink-0">{wheel.label}:</span>
                                  <div className="grid grid-cols-5 gap-1 flex-1 font-mono text-[11px]">
                                    {['New', '1/4 Worn', '1/2 Worn', '3/4 Worn', 'Smooth'].map((cond) => (
                                      <button
                                        key={cond}
                                        type="button"
                                        onClick={() => setInspectionData({ ...inspectionData, [wheel.key]: cond })}
                                        className={`py-1 px-1 rounded text-center transition-all cursor-pointer truncate ${
                                          inspectionData[wheel.key] === cond
                                            ? 'bg-emerald-800 text-white font-semibold'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                      >
                                        {cond}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Exterior & Interior Equipment Checklist */}
                          <div className="glass-surface rounded-xl p-4 space-y-3">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                              3. Accessories &amp; Equipment Checklist
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Hub Caps (H/Caps)</label>
                                <select
                                  value={inspectionData.hubCaps}
                                  onChange={(e) => setInspectionData({ ...inspectionData, hubCaps: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Emblems</label>
                                <select
                                  value={inspectionData.emblems}
                                  onChange={(e) => setInspectionData({ ...inspectionData, emblems: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Trunk Mat</label>
                                <select
                                  value={inspectionData.trunkMat}
                                  onChange={(e) => setInspectionData({ ...inspectionData, trunkMat: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Jack &amp; Tools</label>
                                <select
                                  value={inspectionData.tools}
                                  onChange={(e) => setInspectionData({ ...inspectionData, tools: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Back Board</label>
                                <select
                                  value={inspectionData.backBoard}
                                  onChange={(e) => setInspectionData({ ...inspectionData, backBoard: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Floor Mats</label>
                                <select
                                  value={inspectionData.mats}
                                  onChange={(e) => setInspectionData({ ...inspectionData, mats: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="4">4 Mats Present</option>
                                  <option value="3">3 Mats Present</option>
                                  <option value="2">2 Mats Present</option>
                                  <option value="1">1 Mat Present</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Head Rests</label>
                                <select
                                  value={inspectionData.headRests}
                                  onChange={(e) => setInspectionData({ ...inspectionData, headRests: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="O.K.">O.K.</option>
                                  <option value="Missing">Missing</option>
                                </select>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                <label className="text-slate-500 block text-[11px]">Baby Seat (# &amp; Cond)</label>
                                <select
                                  value={inspectionData.babySeatCount}
                                  onChange={(e) => setInspectionData({ ...inspectionData, babySeatCount: e.target.value })}
                                  className="w-full mt-1 bg-transparent font-semibold text-slate-800 focus:outline-none"
                                >
                                  <option value="0">None (0)</option>
                                  <option value="1">1 (Clean / Good)</option>
                                  <option value="2">2 (Clean / Good)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* 4. Body Damage & Diagram Notes */}
                          {/* Explicit "No Existing Damage" Toggle */}
                          <label
                            className={`p-4 rounded-xl flex items-center justify-between gap-3.5 cursor-pointer transition-all ${noExistingDamage
                              ? 'glass-cta text-white'
                              : 'glass-surface text-brand-ink hover:border-brand-teal/50'
                              }`}
                          >
                            <div className="text-sm">
                              <span className="font-mono font-semibold uppercase tracking-wider block">
                                Explicitly Note: NO Existing Damage on Vehicle
                              </span>
                              <span
                                className={
                                  noExistingDamage ? 'text-white/85 text-xs mt-0.5 block' : 'text-slate-600 text-xs mt-0.5 block'
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

                          {/* Zone Selector Pills & Diagram Notes */}
                          <div className="space-y-2.5">
                            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                              Or Tap Zones to Log Existing Scratches / Dents on Check Sheet (Front/Right &amp; Left/Rear):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {VEHICLE_CHECK_ZONES.map((zone) => {
                                const marked = damagedZones.includes(zone.label);
                                return (
                                  <button
                                    key={zone.id}
                                    type="button"
                                    onClick={() => toggleDamageZone(zone.label)}
                                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${marked
                                      ? 'bg-brand-amber-soft/90 border border-brand-amber text-brand-amber-ink backdrop-blur-xs'
                                      : 'glass-pill text-slate-700 hover:bg-white/75 hover:border-brand-teal/50'
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
                              className="w-full p-3 rounded-xl glass-surface text-sm text-brand-ink focus:border-brand-palm focus:outline-none"
                              placeholder="Check sheet inspection remarks (e.g. Front/Right or Left/Rear diagram notes)..."
                            />
                          </div>

                          {/* Dual Video Recording Verification */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setCustomerVideoRecorded((v) => !v)}
                              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${customerVideoRecorded
                                ? 'bg-brand-palm-soft/75 border border-brand-palm/40 backdrop-blur-md text-brand-ink'
                                : 'glass-surface hover:border-brand-teal/50 text-brand-ink'
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
                              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${agentVideoRecorded
                                ? 'bg-brand-palm-soft/75 border border-brand-palm/40 backdrop-blur-md text-brand-ink'
                                : 'glass-surface hover:border-brand-teal/50 text-brand-ink'
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

                          {/* Itemized Billing Breakdown Card */}
                          <div className="glass-surface rounded-xl p-4 space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block border-b border-brand-ink/10 pb-1.5">
                              Billing Breakdown (USD)
                            </span>
                            <div className="grid grid-cols-2 gap-y-1 text-xs font-mono">
                              <span className="text-slate-600 font-sans">
                                Rental Duration ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} @ ${activeVehicle.ratePerDay}/day):
                              </span>
                              <span className="text-right font-semibold">${activeVehicle.ratePerDay * rentalDays}.00</span>

                              <span className="text-slate-600 font-sans">Collision Damage Waiver (CDW):</span>
                              <span className="text-right">${rentalDays * 20}.00 (Included Option)</span>

                              {toursTotal > 0 && (
                                <>
                                  <span className="text-slate-600 font-sans">Tours &amp; Add-ons:</span>
                                  <span className="text-right">+${toursTotal}.00</span>
                                </>
                              )}

                              <span className="text-slate-600 font-sans">GOVT. TAX (GCT - 15%):</span>
                              <span className="text-right">${Math.round((activeVehicle.ratePerDay * rentalDays + toursTotal + rentalDays * 20) * 0.15)}.00</span>

                              <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                                <span className="font-sans">Total Rental Charges:</span>
                                <span>${activeVehicle.ratePerDay * rentalDays + toursTotal + rentalDays * 20}.00 USD</span>
                              </div>

                              <div className="col-span-2 flex justify-between text-xs text-slate-600">
                                <span className="font-sans">Card Security Deposit Hold:</span>
                                <span>${activeVehicle.deposit}.00 (Pre-Auth)</span>
                              </div>
                            </div>
                          </div>

                          {/* Official Contract Clauses & Mandatory Disclosures */}
                          <div className="glass-surface rounded-xl divide-y divide-brand-ink/10 overflow-hidden text-xs sm:text-sm">
                            <div className="p-3 bg-brand-teal/5">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                                Official Contract Terms &amp; Policies
                              </span>
                            </div>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-white/45">
                              <input
                                type="checkbox"
                                checked={ackDamageResponsibility}
                                onChange={(e) => setAckDamageResponsibility(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink block">
                                  1. Minimum Age (21+) &amp; Full Damage / Accident Liability
                                </span>
                                <span className="text-slate-600 mt-0.5 block leading-snug">
                                  Minimum rental age is 21 years. Customer acknowledges full legal and financial responsibility for any collision, damages, or losses to the vehicle during rental.
                                </span>
                              </div>
                            </label>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer bg-brand-amber-soft/55 hover:bg-brand-amber-soft/80">
                              <input
                                type="checkbox"
                                checked={ackThirdPartyInsurance}
                                onChange={(e) => setAckThirdPartyInsurance(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4 text-brand-amber-ink shrink-0" />
                                  2. Third-Party Insurance Only &amp; CDW Terms
                                </span>
                                <span className="text-slate-700 mt-0.5 block leading-snug">
                                  Third-party insurance covers third parties only and does not cover the rental vehicle. Renter is responsible for the first $3,500 / $4,500 USD collision damage excess. Negligence voids CDW.
                                </span>
                              </div>
                            </label>

                            <label className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-white/45">
                              <input
                                type="checkbox"
                                checked={copiesDistributed}
                                onChange={(e) => setCopiesDistributed(e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-brand-palm rounded cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-brand-ink block">
                                  3. Returns, Tyres/Rims Liability, No Refund Policy &amp; Emergency 119
                                </span>
                                <span className="text-slate-600 mt-0.5 block leading-snug">
                                  Vehicle must be returned to same location on/before due date/time (or drop charge applies). Renter is fully liable for rims and tyres. <strong>NO REFUND — CREDIT NOTE ONLY</strong> (valid 1 year). In case of accident, call 119. Customer copy delivered and office original retained.
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
                                Rental{toursTotal > 0 ? ' & Add-Ons' : ' Rate'} ($
                                {activeVehicle.ratePerDay * rentalDays + toursTotal}.00 USD) — Cash
                                or Card accepted:
                              </span>
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setRentalPaymentMethod('cash')}
                                  className={`min-h-[46px] py-2.5 px-3.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${rentalPaymentMethod === 'cash'
                                    ? 'glass-cta text-white'
                                    : 'glass-pill text-slate-700 hover:bg-white/75 hover:border-brand-teal/50'
                                    }`}
                                >
                                  <Banknote className="w-4 h-4 shrink-0" />
                                  <span>Cash (Rental Rate)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRentalPaymentMethod('card')}
                                  className={`min-h-[46px] py-2.5 px-3.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${rentalPaymentMethod === 'card'
                                    ? 'glass-cta text-white'
                                    : 'glass-pill text-slate-700 hover:bg-white/75 hover:border-brand-teal/50'
                                    }`}
                                >
                                  <CreditCard className="w-4 h-4 shrink-0" />
                                  <span>Card (Rental Rate)</span>
                                </button>
                              </div>
                            </div>

                            {/* Part B: Security Deposit ($500 Card Only — Cash Blocked) */}
                            <div className="p-3.5 rounded-xl glass-surface space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-brand-ink">
                                  Security Deposit: ${activeVehicle.deposit}.00 USD (Card Only)
                                </span>
                                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-rose-50/85 border border-rose-200 text-rose-700 shrink-0">
                                  Cash Never Accepted
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                                Cash is never accepted for the deposit so additional funds can be
                                collected via POS if damages exceed the initial $500.
                              </p>
                            </div>

                            {/* Card on File Input */}
                            <div className="glass-surface rounded-xl divide-y divide-brand-ink/10 overflow-hidden">
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
                    <div className="border-t border-brand-ink/10 bg-white/55 backdrop-blur-xl p-5 space-y-3">
                      {formError && (
                        <div className="p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
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
                              className="min-h-[48px] px-4 py-3 rounded-xl glass-pill hover:bg-white/75 text-sm sm:text-base font-medium text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleAdvanceStep}
                            className="min-h-[48px] flex-1 py-3 px-4 rounded-xl glass-cta text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                              ${activeVehicle.ratePerDay * rentalDays + toursTotal}.00 + $
                              {activeVehicle.deposit}.00 Hold
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setFormError('');
                                setCheckoutStep(3);
                              }}
                              className="min-h-[48px] px-4 py-3 rounded-xl glass-pill hover:bg-white/75 text-sm sm:text-base font-medium text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>
                            <button
                              type="submit"
                              className="min-h-[48px] flex-1 py-3 px-4 rounded-xl glass-cta text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                <div className="px-6 py-4 border-b border-brand-ink/10 flex items-center justify-between gap-3 bg-white/50 backdrop-blur-xl">
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
                    className="p-2.5 rounded-xl glass-pill text-slate-600 hover:text-brand-ink cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Internal Counter Agent Action Bar */}
                <div className="px-6 py-3 border-b border-brand-ink/10 bg-white/35 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">
                    Internal counter intake &amp; walk-around check sheet
                  </span>
                  <button
                    type="button"
                    onClick={() => openCheckoutDrawer(FLEET[0])}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl glass-pill hover:bg-white/80 text-xs font-semibold text-brand-ink cursor-pointer shrink-0"
                  >
                    + Counter Intake
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-brand-ink/10">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-5 space-y-3.5 hover:bg-white/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-mono font-semibold text-brand-ink glass-pill px-2.5 py-0.5 rounded-md">
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
                        <div className="w-24 h-14 rounded-xl bg-white/85 border border-white/90 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={res.vehicle.image}
                            alt={res.vehicle.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
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
                          className="flex-1 py-2.5 px-3 rounded-xl glass-pill hover:bg-white/75 text-sm font-medium text-brand-ink cursor-pointer"
                        >
                          Contract & Check Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => openReturnDrawerFor(res)}
                          className="flex-1 py-2.5 px-3 rounded-xl glass-cta text-sm font-medium text-white transition-all cursor-pointer"
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
                <div className="px-6 py-4 border-b border-brand-ink/10 flex items-center justify-between gap-3 bg-white/50 backdrop-blur-xl">
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
                    className="p-2.5 rounded-xl glass-pill text-slate-600 hover:text-brand-ink cursor-pointer"
                    aria-label="Close return drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-brand-ink/10">
                  {/* Rental Selector if multiple contracts exist */}
                  {reservations.length > 1 && (
                    <div className="px-6 py-3.5 bg-white/35 backdrop-blur-md flex items-center justify-between gap-3 text-sm">
                      <span className="font-mono text-slate-600">Active Contract:</span>
                      <select
                        value={activeReturnBooking.id}
                        onChange={(e) => {
                          const found = reservations.find((r) => r.id === e.target.value);
                          if (found) openReturnDrawerFor(found);
                        }}
                        className="glass-pill rounded-xl px-3 py-1.5 font-mono text-sm text-brand-ink"
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
                  <div className="p-5 bg-white/35 backdrop-blur-md text-sm space-y-1.5">
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

                      <div className="inline-flex rounded-xl glass-pill p-1 text-sm">
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
                          className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${!returnDraft.hasNewDamage
                            ? 'glass-cta text-white'
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
                          className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${returnDraft.hasNewDamage
                            ? 'glass-cta text-white'
                            : 'text-slate-600 hover:text-brand-ink'
                            }`}
                        >
                          Damage Present
                        </button>
                      </div>
                    </div>

                    {/* Return Odometer, Fuel Level & Belongings Verification */}
                    <div className="glass-surface rounded-xl p-4 space-y-3 text-xs sm:text-sm">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                        Return Vehicle Check-In Data
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-500 block font-mono text-xs">Return Mileage In (km)</label>
                          <input
                            type="number"
                            value={returnDraft.mileageIn || 48690}
                            onChange={(e) => setReturnDraft({ ...returnDraft, mileageIn: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block font-mono text-xs">Return Fuel Level</label>
                          <select
                            value={returnDraft.fuelLevelIn || 'Full'}
                            onChange={(e) => setReturnDraft({ ...returnDraft, fuelLevelIn: e.target.value })}
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono text-sm text-brand-ink"
                          >
                            <option value="Full">Full (F)</option>
                            <option value="3/4">3/4 Tank</option>
                            <option value="1/2">1/2 Tank</option>
                            <option value="1/4">1/4 Tank</option>
                            <option value="0">Empty (0)</option>
                          </select>
                        </div>
                      </div>

                      {/* Mandatory Checked for Personal Belongings */}
                      <label className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/70 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={returnDraft.checkedPersonalBelongings}
                          onChange={(e) => setReturnDraft({ ...returnDraft, checkedPersonalBelongings: e.target.checked })}
                          className="mt-0.5 w-5 h-5 accent-emerald-800 rounded shrink-0 cursor-pointer"
                        />
                        <span className="text-slate-800 font-medium text-xs sm:text-sm leading-snug">
                          <strong>Checked for Personal Belongings:</strong> Agent and renter conducted thorough sweep of vehicle cabin, glove compartment, door pockets, and trunk. No personal property left behind.
                        </span>
                      </label>
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
                                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-all ${returnDraft.estimateCost === p.cost
                                  ? 'glass-cta text-white'
                                  : 'glass-pill text-slate-700 hover:bg-white/75'
                                  }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Check Sheet Damage Type & Estimate */}
                        <div className="glass-surface rounded-xl divide-y divide-brand-ink/10 overflow-hidden">
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
                    <div className="grid grid-cols-3 divide-x divide-brand-ink/10 glass-surface rounded-xl text-center font-mono tabular-nums">
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
                      <div className="glass-surface rounded-xl divide-y divide-brand-ink/10 overflow-hidden text-sm">
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
                <div className="border-t border-brand-ink/10 bg-white/55 backdrop-blur-xl p-5 space-y-3">
                  {returnError && (
                    <div className="p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
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
                        className="px-4 py-3 rounded-xl glass-pill text-sm font-medium text-slate-700 hover:text-brand-ink inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Re-run</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleProcessReturnPos}
                      className="flex-1 py-3.5 px-4 rounded-xl glass-cta text-white text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
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
          PUBLIC 4-STEP CUSTOMER CHECKOUT WIZARD MODAL
         ========================================================= */}
      {guestCheckoutVehicle && (
        <PublicCheckoutModal
          vehicle={guestCheckoutVehicle}
          location={selectedLocation}
          dropLocation={selectedDropLocation}
          pickupFee={pickupFee}
          dropFee={dropFee}
          pickupDateLabel={`${formatShortDate(pickupDate)} · ${pickupTime}`}
          returnDateLabel={`${formatShortDate(returnDate)} · ${returnTime}`}
          rentalDays={rentalDays}
          selectedTours={selectedTours}
          onToggleTour={handleToggleTour}
          onClose={() => setGuestCheckoutVehicle(null)}
          onBookingConfirmed={({
            bookingRef,
            guest,
            totalAuthorized,
            contractSignature: guestSig,
            rentalSubtotal,
            toursSubtotal,
            pickupFee: confirmedPickupFee,
            dropFee: confirmedDropFee
          }) => {
            const finalPickupDropFee = (confirmedPickupFee ?? pickupFee) + (confirmedDropFee ?? dropFee);
            const newOnlineBooking = {
              id: bookingRef,
              createdAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }),
              acquisitionChannel: 'Online Guest Checkout (Pre-Authorized)',
              vehicle: guestCheckoutVehicle,
              location: selectedLocation,
              dropLocation: selectedDropLocation,
              pickupDate,
              pickupTime,
              returnDate,
              returnTime,
              rentalDays,
              subtotal: rentalSubtotal + toursSubtotal + finalPickupDropFee,
              vehicleSubtotal: rentalSubtotal,
              toursSubtotal,
              pickupDropFee: finalPickupDropFee,
              selectedTours: [...selectedTours],
              deposit: guestCheckoutVehicle.deposit ?? 500,
              rentalPaymentMethod: 'card',
              cardHolder: (guest.fullName || 'GUEST').toUpperCase(),
              cardLast4: 'AUTH',
              sendViaWhatsApp: true,
              driver: {
                fullName: guest.fullName,
                dob: 'Verified at Pickup',
                licenseNumber: 'Verified at Pickup',
                licenseExpiry: 'Verified at Pickup',
                email: guest.email,
                phone: guest.whatsappPhone,
                idVerified: true
              },
              inspection: {
                noExistingDamage: true,
                damagedZones: [],
                notes:
                  'Online Pre-Inspection Baseline acknowledged (8/8 full fuel guarantee & 5-minute physical walk-around at pickup).',
                customerVideoRecorded: false,
                agentVideoRecorded: false,
                checkSheetSignature: guestSig
              },
              contract: {
                ackDamageResponsibility: true,
                ackThirdPartyInsurance: true,
                copiesDistributed: true,
                contractSignature: guestSig
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

            setReservations((prev) => [newOnlineBooking, ...prev]);
            setSuccessNotification(
              `Authorized $${totalAuthorized} USD hold for ${guest.fullName} (Ref: ${bookingRef}).`
            );
            setTimeout(() => {
              setSuccessNotification(null);
            }, 5000);
          }}
        />
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

      {/* =========================================================
          RENTAL INFORMATION & CONTACT MODALS
         ========================================================= */}
      <RentalInfoModal
        isOpen={isRentalInfoModalOpen}
        onClose={() => setIsRentalInfoModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Floating Action Buttons */}
      <ScrollToTop />
      <WhatsAppWidget />
    </div>
  );
}
