'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderQuery = searchParams.get('orderNumber') || '';
  const [orderNumber, setOrderNumber] = useState(orderQuery);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (orderQuery) {
      handleSearchTrack(orderQuery);
    }
  }, [orderQuery]);

  const handleSearchTrack = (query: string) => {
    setSearched(true);
    if (query.trim().toUpperCase().includes('PBH') || query.length > 3) {
      setTrackedOrder({
        orderNumber: query.toUpperCase(),
        courier: 'Shiprocket Express',
        awb: 'SR-884920194',
        status: 'In Transit',
        origin: 'Himalayan Bio-Farms Warehouse, HP',
        destination: 'Bengaluru, Karnataka',
        estimatedDelivery: 'August 6, 2026',
        timeline: [
          { status: 'Order Verified & Packed', date: 'August 3, 2026 - 11:30 AM', done: true },
          { status: 'Handed over to Shiprocket Express', date: 'August 3, 2026 - 04:15 PM', done: true },
          { status: 'In Transit via Regional Hub', date: 'August 4, 2026 - 09:00 AM', done: true },
          { status: 'Out for Local Delivery', date: 'Expected August 6', done: false },
          { status: 'Delivered', date: 'Expected August 6', done: false },
        ]
      });
    } else {
      setTrackedOrder(null);
    }
  };

  return (
    <div className="py-16 bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
            Live Shipment Lookup
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-darkGreen">
            Track Your Tea Order
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Enter your 11-digit Order Number (e.g. PBH-2026-9812) or Shiprocket AWB tracking code.
          </p>
        </div>

        {/* Search input */}
        <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="e.g. PBH-2026-9812"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs border border-gray-300 rounded-input focus:outline-none focus:border-brand-green"
          />
          <button
            onClick={() => handleSearchTrack(orderNumber)}
            className="bg-brand-green text-white text-xs font-bold px-6 py-2.5 rounded-button hover:bg-brand-darkGreen shadow-soft"
          >
            Track Order
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {trackedOrder ? (
              <div className="bg-white p-8 rounded-card border border-brand-mint/30 shadow-premium space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-badge">
                      Status: {trackedOrder.status}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-brand-darkGreen mt-1">
                      {trackedOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-gray-500">AWB: <strong className="font-mono text-brand-green">{trackedOrder.awb}</strong> via {trackedOrder.courier}</p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-gray-400 block">Est. Delivery:</span>
                    <span className="font-bold text-brand-darkGreen text-sm">{trackedOrder.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-brand-darkGreen uppercase tracking-wider">Shipment History Timeline</h4>
                  <div className="space-y-3">
                    {trackedOrder.timeline.map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          step.done ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-bold ${step.done ? 'text-brand-darkGreen' : 'text-gray-400'}`}>{step.status}</h5>
                          <span className="text-[10px] text-gray-400">{step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-card border border-brand-mint/30 shadow-card text-center text-xs space-y-2">
                <p className="font-bold text-red-600">No order found matching &quot;{orderNumber}&quot;</p>
                <p className="text-gray-500">Please check your confirmation email for your PBH order number or contact customer care.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-brand-darkGreen font-bold">Loading Shipment Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
