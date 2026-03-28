'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function useUserTour() {
    const startTour = () => {
        const d = driver({
            showProgress: true,
            animate: true,
            overlayColor: 'rgba(10, 15, 30, 0.85)',
            steps: [
                {
                    element: '#dashboard-logo',
                    popover: {
                        title: 'NIVESHIQ ORACLE',
                        description: 'Your central intelligence hub for wealth optimization.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#desktop-nav-links',
                    popover: {
                        title: 'QUICK MISSION CONTROL',
                        description: 'Access critical modules directly from the navigation bar.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: 'nav aside',
                    popover: {
                        title: 'INTEL SIDEBAR',
                        description: 'Navigate through different financial protocols from X-Ray to Tax Wizard.',
                        side: "right",
                        align: 'start'
                    }
                },
                {
                    element: '#noti-trigger',
                    popover: {
                        title: 'LIVE INTEL FEED',
                        description: 'Receive real-time alerts on market anomalies and portfolio drifts.',
                        side: "bottom",
                        align: 'end'
                    }
                },
                {
                    element: '#profile-trigger',
                    popover: {
                        title: 'IDENTITY VAULT',
                        description: 'Manage your biometric data and security protocols here.',
                        side: "bottom",
                        align: 'end'
                    }
                }
            ],
            onDeselected: () => {
                localStorage.setItem('niveshiq_tour_completed', 'true');
            }
        });

        d.drive();
    };

    useEffect(() => {
        const completed = localStorage.getItem('niveshiq_tour_completed');
        if (!completed) {
            // Optional: Start automatically on first visit after a delay
            // const timer = setTimeout(startTour, 3000);
            // return () => clearTimeout(timer);
        }
    }, []);

    return { startTour };
}
