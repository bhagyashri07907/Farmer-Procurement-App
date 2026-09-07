import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CalendarPlus,
  CalendarCheck,
  Ticket,
  Activity,
  IndianRupee,
  User,
  ChevronRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { MobileLayout } from '../layouts/MobileLayout';
import { useAuth } from '../hooks/useAuth';
import { getMyBookings } from '../services/api';
import { Booking } from '../types';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { farmer } = useAuth();
  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (farmer) {
      getMyBookings(farmer.id).then((bookings) => {
        if (bookings && bookings.length > 0) {
          setLatestBooking(bookings[0]);
        }
      });
    }
  }, [farmer]);

  const firstName = farmer?.fullName?.split(' ')[0] || 'Farmer';

  return (
    <MobileLayout>
      <div className="p-4 sm:p-6 space-y-4">
        {/* Welcome Card */}
        <div id="dashboard-welcome-banner" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full opacity-60 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-800 border border-emerald-200 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>MSP Procurement Portal</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-800">
              {t('welcome')}, {firstName}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Farmer ID: <span className="text-slate-700">{farmer?.farmerId || 'MH-PUN-2026-0814'}</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {farmer?.village}, Tal. {farmer?.taluka}, Dist. {farmer?.district}
            </p>
          </div>
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🌾
          </div>
        </div>

        {/* Hero Section: Book New Procurement Slot */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                Book New<br />Procurement Slot
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Select your district location to view available MSP procurement centers and booking slots.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CalendarPlus className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Intake District
              </span>
              <span className="font-bold text-slate-900">
                {farmer?.district || 'Pune'} (Tal. {farmer?.taluka || 'Baramati'})
              </span>
            </div>
            <Link
              to="/select-location"
              className="text-emerald-800 font-bold underline text-[11px] hover:text-emerald-950"
            >
              Change Location
            </Link>
          </div>

          <Link
            to="/select-location"
            id="btn-book-slot-hero"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 active:scale-[0.99] flex items-center justify-center gap-2 transition"
          >
            <span>Confirm Location & Start Booking</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Geometric Metric Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              Total Sold
            </p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              145 <span className="text-sm font-semibold text-slate-400">Qtl</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              Active Bookings
            </p>
            <p className="text-3xl font-black text-emerald-800 leading-none">
              {latestBooking ? '01' : '00'}
            </p>
          </div>
        </div>

        {/* Active Digital Token (Geometric Balance style) */}
        {latestBooking && (
          <div id="dashboard-active-token-preview" className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-600 border-x border-b border-slate-200 relative overflow-hidden space-y-4">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full opacity-60 pointer-events-none" />
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Active Token
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {latestBooking.status}
              </span>
            </div>

            <div className="text-center py-2">
              <div className="inline-block bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200 mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOKEN ID</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black tracking-tighter text-emerald-800 font-mono">
                {latestBooking.digitalToken}
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Crop</span>
                <span className="font-bold text-slate-900">{latestBooking.cropName}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Center</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">{latestBooking.centerName}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">{latestBooking.date} • {latestBooking.timeSlot}</span>
              </div>
            </div>

            <Link
              to={`/token/${latestBooking.id}`}
              className="mt-2 bg-slate-800 hover:bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase shadow-sm transition"
            >
              <span>{t('cardDigitalToken')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Dashboard Menu Section */}
        <div className="space-y-3 pt-1">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
            Dashboard Menu
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. Book Slot */}
            <Link
              to="/select-crop"
              id="dash-card-book-slot"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardBookSlot')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardBookSlotDesc')}
                </p>
              </div>
            </Link>

            {/* 2. My Bookings */}
            <Link
              to="/bookings"
              id="dash-card-my-bookings"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardMyBookings')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardMyBookingsDesc')}
                </p>
              </div>
            </Link>

            {/* 3. Digital Token */}
            <Link
              to="/token"
              id="dash-card-digital-token"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardDigitalToken')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardDigitalTokenDesc')}
                </p>
              </div>
            </Link>

            {/* 4. Procurement Status */}
            <Link
              to="/procurement-status"
              id="dash-card-procurement-status"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardProcurementStatus')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardProcurementStatusDesc')}
                </p>
              </div>
            </Link>

            {/* 5. Payment Status */}
            <Link
              to="/payment-status"
              id="dash-card-payment-status"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardPaymentStatus')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardPaymentStatusDesc')}
                </p>
              </div>
            </Link>

            {/* 6. Profile */}
            <Link
              to="/profile"
              id="dash-card-profile"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex flex-col justify-between h-34 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  {t('cardProfile')}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {t('cardProfileDesc')}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Support Card (from Geometric Balance Design) */}
        <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Support</p>
          <p className="text-sm text-emerald-100 mb-4">
            Need help booking your slot? Contact the local procurement office or call toll-free.
          </p>
          <a
            href="tel:18001208040"
            className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center block shadow-sm transition"
          >
            Call Toll Free: 1800-120-8040
          </a>
        </div>
      </div>
    </MobileLayout>
  );
};
