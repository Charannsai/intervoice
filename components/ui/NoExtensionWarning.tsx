'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function NoExtensionWarning() {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Check for common extension attributes
        const checkForExtensions = () => {
            const elements = document.querySelectorAll('[bis_skin_checked], [data-lastpass-icon-root]');
            if (elements.length > 0 && process.env.NODE_ENV === 'development') {
                setShowWarning(true);
            }
        };

        // Check after a short delay to allow extensions to modify DOM
        const timer = setTimeout(checkForExtensions, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!showWarning) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-1">Browser Extension Detected</h4>
                    <p className="text-sm text-yellow-800">
                        A browser extension (likely Bitwarden or LastPass) is modifying the page.
                        If you see hydration errors, try disabling extensions or use an incognito window.
                    </p>
                </div>
                <button
                    onClick={() => setShowWarning(false)}
                    className="text-yellow-600 hover:text-yellow-800"
                    aria-label="Close warning"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
