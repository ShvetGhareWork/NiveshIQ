import { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useDashboardTour = () => {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            smoothScroll: true,
            popoverClass: 'driverjs-theme',
            nextBtnText: 'NEXT NODE →',
            prevBtnText: '← PREV NODE',
            doneBtnText: 'FINALIZE INITIALIZATION',
            steps: [
                { 
                    element: '#hero-section', 
                    popover: { 
                        title: 'ORACLE CORE ONLINE', 
                        description: 'SYSTEM INITIALIZED. YOUR FINANCIAL INTELLIGENCE LAYER IS NOW ARCHITECTING REAL-TIME INSIGHTS. ALL SENSORS ARE REPORTING NOMINAL.', 
                        side: "bottom", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#health-gauge-card', 
                    popover: { 
                        title: 'BIOMETRIC VITALITY', 
                        description: 'THIS GAUGE MEASURES YOUR COMPOSITE FINANCIAL HEALTH. A SCORE ABOVE 85 INDICATES STRUCTURAL SOUNDNESS IN YOUR PORTFOLIO TOPOLOGY.', 
                        side: "right", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#performance-chart-card', 
                    popover: { 
                        title: 'XIRR FREQUENCY ANALYSIS', 
                        description: 'TRACKING REAL-TIME RETURNS VS INDUSTRY BENCHMARKS. OUR ALGORITHMS MAP YOUR INTERNAL RATE OF RETURN AGAINST GLOBAL MARKET VOLATILITY.', 
                        side: "bottom", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#treemap-card', 
                    popover: { 
                        title: 'ASSET HIERARCHY', 
                        description: 'A SPATIAL MAP OF YOUR CAPITAL CONCENTRATION. DRILL DOWN INTO LARGE, MID, AND SMALL-CAP NODES TO BALANCE SYSTEMIC RISK.', 
                        side: "top", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#radar-analysis-card', 
                    popover: { 
                        title: '6-DIMENSION MATRIX', 
                        description: 'A POLAR ANALYSIS OF RISK, RETURN, DIVERSIFICATION, TAXIMETRY, LIQUIDITY, AND QUALITY. OPTIMIZE FOR A BALANCED HEXAGONAL GEOMETRY.', 
                        side: "left", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#diagnostic-cta', 
                    popover: { 
                        title: 'SERVICE 02: DEEP SCAN', 
                        description: 'READY FOR FULL SYSTEM DIAGNOSTICS? INITIATE THE 5-MINUTE VITALITY TEST TO MAP YOUR INSURANCE, DEBT, AND SAVINGS GAP.', 
                        side: "bottom", 
                        align: 'end' 
                    } 
                },
            ],
            onDestroyed: () => {
                localStorage.setItem('hasSeenDashboardTour', 'true');
            }
        });

        // Add a small delay for components to mount and animations to settle
        const timer = setTimeout(() => {
            driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);
};
